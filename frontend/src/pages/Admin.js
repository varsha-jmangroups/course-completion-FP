import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CoursePopup from './CoursePopup';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import { useNavigate } from 'react-router-dom'; 
import LearningPath from './LearningPath';
import Sidebar from '../components/Sidebar'; // Sidebar Component
import AddNewEmployeeModal from '../components/AddNewEmployeeModal';
import NewCourseModal from '../components/NewCourseModal';
// import EmployeeTable from '../components/EmployeeTable';
// import CourseTable from '../components/CourseTable';
// import LearningPathTable from '../components/LearningPathTable';
import EmployeeCourseGraph from '../components/EmployeeCourseGraph';
import NavigationBar from '../components/NavigationBar';

import EmployeePerformanceMetricsGraph from '../components/EmployeePerformanceMetricsGraph';
import CourseCompletionRateGraph from '../components/CourseCompletionRateGraph'; // Import your new component
import EmployeeEnrollmentOverviewGraph from '../components/EmployeeEnrollmentOverviewGraph'; // Import your new component
import EnrollmentStatisticsGraph from '../components/EnrollmentStatisticsGraph'; // Import your new component
import LearningPathOverviewGraph from '../components/LearningPathOverviewGraph'; 
import CountCard from '../components/CountCard';
function AdminDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [showLearningPathModal, setShowLearningPathModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', role: '' });
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '', difficulty: '' });
  const [error, setError] = useState('');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [selectedLearningPath, setSelectedLearningPath] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUsersCoursesAndPaths = async () => {
    setLoading(true); // Start loading
    try {
      const [usersResponse, coursesResponse, pathsResponse, enrollmentsResponse] = await Promise.all([
        axios.get('http://localhost:3000/users'),
        axios.get('http://localhost:3000/courses'),
        axios.get('http://localhost:3000/learning-paths'),
        axios.get('http://localhost:3000/enrollments'),
      ]);
      setEmployees(usersResponse.data);
      setCourses(coursesResponse.data);
      setLearningPaths(pathsResponse.data);
      setEnrollments(enrollmentsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  fetchUsersCoursesAndPaths();
}, []);

  // const handleLearningPathClick = (learningPath) => {
  //   setSelectedLearningPath(learningPath);
  //   setShowLearningPathModal(true);
  // };

  const handleCloseLearningPathModal = () => {
    setShowLearningPathModal(false);
    setSelectedLearningPath(null);
  };

  // const deleteUser = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this employee?')) {
  //     try {
  //       await axios.delete(`http://localhost:3000/users/${id}`);
  //       setEmployees(employees.filter(employee => employee.id !== id));
  //     } catch (error) {
  //       console.error('Error deleting user:', error);
  //     }
  //   }
  // };

  // const deleteCourse = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this course?')) {
  //     try {
  //       await axios.delete(`http://localhost:3000/courses/${id}`);
  //       setCourses(courses.filter(course => course.id !== id));
  //     } catch (error) {
  //       console.error('Error deleting course:', error);
  //     }
  //   }
  // };

  // const deleteLearningPath = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this learning path?')) {
  //     try {
  //       await axios.delete(`http://localhost:3000/learning-paths/${id}`);
  //       setLearningPaths(learningPaths.filter(path => path.id !== id));
  //     } catch (error) {
  //       console.error('Error deleting learning path:', error);
  //     }
  //   }
  // };

  // const handleViewCourses = (employee) => {
  //   setSelectedEmployee(employee);
  //   setPopupVisible(true);
  // };

  // const handleAddCourseToLearningPath = async (courseId) => {
  //   if (selectedLearningPath) {
  //     try {
  //       await axios.post(`http://localhost:3000/learning-paths/${selectedLearningPath.id}/courses`, { courseId });
  //       const response = await axios.get('http://localhost:3000/learning-paths');
  //       setLearningPaths(response.data);
  //     } catch (error) {
  //       console.error('Error adding course to learning path:', error);
  //     }
  //   }
  // };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.password) {
      setError('Name, email, and password are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/register', newEmployee);
      setEmployees([...employees, response.data]);
      resetNewEmployee();
      setError('');
      setShowAddEmployeeModal(false);
    } catch (error) {
      console.error('Error adding employee:', error);
      setError('Failed to add employee');
    }
  };

  const updateCourses = async () => {
    if (selectedEmployee) {
      try {
        const response = await axios.get(`http://localhost:3000/users/${selectedEmployee.id}/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error updating courses:', error);
      }
    }
  };

  const resetNewEmployee = () => {
    setNewEmployee({ name: '', email: '', password: '', role: '' });
  };

  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.duration || !newCourse.difficulty) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/courses', newCourse);
      setCourses([...courses, response.data]);
      resetNewCourse();
      setError('');
      setShowAddCourseModal(false);
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course');
    }
  };

  const resetNewCourse = () => {
    setNewCourse({ title: '', description: '', duration: '', difficulty: '' });
  };

  return (
    <div className="admin-dashboard">
      <NavigationBar resetNewCourse={resetNewCourse} setShowAddCourseModal={setShowAddCourseModal} resetNewEmployee={resetNewEmployee} setShowAddEmployeeModal={setShowAddEmployeeModal} setShowLearningPathModal={setShowLearningPathModal} />
      <Container fluid style={{marginTop: '60px'}}>
        <Row>
          <Col xs={2}>
            {/* Sidebar Component */}
            <Sidebar 
              resetNewCourse={resetNewCourse} 
              setShowAddCourseModal={setShowAddCourseModal}
              resetNewEmployee={resetNewEmployee}
              setShowAddEmployeeModal={setShowAddEmployeeModal}
              setShowLearningPathModal={setShowLearningPathModal}
            />
          </Col>
          <Col xs={10}>
           {/* Count Cards Row */}
           <Row className="mb-4" style={{ justifyContent: 'space-around' }}>
              <Col xs={12} md={4}>
                <CountCard title="Number of Employees" count={employees.length} color="#4CAF50" />
              </Col>
              <Col xs={12} md={4}>
                <CountCard title="Number of Courses" count={courses.length} color="#2196F3" />
              </Col>
              <Col xs={12} md={4}>
                <CountCard title="Number of Learning Paths" count={learningPaths.length} color="#FF9800" />
              </Col>
            </Row>
          
          <Row className="mb-4" style={{ justifyContent: 'space-around' }}>
  
  <Col xs={12} md={6} lg={6}>
    <EmployeePerformanceMetricsGraph employees={employees} enrollments={enrollments} />
  </Col>
  <Col xs={12} md={6} lg={6}>
    <CourseCompletionRateGraph courses={courses} enrollments={enrollments} />
  </Col>
  
  <Col xs={12} md={6} lg={6}>
    <EnrollmentStatisticsGraph courses={courses} enrollments={enrollments} />
  </Col>
  <Col xs={12} md={6} lg={6}>
    <LearningPathOverviewGraph learningPaths={learningPaths} />
  </Col>
</Row>

            {/* New Employee Modal */}
            <AddNewEmployeeModal 
              showAddCourseModal={showAddCourseModal} 
              setShowAddEmployeeModal={setShowAddEmployeeModal} 
              showAddEmployeeModal={showAddEmployeeModal} 
              error={error} 
              newEmployee={newEmployee} 
              setNewEmployee={setNewEmployee} 
              handleAddEmployee={handleAddEmployee} 
            />

            {/* New Course Modal */}
            <NewCourseModal 
              showAddCourseModal={showAddCourseModal}
              setShowAddCourseModal={setShowAddCourseModal} 
              error={error} 
              setNewCourse={setNewCourse} 
              newCourse={newCourse} 
              handleAddCourse={handleAddCourse} 
            />

            {/* Employees Table */}
            {/* <h2>Employees</h2> */}
            {/* <EmployeeTable 
              employees={employees} 
              handleViewCourses={handleViewCourses} 
              deleteUser={deleteUser} 
            /> */}

            {/* Courses Table */}
            {/* <h2>Courses</h2>
            <CourseTable 
              courses={courses} 
              deleteCourse={deleteCourse} 
            /> */}
{/* 
            {/* Learning Paths Table 
            <h2>Learning Paths</h2>
            <LearningPathTable learningPaths={learningPaths} /> */}

            {/* Course Popup */}
            {popupVisible && selectedEmployee && (
              <CoursePopup
                employee={selectedEmployee}
                onClose={() => setPopupVisible(false)}
                onUpdateCourses={updateCourses}
                courses={courses}
              />
            )}

            {/* Learning Path Modal */}
            <LearningPath 
              show={showLearningPathModal} 
              handleClose={handleCloseLearningPathModal} 
              selectedLearningPath={selectedLearningPath}
              onSave={(newPath) => {
                setLearningPaths([...learningPaths, newPath]);
              }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;
