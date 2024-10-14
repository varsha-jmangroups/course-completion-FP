import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';
import CoursePopup from './CoursePopup';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import { useNavigate } from 'react-router-dom'; 
import LearningPath from './LearningPath';
import Sidebar from '../components/Sidebar'; // Sidebar Component
import AddNewEmployeeModal from '../components/AddNewEmployeeModal';
import NewCourseModal from '../components/NewCourseModal';
import EmployeeTable from '../components/EmployeeTable';
import CourseTable from '../components/CourseTable';
import LearningPathTable from '../components/LearningPathTable';
import EmployeeCourseGraph from '../components/EmployeeCourseGraph';
import NavigationBar from '../components/NavigationBar';

function EmployeeManagementPage() {
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

  useEffect(() => {
    const fetchUsersCoursesAndPaths = async () => {
      try {
        const [usersResponse, coursesResponse, pathsResponse] = await Promise.all([
          axios.get('http://localhost:3000/users'),
          axios.get('http://localhost:3000/courses'),
          axios.get('http://localhost:3000/learning-paths'),
        ]);
        setEmployees(usersResponse.data);
        setCourses(coursesResponse.data);
        console.log("111", courses);
        setLearningPaths(pathsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsersCoursesAndPaths();
  }, []);

  const handleLearningPathClick = (learningPath) => {
    setSelectedLearningPath(learningPath);
    setShowLearningPathModal(true);
  };

  const handleCloseLearningPathModal = () => {
    setShowLearningPathModal(false);
    setSelectedLearningPath(null);
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        setEmployees(employees.filter(employee => employee.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:3000/courses/${id}`);
        setCourses(courses.filter(course => course.id !== id));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const deleteLearningPath = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning path?')) {
      try {
        await axios.delete(`http://localhost:3000/learning-paths/${id}`);
        setLearningPaths(learningPaths.filter(path => path.id !== id));
      } catch (error) {
        console.error('Error deleting learning path:', error);
      }
    }
  };

  const handleViewCourses = (employee) => {
    setSelectedEmployee(employee);
    setPopupVisible(true);
  };

  const handleAddCourseToLearningPath = async (courseId) => {
    if (selectedLearningPath) {
      try {
        await axios.post(`http://localhost:3000/learning-paths/${selectedLearningPath.id}/courses`, { courseId });
        const response = await axios.get('http://localhost:3000/learning-paths');
        setLearningPaths(response.data);
      } catch (error) {
        console.error('Error adding course to learning path:', error);
      }
    }
  };

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

  const handleOpenAddEmployeeModal = () => {
    resetNewEmployee();
    setShowAddEmployeeModal(true);
};

const handleSignOut = () => {
    navigate('/');
};
return (
    <div className="admin-dashboard">
        <Navbar bg="primary" variant="dark" expand="lg" fixed="top" className="mb-4"> {/* Add fixed="top" here */}
            <Navbar.Brand href="#home" className="px-3">TrainingTracker</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mx-auto">
                    <Navbar.Text className="title">List of Employees</Navbar.Text>
                </Nav>
                <Nav>
                    <Button variant="outline-light" className="mx-2" onClick={handleOpenAddEmployeeModal}>
                        Add New Employee
                    </Button>
                    {/* <Button variant="outline-light" className="mx-2" onClick={() => {
                        resetNewCourse();
                        setShowAddCourseModal(true);
                    }}>
                        Add New Course
                    </Button>
                    <Button variant="outline-light" className="mx-2" onClick={() => {
                        setShowLearningPathModal(true);
                    }}>
                        Learning Path
                    </Button> */}
                    <Button variant="outline-danger" onClick={handleSignOut} className="me-2">Sign Out</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>      
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
            {/* Employee and Course Graph */}
            {/* <EmployeeCourseGraph employees={employees} courses={courses} /> */}

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
            <h2>Employees</h2>
            {courses? (
              <EmployeeTable 
                employees={employees} 
                handleViewCourses={handleViewCourses} 
                deleteUser={deleteUser} 
                courses={courses}
              />) : (<></>)
              } 

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
            {popupVisible && selectedEmployee && courses && (
              <CoursePopup
                employee={selectedEmployee}
                onClose={() => setPopupVisible(false)}
                updateCourse={updateCourses}
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

export default EmployeeManagementPage;
