import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert, Navbar, Nav } from 'react-bootstrap';
import CoursePopup from './CoursePopup';
import axios from 'axios';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function AdminDashboard() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', role: '' });
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '', difficulty: '' });
  const [error, setError] = useState('');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  // Fetch users and courses from the database
  useEffect(() => {
    const fetchUsersAndCourses = async () => {
      try {
        const [usersResponse, coursesResponse] = await Promise.all([
          axios.get('http://localhost:3000/users'),
          axios.get('http://localhost:3000/courses'),
        ]);
        setEmployees(usersResponse.data);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching users or courses:', error);
      }
    };

    fetchUsersAndCourses();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleViewCourses = (employee) => {
    setSelectedEmployee(employee);
    setPopupVisible(true);
  };

  const updateCourses = async (employeeId, updatedCourses) => {
    try {
      await axios.put(`/api/employees/${employeeId}/courses`, { courses: updatedCourses });
      setEmployees(employees.map(employee => 
        employee.id === employeeId ? { ...employee, courses: updatedCourses } : employee
      ));
    } catch (error) {
      console.error('Error updating courses:', error);
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
      resetNewEmployee(); // Reset the form after adding employee
      setError('');
      setShowAddEmployeeModal(false); // Close modal after adding employee
    } catch (error) {
      console.error('Error adding employee:', error);
      setError('Failed to add employee');
    }
  };

  const resetNewEmployee = () => {
    setNewEmployee({ name: '', email: '', password: '', role: '' }); // Reset to empty fields
  };

  const handleSignOut = () => {
    // Here you can add any sign-out logic (e.g., clearing tokens)
    navigate('/'); // Redirect to the homepage
  };

  const handleOpenAddEmployeeModal = () => {
    resetNewEmployee(); // Reset form when opening modal
    setShowAddEmployeeModal(true);
  };

  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.duration || !newCourse.difficulty) {
      setError('All fields are required');
      return;
    }
    console.log("Course Adding")

    try {
      const response = await axios.post('http://localhost:3000/courses', newCourse);
      setCourses([...courses, response.data]);
      resetNewCourse(); // Reset the form after adding course
      setError('');
      setShowAddCourseModal(false); // Close modal after adding course
    } catch (error) {
      console.error('Error adding course:', error);
      setError('Failed to add course');
    }
  };

  const resetNewCourse = () => {
    setNewCourse({ title: '', description: '', duration: '', difficulty: '' }); // Reset to empty fields
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/courses/${id}`);
      setCourses(courses.filter(course => course.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
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
            <Button variant="outline-light" className="mx-2" onClick={() => {
              resetNewCourse();
              setShowAddCourseModal(true);
            }}>
              Add New Course
            </Button>
            <Button variant="outline-danger" onClick={handleSignOut}>Sign Out</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* New Employee Modal */}
      <Modal show={showAddEmployeeModal} onHide={() => setShowAddEmployeeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group controlId="formEmployeeName">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter name" 
                value={newEmployee.name} 
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formEmployeeEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                value={newEmployee.email} 
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formEmployeePassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={newEmployee.password} 
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formEmployeeRole">
              <Form.Label>Role</Form.Label>
              <Form.Control 
                as="select" 
                value={newEmployee.role} 
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })} 
              >
                <option value="">Select role</option>
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAddEmployee}>Add Employee</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* New Course Modal */}
      <Modal show={showAddCourseModal} onHide={() => setShowAddCourseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group controlId="formCourseTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter course title" 
                value={newCourse.title} 
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formCourseDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Enter course description" 
                value={newCourse.description} 
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formCourseDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter course duration" 
                value={newCourse.duration} 
                onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formCourseDifficulty">
              <Form.Label>Difficulty</Form.Label>
              <Form.Control 
                as="select" 
                value={newCourse.difficulty} 
                onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })} 
              >
                <option value="">Select difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAddCourse}>Add Course</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <section>
        <h2>User Management</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
                <td>{employee.courses ? employee.courses.join(', ') : 'No courses'}</td>
                <td>
                  <Button variant="danger" onClick={() => deleteUser(employee.id)}>Delete</Button>
                  <Button variant="info" onClick={() => handleViewCourses(employee)}>View Courses</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h2>Course Management</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.duration}</td>
                <td>{course.difficulty}</td>
                <td>
                  <Button variant="danger" onClick={() => deleteCourse(course.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* Popup for courses */}
      {popupVisible && selectedEmployee && (
        <CoursePopup 
          employee={selectedEmployee} 
          courses={courses} 
          onClose={() => setPopupVisible(false)} 
          onUpdate={updateCourses} 
        />
      )}
    </div>
  );
}

export default AdminDashboard;
