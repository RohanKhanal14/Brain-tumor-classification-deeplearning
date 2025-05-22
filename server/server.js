// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes and controllers
const registerRoutes = require('./src/routes');
const { cleanupTempFiles } = require('./src/controller/uploadController');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create profiles uploads directory if it doesn't exist
const profilesDir = path.join(__dirname, 'uploads/profiles');
const fs = require('fs');
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Register all routes
registerRoutes(app);

// Schedule cleanup of temporary files every hour
setInterval(cleanupTempFiles, 60 * 60 * 1000);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});