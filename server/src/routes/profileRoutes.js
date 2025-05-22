const express = require('express');
const router = express.Router();
const User = require('../model/User');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

// Set up storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = path.join(__dirname, '../../uploads/profiles');
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Use userId as part of the filename for easy reference
    // Prefix with timestamp to avoid cache issues when updating
    cb(null, `${Date.now()}_${req.userId}${path.extname(file.originalname)}`);
  }
});

// File filter to ensure only images are uploaded
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

/**
 * @route PUT /api/profile
 * @desc Update user profile information
 * @access Private
 */
router.put('/', auth, async (req, res) => {
  try {
    const { fullName, email, organization, location } = req.body;
    
    // Find user by ID (from auth middleware)
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update fields if provided
    if (fullName) user.name = fullName;
    if (email) user.email = email;
    
    // Add additional fields to user schema if they don't exist
    if (!user.organization && organization) {
      user.organization = organization;
    } else if (organization) {
      user.organization = organization;
    }
    
    if (!user.location && location) {
      user.location = location;
    } else if (location) {
      user.location = location;
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        organization: user.organization,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

/**
 * @route POST /api/profile/avatar
 * @desc Upload a profile picture
 * @access Private
 */
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get the filename of the uploaded file
    const avatarFilename = req.file.filename;
    
    // Delete the old avatar if it exists
    if (user.avatar) {
      // Extract the filename from the path
      const oldAvatarFilename = path.basename(user.avatar);
      const oldAvatarPath = path.join(__dirname, '../../uploads/profiles', oldAvatarFilename);
      
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
    
    // Update the user's avatar field with the relative path
    user.avatar = `/uploads/profiles/${avatarFilename}`;
    await user.save();
    
    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: `/uploads/profiles/${avatarFilename}`
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading avatar'
    });
  }
});

/**
 * @route GET /api/profile
 * @desc Get user profile information
 * @access Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        organization: user.organization || null,
        location: user.location || null,
        avatar: user.avatar ? `/uploads/profiles/${user.avatar}` : null,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

module.exports = router;
