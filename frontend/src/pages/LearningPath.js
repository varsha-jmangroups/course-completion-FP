// pages/LearningPath.js
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const LearningPath = ({ show, handleClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/learning-paths', {
        title,
        description,
        courseIds: selectedCourses,
      });
      onSave(response.data); // Call the save function passed as a prop
      handleClose(); // Close the modal
    } catch (error) {
      console.error('Error creating learning path:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Learning Path</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formLearningPathTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter learning path title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formLearningPathDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Enter learning path description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formLearningPathCourses">
            <Form.Label>Select Courses</Form.Label>
            <Form.Control 
              as="select" 
              multiple 
              value={selectedCourses}
              onChange={(e) => {
                const options = Array.from(e.target.options);
                const values = options
                  .filter(option => option.selected)
                  .map(option => option.value);
                setSelectedCourses(values);
              }}
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </Form.Control>
            <Form.Text className="text-muted">
              Hold down the Ctrl (Windows) or Command (Mac) button to select multiple options.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LearningPath;
