import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Menu, X, Plus, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearchActive(true);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };
  
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">StackIt</span>
            </Link>
            
            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2 glass-card rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </form>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/ask">
                <Button variant="primary" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Ask Question</span>
                </Button>
              </Link>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-white/30 rounded-lg transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/30 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{user?.name || 'User'}</span>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-panel rounded-lg py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-white/30 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <hr className="my-2 border-gray-200/50" />
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-white/30 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-white/30 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-white/20 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2 glass-card rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </form>
              
              <div className="space-y-2">
                <Link
                  to="/ask"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-white/30 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Ask Question</span>
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-white/30 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-white/30 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-gray-700 hover:bg-white/30 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 text-gray-700 hover:bg-white/30 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;