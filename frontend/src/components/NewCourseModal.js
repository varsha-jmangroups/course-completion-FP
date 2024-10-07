//components/NewCourseModal.js
import { Table, Button, Form, Modal, Alert, Navbar, Nav } from 'react-bootstrap';

export default function NewCourseModal({setShowAddCourseModal, showAddCourseModal, error, setNewCourse, newCourse, handleAddCourse}) {
    return (
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
                placeholder="Enter duration" 
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
    )
}