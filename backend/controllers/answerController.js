const Answer = require('../models/Answer');
const Question = require('../models/Question');

// @desc    Create an answer
// @route   POST /api/answers/:questionId
// @access  Private
const createAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const questionId = req.params.questionId;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user has already answered this question
    const existingAnswer = await Answer.findOne({
      question: questionId,
      author: req.user._id,
    });

    if (existingAnswer) {
      return res.status(400).json({ message: 'You have already answered this question' });
    }

    const answer = await Answer.create({
      content,
      author: req.user._id,
      question: questionId,
    });

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username reputation avatar');

    res.status(201).json(populatedAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an answer
// @route   PUT /api/answers/:id
// @access  Private
const updateAnswer = async (req, res) => {
  try {
    const { content } = req.body;

    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user is the author or admin
    if (answer.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to update this answer' });
    }

    // Save edit history
    if (answer.content !== content) {
      answer.editHistory.push({
        content: answer.content,
        editedAt: new Date(),
      });
      answer.isEdited = true;
      answer.editedAt = new Date();
    }

    answer.content = content;

    const updatedAnswer = await answer.save();

    const populatedAnswer = await Answer.findById(updatedAnswer._id)
      .populate('author', 'username reputation avatar');

    res.json(populatedAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an answer
// @route   DELETE /api/answers/:id
// @access  Private
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user is the author or admin
    if (answer.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to delete this answer' });
    }

    // If this was the accepted answer, update the question
    if (answer.isAccepted) {
      await Question.findByIdAndUpdate(answer.question, {
        isAnswered: false,
        acceptedAnswer: null,
      });
    }

    await answer.remove();

    res.json({ message: 'Answer removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Accept an answer
// @route   PUT /api/answers/:id/accept
// @access  Private
const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const question = await Question.findById(answer.question);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is the question author or admin
    if (question.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to accept this answer' });
    }

    // Unaccept previously accepted answer if any
    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
    }

    // Accept the new answer
    answer.isAccepted = true;
    await answer.save();

    // Update question
    question.isAnswered = true;
    question.acceptedAnswer = answer._id;
    await question.save();

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username reputation avatar');

    res.json(populatedAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get answers for a question
// @route   GET /api/answers/question/:questionId
// @access  Public
const getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username reputation avatar')
      .sort({ isAccepted: -1, voteCount: -1, createdAt: 1 });

    res.json(answers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's answers
// @route   GET /api/answers/user/:userId
// @access  Public
const getUserAnswers = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Answer.countDocuments({ author: req.params.userId });

    const answers = await Answer.find({ author: req.params.userId })
      .populate('question', 'title')
      .populate('author', 'username reputation avatar')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      answers,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  getAnswersByQuestion,
  getUserAnswers,
}; 