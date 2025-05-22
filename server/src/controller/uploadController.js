const path = require('path');
const fs = require('fs');

/**
 * Controller to handle temporary file uploads
 * Used for tracking real upload progress on the client
 */
const uploadTempFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Schedule a cleanup to keep temp directory manageable
    cleanupTempFiles();
    
    // Return success since we're only tracking upload progress
    res.json({ 
      success: true, 
      message: 'File uploaded successfully',
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error in temp upload:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

/**
 * Function to clean up old temporary files
 * Keeps only the most recent files to preserve disk space
 */
const cleanupTempFiles = () => {
  const tempDir = path.join(__dirname, '../../uploads/temp/');
  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.error('Error reading temp directory:', err);
      return;
    }
    
    // Sort files by creation time
    const fileStats = files.map(file => {
      const filePath = path.join(tempDir, file);
      return {
        name: file,
        path: filePath,
        mtime: fs.statSync(filePath).mtime
      };
    }).sort((a, b) => a.mtime.getTime() - b.mtime.getTime());
    
    // Keep only the 20 most recent files
    const MAX_TEMP_FILES = 20;
    if (fileStats.length > MAX_TEMP_FILES) {
      const filesToDelete = fileStats.slice(0, fileStats.length - MAX_TEMP_FILES);
      filesToDelete.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) {
            console.error(`Error deleting temporary file ${file.name}:`, err);
          } else {
            console.log(`Deleted old temporary file: ${file.name}`);
          }
        });
      });
    }
  });
};

// Schedule cleanup every hour - moved to server.js
// setInterval(cleanupTempFiles, 60 * 60 * 1000);

module.exports = {
  uploadTempFile,
  cleanupTempFiles
};
