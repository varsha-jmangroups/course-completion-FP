// components/Sidebar.js
import React from 'react';
import { Button, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../styles/Sidebar.css'; // For sidebar styling

const Sidebar = ({ 
    resetNewCourse, 
    setShowAddCourseModal, 
    resetNewEmployee, 
    setShowAddEmployeeModal, 
    setShowLearningPathModal 
}) => {
    const navigate = useNavigate(); // Initialize the navigate hook

    const handleOpenAddEmployeeModal = () => {
        resetNewEmployee();
        setShowAddEmployeeModal(true);
    };

    return (
        <div className="sidebar">
            <Nav className="flex-column">
                {/* Existing modals */}
                <Nav.Item>
                    <Button variant="light" onClick={handleOpenAddEmployeeModal}>
                        Add New Employee
                    </Button>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="light" onClick={() => {
                        resetNewCourse();
                        setShowAddCourseModal(true);
                    }}>
                        Add New Course
                    </Button>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="light" onClick={() => {
                        setShowLearningPathModal(true);
                    }}>
                        Learning Path
                    </Button>
                </Nav.Item>

                {/* New navigation buttons for tables */}
                <Nav.Item>
                    <Button variant="light" onClick={() => navigate('/employees')}>
                        View Employee Table
                    </Button>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="light" onClick={() => navigate('/courses')}>
                        View Course Table
                    </Button>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="light" onClick={() => navigate('/learning-paths')}>
                        View Learning Path Table
                    </Button>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default Sidebar;
