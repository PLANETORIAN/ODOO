import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Ask from './pages/Ask';
import QuestionDetail from './pages/QuestionDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/question/:id" element={<QuestionDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;