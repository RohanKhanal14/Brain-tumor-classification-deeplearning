const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongo;

async function setupMemoryServer() {
  try {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    process.env.MONGO_URL = uri; // used by app.js
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.warn('mongodb-memory-server unavailable, falling back to MONGO_URL. Error:', err.message);
    const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/test';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

async function teardownMemoryServer() {
  try {
    if (mongoose.connection.readyState) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  } finally {
    if (mongo) {
      await mongo.stop();
      mongo = undefined;
    }
  }
}

module.exports = { setupMemoryServer, teardownMemoryServer };
