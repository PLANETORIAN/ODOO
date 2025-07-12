const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
const startServer = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('Connection string:', process.env.MONGO_URI ? 'Set' : 'Not set');
    
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    // Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/questions', require('./routes/questionRoutes'));
    app.use('/api/answers', require('./routes/answerRoutes'));
    app.use('/api/votes', require('./routes/voteRoutes'));

    // Health check
    app.get('/', (req, res) => {
      res.send('StackIt Q&A Forum API is running');
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Server error:', err.stack);
      res.status(500).json({ message: err.message || 'Server Error' });
    });

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer(); 