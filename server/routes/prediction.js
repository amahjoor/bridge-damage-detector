// backend/routes/prediction.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Function to predict image
async function predictImage(imageUrl) {
  try {
    const projectId = '208e9081-a204-49b8-ae65-cd8e6a94a8a4'; // Replace with your project ID
    const iterationId = 'c87022e8-122f-4bb6-9d5d-3fa4c8547c9c'; // Replace with your iteration ID
    const endpoint = 'https://bitcamp24cv.cognitiveservices.azure.com/'; // Replace with your Custom Vision endpoint
    const predictionKey = 'REDACTED'; // Replace with your prediction key

    // Construct the URL for QuickTestImage endpoint
    const predictionUrl = `${endpoint}/customvision/v3.3/Training/projects/${projectId}/quicktest/image?iterationId=${iterationId}&store=true`;

    // Make a POST request to QuickTestImage endpoint
    const response = await axios.post(predictionUrl, { url: imageUrl }, {
      headers: {
        'Prediction-Key': predictionKey,
        'Content-Type': 'application/json',
      },
    });

    // Return the predictions as response
    return response.data;
  } catch (error) {
    console.error('Error predicting image:', error);
    throw new Error('Internal server error');
  }
}

// POST /api/predict
router.post('/predict', async (req, res) => {
  try {
    const imageUrl = req.body.imageUrl; // Assuming the image URL is sent in a field named 'imageUrl'
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const predictions = await predictImage(imageUrl);
    res.json({ predictions });
  } catch (error) {
    console.error('Error predicting image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
