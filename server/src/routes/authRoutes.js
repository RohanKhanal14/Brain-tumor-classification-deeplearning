const express = require('express');
const { register, login, getCurrentUser } = require('../controller/authController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/user', auth, getCurrentUser);

module.exports = router;
