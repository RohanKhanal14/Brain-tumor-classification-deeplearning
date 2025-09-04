// server/server.js
require('dotenv').config();
const app = require('./app');
const { cleanupTempFiles } = require('./src/controller/uploadController');

const PORT = process.env.PORT || 8000;

// Schedule cleanup of temporary files every hour
setInterval(cleanupTempFiles, 60 * 60 * 1000);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});