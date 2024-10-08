import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function Dashboard() {
  const navigate = useNavigate();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [courses, setCourses] = useState([]);
  const [courseCompletions, setCourseCompletions] = useState([]);
  const [certificates, setCertificates] = useState([]); // New state to hold certificates
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({}); // To track which course is in edit mode
  const [inputCompletion, setInputCompletion] = useState({}); // For local input state

  // Get employee ID from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const employeeId = user ? user.id : null;

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!employeeId) {
        console.error('No employee ID found');
        return;
      }

      try {
        const userResponse = await fetch(`http://localhost:3000/user/${employeeId}/progress`);
        const userProgress = await userResponse.json();

        const coursesResponse = await fetch('http://localhost:3000/courses');
        const courseData = await coursesResponse.json();

        setEmployeeDetails(user || {});
        setCourses(courseData);
        setCourseCompletions(userProgress);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  // Fetch certificates for the user
  useEffect(() => {
    const fetchCertificates = async () => {
      if (!employeeId) return;

      try {
        const certificatesResponse = await fetch(`http://localhost:3000/user/${employeeId}/certificates`);
        const certificateData = await certificatesResponse.json();
        setCertificates(certificateData);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, [employeeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const employeeName = employeeDetails.name || 'Guest';
  const employeeRole = employeeDetails.role || 'N/A';

  // Function to handle completion percentage update
  const handleUpdateCompletion = async (courseId, completionPercentage) => {
    if (completionPercentage < 0 || completionPercentage > 100) {
      alert('Completion percentage must be between 0 and 100');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/enrollment/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completionPercentage }), // Sending the updated percentage
      });

      if (response.ok) {
        setCourseCompletions((prev) =>
          prev.map((comp) =>
            comp.courseId === courseId ? { ...comp, completionPercentage } : comp
          )
        );

        // Generate Certificate if completed
        if (completionPercentage === 100) {
          const certificateResponse = await fetch('http://localhost:3000/certificate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: employeeId,
              courseId,
              certificateUrl: `http://your-certificates-url/${courseId}.pdf`, // Replace with your logic for certificate URL
            }),
          });

          if (certificateResponse.ok) {
            const newCertificate = await certificateResponse.json();
            setCertificates((prevCertificates) => [...prevCertificates, newCertificate.newCertificate]); // Add new certificate to state
            console.log('Certificate generated successfully');
          } else {
            console.error('Failed to generate certificate');
          }
        }
      } else {
        console.error('Failed to update completion percentage');
      }
    } catch (error) {
      console.error('Error updating completion:', error);
    }
  };

  // Toggle edit mode for a specific course
  const toggleEditMode = (courseId) => {
    setEditMode((prev) => ({
      ...prev,
      [courseId]: !prev[courseId], // Toggle the edit mode for this courseId
    }));
  };

  // Handle input change for local completion state
  const handleInputChange = (courseId, value) => {
    setInputCompletion((prev) => ({
      ...prev,
      [courseId]: value,
    }));
  };

  // Save updated completion percentage
  const handleSaveCompletion = (courseId) => {
    const completionPercentage = inputCompletion[courseId];
    handleUpdateCompletion(courseId, completionPercentage);
    toggleEditMode(courseId); // Exit edit mode after saving
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo">CourseConnect</div>
        <div className="employee-info">
          <span>{employeeName} - {employeeRole}</span>
          <button className="btn sign-in-bt" onClick={() => { localStorage.removeItem('user'); navigate('/'); }}>Log Out</button>
        </div>
      </header>

      <main className="enrollments-container">
        <h1>Your Current Enrollments</h1>
        <section className="employee-section">
          <div className="courses-list">
            {courseCompletions.map((completion) => {
              const course = courses.find(c => c.id === completion.courseId);
              return course ? (
                <div key={course.id} className="course-card">
                  <img
                    src="https://img.freepik.com/premium-vector/web-development-concept-isometric-landing-page-team-develops-optimizes-layout-site_9209-7568.jpg"
                    alt="Course"
                    className="course-image"
                  />
                  <div className="course-details">
                    <h3 className="course-title">{course.title}</h3>
                    <p><strong>Duration:</strong> {course.duration} hours</p>
                    <p><strong>Difficulty:</strong> {course.difficulty}</p>
                    <p><strong>Completion:</strong> {completion.completionPercentage}%</p>
                    {completion.completionPercentage === 100 && <p className="certificate">Certificate Earned!</p>}

                    {/* Update Completion Percentage Section */}
                    {completion.completionPercentage < 100 ? (
                      editMode[course.id] ? (
                        <>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={inputCompletion[course.id] || completion.completionPercentage}
                            onChange={(e) => handleInputChange(course.id, parseInt(e.target.value))}
                            placeholder="Update Completion (%)"
                          />
                          <button
                            className="save-btn"
                            onClick={() => handleSaveCompletion(course.id)} // Save button to exit edit mode
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          className="edit-btn"
                          onClick={() => toggleEditMode(course.id)} // Edit button to enter edit mode
                        >
                          Edit
                        </button>
                      )
                    ) : (
                      <p>Course Completed!</p> // Prevent editing once the course is 100% complete
                    )}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </section>

        // Replace the certificates section with this:
<div className="certificates-section">
  <h2>Your Certificates</h2>
  {certificates.length > 0 ? (
    <DataTable value={certificates} responsiveLayout="scroll" stripedRows>
      <Column
        field="courseId"
        header="Course Name"
        body={(rowData) => {
          const course = courses.find((c) => c.id === rowData.courseId);
          return course ? course.title : "Unknown Course";
        }}
      />
      <Column
  field="certificateUrl"
  header="Certificate"
  body={(rowData) => (
    <a href={`/certificate/${rowData.id}`} target="_blank" rel="noopener noreferrer">
      View Certificate
    </a>
  )}
/>
    </DataTable>
  ) : (
    <p>No certificates earned yet.</p>
  )}
</div>
      </main>
    </div>
  );
}

export default Dashboard;
