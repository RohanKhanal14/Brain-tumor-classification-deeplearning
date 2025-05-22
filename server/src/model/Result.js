const mongoose = require('mongoose');

// Define MongoDB Schema for analysis results
const ResultSchema = new mongoose.Schema({
  originalImage: String,
  prediction: String,
  confidence: Number,
  patientName: String,
  patientAge: String,
  patientGender: String,
  scanDate: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Result model
const Result = mongoose.model('Result', ResultSchema);

module.exports = Result;
