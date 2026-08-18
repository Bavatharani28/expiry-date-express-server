const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (mongoUri) {
    try {
      console.log('Connecting to MongoDB Atlas / Remote database...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000, // 10s timeout for Atlas initial handshake
      });
      console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (${conn.connection.name})`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB connection error: ${error.message}`);
      if (process.env.NODE_ENV === 'production') {
        console.error('⚠️ In Production: Please ensure your MongoDB Atlas URI is correct and IP 0.0.0.0/0 is whitelisted in Atlas Network Access.');
        // In production, do not fall back to in-memory as data would be lost on server restart
        return;
      }
    }
  }

  // Development Fallback: In-memory MongoDB
  if (process.env.NODE_ENV !== 'production') {
    console.log('Local/Atlas MongoDB not configured or failed to connect. Attempting MongoMemoryServer in development...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`✅ MongoMemoryServer Connected for local dev: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`❌ Failed to start MongoMemoryServer: ${memError.message}`);
    }
  } else {
    console.error('❌ MONGODB_URI or MONGO_URI environment variable is required in production.');
  }
};

module.exports = connectDB;
