import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MessageCircle, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { questionsAPI } from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { formatTimeAgo, formatNumber } from '../utils/timeFormat';
import Navbar from '../components/Navbar';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filters = [
    { id: 'newest', label: 'Newest', count: 0 },
    { id: 'unanswered', label: 'Unanswered', count: 0 },
    { id: 'popular', label: 'Popular', count: 0 }
  ];
  
  useEffect(() => {
    fetchQuestions();
  }, [activeFilter]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      let response;
      
      switch (activeFilter) {
        case 'unanswered':
          response = await questionsAPI.getUnanswered();
          break;
        case 'popular':
          response = await questionsAPI.getTrending();
          break;
        default:
          response = await questionsAPI.getAll();
      }
      
      // Ensure we always set an array
      const questionsData = Array.isArray(response.data) ? response.data : response.data.questions || [];
      setQuestions(questionsData);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions');
      setQuestions([]); // Ensure questions is always an array
    } finally {
      setLoading(false);
    }
  };
  
  // Ensure questions is always an array before filtering
  const filteredQuestions = Array.isArray(questions) ? questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (question.tags && question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  ) : [];
  
  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">All Questions</h1>
            <p className="text-gray-600">Find answers and share your knowledge</p>
          </div>
          <Link to="/ask">
            <Button variant="primary" className="flex items-center space-x-2">
              <span>Ask Question</span>
            </Button>
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="p-6">
              <h3 className="font-medium text-gray-800 mb-4">Filter Questions</h3>
              <div className="space-y-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeFilter === filter.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    <span className="font-medium">{filter.label}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {formatNumber(filter.count)}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Stats */}
            <Card className="p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800">{Array.isArray(questions) ? questions.length : 0}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800">
                      {Array.isArray(questions) ? questions.filter(q => !q.answers || q.answers.length === 0).length : 0}
                    </div>
                    <div className="text-sm text-gray-600">Unanswered</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Updated just now
                </div>
              </div>
            </Card>
            
            {/* Questions List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <Card key={question._id} className="p-6 hover:bg-white/50 transition-all duration-200">
                    <div className="flex gap-4">
                      {/* Stats */}
                      <div className="flex flex-col items-center space-y-2 w-16 flex-shrink-0">
                        <div className="flex items-center space-x-1">
                          <ArrowUp className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{question.votes || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className={`w-4 h-4 ${(question.answers && question.answers.length > 0) ? 'text-green-500' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${(question.answers && question.answers.length > 0) ? 'text-green-600' : 'text-gray-500'}`}>
                            {question.answers ? question.answers.length : 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{question.views || 0}</span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <Link
                            to={`/question/${question._id}`}
                            className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2"
                          >
                            {question.title}
                          </Link>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {question.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </p>
                        
                        {/* Tags */}
                        {question.tags && question.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {question.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>Asked {formatTimeAgo(question.createdAt)}</span>
                            <span>By {question.author?.name || 'Anonymous'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {!loading && filteredQuestions.length === 0 && (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No questions found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Be the first to ask a question!'}
                </p>
                <Link to="/ask">
                  <Button variant="primary">
                    Ask Question
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;