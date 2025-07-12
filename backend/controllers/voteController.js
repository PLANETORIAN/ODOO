const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Vote = require('../models/Vote');

// @desc    Vote on a question
// @route   POST /api/votes/question/:id
// @access  Private
const voteQuestion = async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const questionId = req.params.id;
    const userId = req.user._id;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is voting on their own question
    if (question.author.toString() === userId.toString()) {
      return res.status(400).json({ message: 'You cannot vote on your own question' });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({
      user: userId,
      targetType: 'question',
      targetId: questionId,
    });

    if (existingVote) {
      // If same vote type, remove the vote
      if (existingVote.voteType === voteType) {
        await Vote.findByIdAndDelete(existingVote._id);
        
        // Remove from question arrays
        if (voteType === 'upvote') {
          question.upvotes = question.upvotes.filter(
            (id) => id.toString() !== userId.toString()
          );
        } else {
          question.downvotes = question.downvotes.filter(
            (id) => id.toString() !== userId.toString()
          );
        }
        
        await question.save();
        return res.json({ message: 'Vote removed' });
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        await existingVote.save();

        // Update question arrays
        if (voteType === 'upvote') {
          question.upvotes.push(userId);
          question.downvotes = question.downvotes.filter(
            (id) => id.toString() !== userId.toString()
          );
        } else {
          question.downvotes.push(userId);
          question.upvotes = question.upvotes.filter(
            (id) => id.toString() !== userId.toString()
          );
        }
        
        await question.save();
        return res.json({ message: 'Vote updated' });
      }
    }

    // Create new vote
    await Vote.create({
      user: userId,
      targetType: 'question',
      targetId: questionId,
      voteType,
    });

    // Update question arrays
    if (voteType === 'upvote') {
      question.upvotes.push(userId);
    } else {
      question.downvotes.push(userId);
    }

    await question.save();

    res.json({ message: 'Vote added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Vote on an answer
// @route   POST /api/votes/answer/:id
// @access  Private
const voteAnswer = async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const answerId = req.params.id;
    const userId = req.user._id;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user is voting on their own answer
    if (answer.author.toString() === userId.toString()) {
      return res.status(400).json({ message: 'You cannot vote on your own answer' });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({
      user: userId,
      targetType: 'answer',
      targetId: answerId,
    });

    if (existingVote) {
      // If same vote type, remove the vote
      if (existingVote.voteType === voteType) {
        await Vote.findByIdAndDelete(existingVote._id);
        
        // Remove from answer arrays
        if (voteType === 'upvote') {
          answer.upvotes = answer.upvotes.filter(
            (id) => id.toString() !== userId.toString()
          );
        } else {
          answer.downvotes = answer.downvotes.filter(
            (id) => id.toString() !== userId.toString()
          );
        }
        
        await answer.save();
        return res.json({ message: 'Vote removed' });
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        await existingVote.save();

        // Update answer arrays
        if (voteType === 'upvote') {
          answer.upvotes.push(userId);
          answer.downvotes = answer.downvotes.filter(
            (id) => id.toString() !== userId.toString()
          );
        } else {
          answer.downvotes.push(userId);
          answer.upvotes = answer.upvotes.filter(
            (id) => id.toString() !== userId.toString()
          );
        }
        
        await answer.save();
        return res.json({ message: 'Vote updated' });
      }
    }

    // Create new vote
    await Vote.create({
      user: userId,
      targetType: 'answer',
      targetId: answerId,
      voteType,
    });

    // Update answer arrays
    if (voteType === 'upvote') {
      answer.upvotes.push(userId);
    } else {
      answer.downvotes.push(userId);
    }

    await answer.save();

    res.json({ message: 'Vote added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's voting history
// @route   GET /api/votes/user
// @access  Private
const getUserVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ user: req.user._id })
      .populate('targetId')
      .sort({ createdAt: -1 });

    res.json(votes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  voteQuestion,
  voteAnswer,
  getUserVotes,
}; 