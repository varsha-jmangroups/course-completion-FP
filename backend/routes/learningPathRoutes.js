const express = require('express');
const router = express.Router();
const {
  createLearningPath,
  getLearningPaths,
  updateLearningPath,
  deleteLearningPath,
} = require('../controllers/learningPathController');

// Route to create a new learning path
router.post('/', createLearningPath);

// Route to get all learning paths
router.get('/', getLearningPaths);

// Route to update a learning path by ID
router.put('/:id', updateLearningPath);

// Route to delete a learning path by ID
router.delete('/:id', deleteLearningPath);

module.exports = router;
