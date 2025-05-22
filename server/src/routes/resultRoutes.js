const express = require('express');
const router = express.Router();
const { getAllResults, getResultById } = require('../controller/resultController');
const auth = require('../middleware/authMiddleware');

// Protected routes - require authentication
// Route to get all analysis results for the authenticated user
router.get('/results', auth, getAllResults);

// Route to get a specific result for the authenticated user
router.get('/results/:id', auth, getResultById);

module.exports = router;
