const Result = require('../model/Result');

/**
 * Get all previous analysis results for the authenticated user
 */
const getAllResults = async (req, res) => {
  try {
    // Get results only for the authenticated user
    const results = await Result.find({ userId: req.userId }).sort({ timestamp: -1 });
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching results' 
    });
  }
};

/**
 * Get a specific result by its ID
 */
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    
    if (!result) {
      return res.status(404).json({ 
        success: false,
        message: 'Result not found' 
      });
    }
    
    // Check if the result belongs to the authenticated user
    if (result.userId.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied: This result does not belong to you' 
      });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching result' 
    });
  }
};

module.exports = {
  getAllResults,
  getResultById
};
