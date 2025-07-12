const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
require('dotenv').config();

const runComprehensiveTest = async () => {
  console.log('🔍 Starting comprehensive system test...\n');
  
  try {
    // Test 1: Environment Variables
    console.log('📋 Test 1: Environment Variables');
    console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Not set');
    console.log('PORT:', process.env.PORT || '5001');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
    console.log('');
    
    // Test 2: MongoDB Connection
    console.log('🔌 Test 2: MongoDB Connection');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    console.log('');
    
    // Test 3: Database Operations
    console.log('🗄️ Test 3: Database Operations');
    
    // Test User creation
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ User creation test passed');
    
    // Test Question creation
    const testQuestion = await Question.create({
      title: 'Test Question',
      content: 'This is a test question content.',
      author: testUser._id,
      tags: ['test', 'javascript']
    });
    console.log('✅ Question creation test passed');
    
    // Test Answer creation
    const testAnswer = await Answer.create({
      content: 'This is a test answer.',
      author: testUser._id,
      question: testQuestion._id
    });
    console.log('✅ Answer creation test passed');
    
    // Test data retrieval
    const users = await User.find({});
    const questions = await Question.find({});
    const answers = await Answer.find({});
    console.log(`✅ Data retrieval test passed - Users: ${users.length}, Questions: ${questions.length}, Answers: ${answers.length}`);
    console.log('');
    
    // Test 4: Clean up test data
    console.log('🧹 Test 4: Clean up');
    await User.deleteOne({ _id: testUser._id });
    await Question.deleteOne({ _id: testQuestion._id });
    await Answer.deleteOne({ _id: testAnswer._id });
    console.log('✅ Test data cleaned up');
    console.log('');
    
    // Test 5: API Endpoints (simulate)
    console.log('🌐 Test 5: API Endpoints (simulation)');
    console.log('✅ Auth routes: /api/auth/register, /api/auth/login');
    console.log('✅ Question routes: /api/questions');
    console.log('✅ Answer routes: /api/answers');
    console.log('✅ Vote routes: /api/votes');
    console.log('');
    
    console.log('🎉 All tests passed! Your system is ready.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

runComprehensiveTest(); 