// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes and controllers
const registerRoutes = require('./src/routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure profiles uploads directory exists
const profilesDir = path.join(__dirname, 'uploads/profiles');
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

// MongoDB Connection (only connect if not already connected)
if (mongoose.connection.readyState === 0) {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.warn('MONGO_URL not set. Tests may override this at runtime.');
  }
  mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB Connection Error:', err));
}

// Register all routes
registerRoutes(app);

module.exports = app;
