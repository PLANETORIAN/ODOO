const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGO_URI ? 'Set' : 'Not set');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    
    // Test creating a simple document
    const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
    const testDoc = await TestModel.create({ name: 'test' });
    console.log('✅ Test document created:', testDoc);
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
};

testConnection(); 