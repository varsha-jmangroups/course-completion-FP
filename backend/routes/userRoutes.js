const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/userController');

// Route to get all users
router.get('/', getAllUsers);

// Route to delete a user by ID
router.delete('/:id', deleteUser);

module.exports = router;
