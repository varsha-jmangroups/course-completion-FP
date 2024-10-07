import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar,Nav } from 'react-bootstrap';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import { useNavigate } from 'react-router-dom'; 
import Sidebar from '../components/Sidebar'; 
import AddNewEmployeeModal from '../components/AddNewEmployeeModal';
import NewCourseModal from '../components/NewCourseModal';
import EmployeeTable from '../components/EmployeeTable';
import CourseTable from '../components/CourseTable';
import LearningPathTable from '../components/LearningPathTable';
import EmployeeCourseGraph from '../components/EmployeeCourseGraph';
import NavigationBar from '../components/NavigationBar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';



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
  const toastRef = React.createRef();

    const handleOpenAddEmployeeModal = () => {
        resetNewEmployee();
        setShowAddEmployeeModal(true);
    };

    const handleSignOut = () => {
        navigate('/');
    };

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
        setLearningPaths(pathsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Error fetching data', 'error');
      }
    };

    fetchUsersCoursesAndPaths();
  }, []);

  const showToast = (message, severity) => {
    toastRef.current.show({ severity, summary: 'Notification', detail: message, life: 3000 });
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete("http://localhost:3000/users/${id}");
        setEmployees(employees.filter(employee => employee.id !== id));
        showToast('Employee deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        showToast('Error deleting user', 'error');
      }
    }
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
      showToast('Course added successfully', 'success');
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course');
      showToast('Failed to add course', 'error');
    }
  };
  const resetNewCourse = () => {
    setNewCourse({ title: '', description: '', duration: '', difficulty: '' });
  };
    

  const deleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete("http://localhost:3000/courses/${id}");
        setCourses(courses.filter(course => course.id !== id));
        showToast('Course deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting course:', error);
        showToast('Error deleting course', 'error');
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
      showToast('Employee added successfully', 'success');
    } catch (error) {
      console.error('Error adding employee:', error);
      setError('Failed to add employee');
      showToast('Failed to add employee', 'error');
    }
  };

  const resetNewEmployee = () => {
    setNewEmployee({ name: '', email: '', password: '', role: '' });
  };

  return (
    <div className="admin-dashboard">
      <Toast ref={toastRef} />
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="mb-4"> {/* Add fixed="top" here */}
            <Navbar.Brand href="#home">Company Name</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mx-auto">
                    <Navbar.Text className="title">Admin Dashboard</Navbar.Text>
                </Nav>
                <Nav>
                    <Button variant="outline-light" className="mx-2" onClick={handleOpenAddEmployeeModal}>
                        Add New Employee
                    </Button>
                    
                    <Button variant="outline-danger" onClick={handleSignOut}>Sign Out</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
      <Container fluid>
        <Row>
          <Col xs={2}>
            <Sidebar />
          </Col>
          <Col xs={10} className="main-content">
            
            <h2>Employees</h2>
            <EmployeeTable 
              employees={employees} 
              deleteUser={deleteUser} 
            />

            
            

            {/* Modals for adding new employee and course */}
            <AddNewEmployeeModal 
              show={showAddEmployeeModal} 
              setShow={setShowAddEmployeeModal} 
              newEmployee={newEmployee} 
              setNewEmployee={setNewEmployee} 
              handleAddEmployee={handleAddEmployee} 
              error={error} 
            />

            <NewCourseModal 
              show={showAddCourseModal}
              setShow={setShowAddCourseModal} 
              newCourse={newCourse} 
              setNewCourse={setNewCourse} 
              handleAddCourse={handleAddCourse} 
              error={error} 
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EmployeeManagementPage;