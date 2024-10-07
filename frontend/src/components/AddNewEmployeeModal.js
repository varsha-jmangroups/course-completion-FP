//componets/AddNewEmployeeModal.js
import { Table, Button, Form, Modal, Alert, Navbar, Nav } from 'react-bootstrap';



export default function AddNewEmployeeModal({setShowAddEmployeeModal, showAddEmployeeModal, error, newEmployee, setNewEmployee, handleAddEmployee}) {
    return (
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
    )
}