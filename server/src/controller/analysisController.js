const { spawn } = require('child_process');
const Result = require('../model/Result');

/**
 * Controller to handle MRI scan analysis
 * Processes the uploaded image using a Python ML model
 */
const analyzeMRI = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = req.file.path;
    
    // Call the Python script that uses your model
    const pythonProcess = spawn(process.env.PYTHON_PATH, [
      'brain_tumour_detection_using_deep_learning.py', // Your script file
      '--image', imagePath,
      '--model', 'brain_tumor_model.keras'
    ]);

    let predictionData = '';
    pythonProcess.stdout.on('data', (data) => {
      const dataStr = data.toString();
      console.log('Python stdout data:', dataStr);
      predictionData += dataStr;
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Script Error: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ message: 'Analysis failed' });
      }

      try {
        // Clean up the predictionData to extract just the JSON part
        let jsonData = predictionData.trim();
        
        // Find the beginning of the JSON object (should be "{")
        const jsonStart = jsonData.lastIndexOf('{');
        if (jsonStart >= 0) {
          jsonData = jsonData.substring(jsonStart);
        }
        
        console.log('Cleaned JSON data:', jsonData);
        
        // Parse the output from the Python script
        const predictionResult = JSON.parse(jsonData);
        
        // Save results to MongoDB with patient information and user reference
        const result = new Result({
          originalImage: req.file.filename,
          prediction: predictionResult.prediction,
          confidence: predictionResult.confidence,
          patientName: req.body.patientName || '',
          patientAge: req.body.patientAge || '',
          patientGender: req.body.patientGender || '',
          scanDate: req.body.scanDate || '',
          userId: req.userId // Associate the result with the authenticated user
        });
        
        await result.save();
        
        // Return result to client
        res.json({
          message: 'Analysis complete',
          result: predictionResult,
          resultId: result._id,
          patientData: {
            patientName: req.body.patientName || '',
            patientAge: req.body.patientAge || '',
            patientGender: req.body.patientGender || '',
            scanDate: req.body.scanDate || ''
          }
        });
      } catch (error) {
        console.error('Error processing prediction result:', error);
        res.status(500).json({ message: 'Error processing prediction result' });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  analyzeMRI
};
