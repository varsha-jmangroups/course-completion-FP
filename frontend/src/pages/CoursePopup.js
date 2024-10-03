import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './CoursePopup.css';

function CoursePopup({ employee, courses, onClose, onUpdate }) {
  const [selectedCourse, setSelectedCourse] = useState('');

  const handleAssignCourse = () => {
    if (!selectedCourse) {
      alert('Please select a course to assign.');
      return;
    }

    // Find the selected course object based on the selectedCourse ID
    const courseToAssign = courses.find(course => course.id === selectedCourse);
    
    // Update employee's courses
    const updatedCourses = [...employee.courses, courseToAssign];
    onUpdate(employee.id, updatedCourses);
    setSelectedCourse(''); // Reset selection
  };

  const handleDeleteCourse = (courseId) => {
    const updatedCourses = employee.courses.filter(course => course.id !== courseId);
    onUpdate(employee.id, updatedCourses); // Update courses without the deleted one
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{employee.name}'s Courses</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="courses-list">
        {courses && courses.map(course => (
          <div key={course.id} className="course-item">
            <h3>{course.title}</h3>
            <p>Duration: {course.duration} hours</p>
            <p>Difficulty: {course.difficulty}</p>
            <button onClick={() => handleDeleteCourse(course.id)}>Delete Course</button>
          </div>
        ))}
      </div>

        <h3>Assign Existing Course</h3>
        <Form.Group controlId="formCourseSelect">
          <Form.Label>Select Course</Form.Label>
          <Form.Control
            as="select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a course...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title} - {course.duration} hours - {course.difficulty}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={handleAssignCourse}>Assign Course</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CoursePopup;
