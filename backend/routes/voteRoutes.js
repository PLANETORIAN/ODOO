const express = require('express');
const router = express.Router();
const {
  voteQuestion,
  voteAnswer,
  getUserVotes,
} = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/votes/question/:id
router.post('/question/:id', protect, voteQuestion);

// @route   POST /api/votes/answer/:id
router.post('/answer/:id', protect, voteAnswer);

// @route   GET /api/votes/user
router.get('/user', protect, getUserVotes);

module.exports = router; 