const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getTrendingQuestions,
  getUnansweredQuestions,
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/questions
router.get('/', getQuestions);

// @route   GET /api/questions/trending
router.get('/trending', getTrendingQuestions);

// @route   GET /api/questions/unanswered
router.get('/unanswered', getUnansweredQuestions);

// @route   GET /api/questions/:id
router.get('/:id', getQuestionById);

// @route   POST /api/questions
router.post('/', protect, createQuestion);

// @route   PUT /api/questions/:id
router.put('/:id', protect, updateQuestion);

// @route   DELETE /api/questions/:id
router.delete('/:id', protect, deleteQuestion);

module.exports = router; 