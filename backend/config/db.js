const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edulearn';

  try {
    // Attempt standard connection with a quick timeout
    console.log(`[MongoDB] Connecting to ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[MongoDB] Local MongoDB connection failed (${err.message}).`);
    console.log('[MongoDB] Starting MongoMemoryServer for zero-friction development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      
      await mongoose.connect(memUri);
      console.log(`[MongoDB] Connected to embedded in-memory database at: ${memUri}`);
    } catch (memErr) {
      console.error('[MongoDB] Failed to start embedded database:', memErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
