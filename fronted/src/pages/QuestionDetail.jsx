import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowUp, ArrowDown, MessageCircle, Share2, Bookmark, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { questionsAPI, answersAPI } from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { formatTimeAgo } from '../utils/timeFormat';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voteStatus, setVoteStatus] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  
  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [id]);

  const fetchQuestionAndAnswers = async () => {
    try {
      setLoading(true);
      const [questionResponse, answersResponse] = await Promise.all([
        questionsAPI.getById(id),
        answersAPI.getByQuestion(id)
      ]);
      
      setQuestion(questionResponse.data.question);
      setAnswers(questionResponse.data.answers);
    } catch (err) {
      console.error('Error fetching question:', err);
      setError('Failed to load question');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVote = (direction) => {
    setVoteStatus(voteStatus === direction ? null : direction);
  };
  
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to post an answer');
      return;
    }
    
    if (!answerContent.trim()) {
      setError('Please enter your answer');
      return;
    }
    
    setSubmittingAnswer(true);
    setError('');
    
    try {
      const response = await answersAPI.create(id, { content: answerContent });
      console.log('Answer created:', response.data);
      setAnswers([...answers, response.data]);
      setAnswerContent('');
      setShowAnswerForm(false);
    } catch (err) {
      console.error('Error creating answer:', err);
      setError(err.response?.data?.message || 'Failed to post answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };
  
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-500">
            Back to questions
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Question */}
        <Card className="p-8">
          <div className="flex gap-6">
            {/* Vote Column */}
            <div className="flex flex-col items-center space-y-2 w-16 flex-shrink-0">
              <button
                onClick={() => handleVote('up')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  voteStatus === 'up' 
                    ? 'bg-green-100 text-green-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              <span className="text-xl font-semibold text-gray-700">
                {question.votes || 0}
              </span>
              <button
                onClick={() => handleVote('down')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  voteStatus === 'down' 
                    ? 'bg-red-100 text-red-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ArrowDown className="w-6 h-6" />
              </button>
            </div>
            
            {/* Question Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">{question.title}</h1>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div 
                className="prose prose-sm max-w-none text-gray-700 mb-6"
                dangerouslySetInnerHTML={{ __html: question.content }}
              />
              
              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Question Meta */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Asked {formatTimeAgo(question.createdAt)}</span>
                  <span>Modified {formatTimeAgo(question.updatedAt || question.createdAt)}</span>
                  <span>Viewed {question.views || 0} times</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>By {question.author?.username || 'Anonymous'}</span>
                  {user?.isAdmin && (
                    <Button
                      variant="danger"
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this question?")) {
                          try {
                            await questionsAPI.delete(question._id);
                            navigate("/");
                          } catch (err) {
                            setError(err.response?.data?.message || "Failed to delete question");
                          }
                        }
                      }}
                      className="ml-2"
                    >
                      Delete Question
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Answers Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </h2>
            {isAuthenticated && (
              <Button
                onClick={() => setShowAnswerForm(!showAnswerForm)}
                variant="primary"
              >
                Write Answer
              </Button>
            )}
          </div>
          
          {/* Answer Form */}
          {showAnswerForm && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Your Answer</h3>
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <ReactQuill
                  theme="snow"
                  value={answerContent}
                  onChange={setAnswerContent}
                  modules={quillModules}
                  placeholder="Write your answer here..."
                  className="bg-white/30 rounded-lg"
                />
                <div className="flex items-center justify-end space-x-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAnswerForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!answerContent.trim() || submittingAnswer}
                    className="flex items-center space-x-2"
                  >
                    {submittingAnswer ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Posting...</span>
                      </>
                    ) : (
                      <span>Post Answer</span>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          )}
          
          {/* Answers List */}
          <div className="space-y-4">
            {answers.map((answer) => (
              <Card key={answer._id} className="p-6">
                <div className="flex gap-6">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center space-y-2 w-16 flex-shrink-0">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                      <ArrowUp className="w-6 h-6" />
                    </button>
                    <span className="text-xl font-semibold text-gray-700">
                      {answer.votes || 0}
                    </span>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                      <ArrowDown className="w-6 h-6" />
                    </button>
                    {answer.accepted && (
                      <div className="mt-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Answer Content */}
                  <div className="flex-1">
                    <div 
                      className="prose prose-sm max-w-none text-gray-700 mb-4"
                      dangerouslySetInnerHTML={{ __html: answer.content }}
                    />
                    
                    {/* Answer Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Answered {formatTimeAgo(answer.createdAt)}</span>
                        <span>By {answer.author?.username || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          Share
                        </Button>
                        <Button variant="ghost" size="sm">
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {answers.length === 0 && (
            <Card className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No answers yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to answer this question!
              </p>
              {isAuthenticated ? (
                <Button
                  onClick={() => setShowAnswerForm(true)}
                  variant="primary"
                >
                  Write Answer
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="primary">
                    Login to Answer
                  </Button>
                </Link>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;