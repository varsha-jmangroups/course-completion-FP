// CoursePopup.js
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import '../styles/CoursePopup.css';

import axios from 'axios'; // Make sure you have axios installed or use fetch instead

function CoursePopup({ employee, courses, onClose, updateCourse }) {
  const [selectedCourse, setSelectedCourse] = useState('');
  const enrolledCourses = employee.courses || [];

  const handleAssignCourse = async () => {
    if (!selectedCourse) {
      alert('Please select a course to assign.');
      return;
    }

    // Find the selected course object based on the selectedCourse ID
    const courseToAssign = courses.find(course => course.id === selectedCourse);

    // Check if the employee is already enrolled
    if (enrolledCourses.find(course => course.id === selectedCourse)) {
      alert('This course is already assigned to the employee.');
      return;
    }

    try {
      // Call the enroll API to assign the course to the employee
      const response = await axios.post('http://localhost:3000/enroll', {
        userId: employee.id,
        courseId: selectedCourse,
      });

      if (response.status === 201) {
        alert('Course assigned successfully');
        
        // Update employee's courses locally
        const updatedCourses = [...enrolledCourses, courseToAssign];
        updateCourse(employee.id, updatedCourses); // Update the parent component with new courses
        setSelectedCourse(''); // Reset the selected course
      }
    } catch (error) {
      alert('Failed to assign the course. Please try again.');
    }
  };

  const handleDeleteCourse = (courseId) => {
    const updatedCourses = enrolledCourses.filter(course => course.id !== courseId);
    updateCourse(employee.id, updatedCourses); // Update courses without the deleted one
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{employee.name}'s Courses</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="courses-list">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map(course => (
              <div key={course.id} className="course-item">
                <h3>{course.title}</h3>
                <p>Duration: {course.duration} hours</p>
                <p>Difficulty: {course.difficulty}</p>
                <button style={{backgroundColor: '#dc3545', borderRadius:'5px'}} onClick={() => handleDeleteCourse(course.id)}>Delete Course</button>
              </div>
            ))
          ) : (
            <p>No courses assigned to this employee.</p>
          )}
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
              !enrolledCourses.find(enrolled => enrolled.id === course.id) && (
                <option key={course.id} value={course.id}>
                  {course.title} - {course.duration} hours - {course.difficulty}
                </option>
              )
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
