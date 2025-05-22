const express = require('express');
const router = express.Router();
const path = require('path');

// Route for serving uploaded images
router.get('/uploads/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, '../../uploads', req.params.filename));
});

module.exports = router;
