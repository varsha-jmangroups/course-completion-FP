// components/NavigationBar.js
import { Table, Button, Form, Modal, Alert, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 

export default function NavigationBar({resetNewCourse, setShowAddCourseModal, resetNewEmployee, setShowAddEmployeeModal, setShowLearningPathModal}) {
    const navigate = useNavigate();

    const handleOpenAddEmployeeModal = () => {
        resetNewEmployee();
        setShowAddEmployeeModal(true);
    };

    const handleSignOut = () => {
        navigate('/');
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg" fixed="top" className="mb-4"> {/* Add fixed="top" here */}
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
                    <Button variant="outline-light" className="mx-2" onClick={() => {
                        setShowLearningPathModal(true);
                    }}>
                        Learning Path
                    </Button>
                    <Button variant="outline-danger" onClick={handleSignOut}>Sign Out</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
