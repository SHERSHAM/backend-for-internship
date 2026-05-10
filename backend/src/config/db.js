const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/primetrade';
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Local MongoDB unavailable, starting an in-memory MongoDB instance for development.');
      try {
        const mongoServer = await MongoMemoryServer.create();
        const memUri = mongoServer.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);
      } catch (memError) {
        console.error('In-memory MongoDB error:', memError.message);
        process.exit(1);
      }
    } else {
      console.error('DB connection error:', error.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
