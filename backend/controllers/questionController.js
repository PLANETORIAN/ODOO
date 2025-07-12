const Question = require('../models/Question');
const Answer = require('../models/Answer');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    console.log('Fetching questions...');
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { content: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const tagFilter = req.query.tag ? { tags: req.query.tag } : {};

    const count = await Question.countDocuments({ ...keyword, ...tagFilter });
    console.log('Count:', count);

    const questions = await Question.find({ ...keyword, ...tagFilter })
      .populate('author', 'username reputation avatar')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean();

    console.log('Questions:', questions);

    res.json(questions);
  } catch (error) {
    console.error('Error in getQuestions:', error); // This will print the real error!
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username reputation avatar bio')
      .populate('acceptedAnswer')
      .lean(); // <--- THIS IS IMPORTANT
    if (question) {
      // Increment views
      await Question.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
      const answers = await Answer.find({ question: req.params.id })
        .populate('author', 'username reputation avatar')
        .sort({ voteCount: -1, createdAt: 1 })
        .lean();
      res.json({ question, answers });
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const question = await Question.create({
      title,
      content,
      tags: tags || [],
      author: req.user._id,
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'username reputation avatar')
      .lean();

    res.status(201).json(populatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private
const updateQuestion = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is the author or admin
    if (question.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to update this question' });
    }

    question.title = title || question.title;
    question.content = content || question.content;
    question.tags = tags || question.tags;

    const updatedQuestion = await question.save();

    const populatedQuestion = await Question.findById(updatedQuestion._id)
      .populate('author', 'username reputation avatar')
      .lean();

    res.json(populatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is the author or admin
    if (question.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to delete this question' });
    }

    // Delete associated answers
    await Answer.deleteMany({ question: req.params.id });

    await question.remove();

    res.json({ message: 'Question removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get trending questions
// @route   GET /api/questions/trending
// @access  Public
const getTrendingQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate('author', 'username reputation avatar')
      .sort({ views: -1, voteCount: -1 })
      .limit(10)
      .lean();

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get unanswered questions
// @route   GET /api/questions/unanswered
// @access  Public
const getUnansweredQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ isAnswered: false })
      .populate('author', 'username reputation avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getTrendingQuestions,
  getUnansweredQuestions,
}; 