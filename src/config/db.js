const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Local MongoDB not detected (${error.message}). Starting MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoMemoryServer Connected: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`Failed to connect to MongoMemoryServer: ${memError.message}`);
    }
  }
};

module.exports = connectDB;
