import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X, Plus, Eye, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { questionsAPI } from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';

const Ask = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const popularTags = ['javascript', 'react', 'typescript', 'css', 'html', 'node.js', 'python'];
  
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to ask a question');
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const questionData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags,
      };
      
      const response = await questionsAPI.create(questionData);
      console.log('Question created:', response.data);
      navigate(`/question/${response.data._id}`);
    } catch (err) {
      console.error('Error creating question:', err);
      setError(err.response?.data?.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Ask a Question</h1>
          <p className="text-gray-600">Share your question with the community</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Question Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How to implement authentication in React?"
              className="w-full px-4 py-3 glass-card rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Be specific and imagine you're asking a question to another person
            </p>
          </div>
          
          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Question Details *
              </label>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>{isPreview ? 'Edit' : 'Preview'}</span>
              </Button>
            </div>
            
            {isPreview ? (
              <div className="min-h-[200px] p-4 glass-card rounded-lg">
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : (
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                placeholder="Describe your question in detail. Include any code snippets, error messages, or examples..."
                className="bg-white/30 rounded-lg"
              />
            )}
            <p className="text-sm text-gray-500 mt-1">
              Include all the information someone would need to answer your question
            </p>
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (up to 5)
            </label>
            
            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Tag Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 glass-card rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                disabled={tags.length >= 5}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Popular Tags */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!tags.includes(tag) && tags.length < 5) {
                        setTags([...tags, tag]);
                      }
                    }}
                    disabled={tags.includes(tag) || tags.length >= 5}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Submit */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200/50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!title.trim() || !content.trim() || loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post Question</span>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Ask;