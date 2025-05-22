const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadTempFile } = require('../controller/uploadController');

// Ensure upload directories exist
const uploadPath = path.join(__dirname, '../../uploads');
const tempPath = path.join(uploadPath, 'temp');

// Create directories if they don't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath);
}

// Configure temporary storage for uploads
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadTemp = multer({ 
  storage: tempStorage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Route for temporary file uploads
router.post('/upload-temp', uploadTemp.single('image'), uploadTempFile);

module.exports = router;
