const express = require('express');
const router = express.Router();
const {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  getAnswersByQuestion,
  getUserAnswers,
} = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/answers/:questionId
router.post('/:questionId', protect, createAnswer);

// @route   PUT /api/answers/:id
router.put('/:id', protect, updateAnswer);

// @route   DELETE /api/answers/:id
router.delete('/:id', protect, deleteAnswer);

// @route   PUT /api/answers/:id/accept
router.put('/:id/accept', protect, acceptAnswer);

// @route   GET /api/answers/question/:questionId
router.get('/question/:questionId', getAnswersByQuestion);

// @route   GET /api/answers/user/:userId
router.get('/user/:userId', getUserAnswers);

module.exports = router; 