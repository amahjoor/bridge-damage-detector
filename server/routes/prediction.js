const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/predict', async (req, res) => {
  try {
    const imageFile = req.body.image; // Assuming the image file is sent in a field named 'image'
    const projectId = '208e9081-a204-49b8-ae65-cd8e6a94a8a4'; // Replace 'YOUR_PROJECT_ID' with your actual project ID
    const iterationId = 'c87022e8-122f-4bb6-9d5d-3fa4c8547c9c'; // Replace 'YOUR_ITERATION_ID' with your actual iteration ID
    const endpoint = 'https://bitcamp24cv.cognitiveservices.azure.com/'; // Replace 'YOUR_CUSTOM_VISION_ENDPOINT' with your Custom Vision endpoint
    const predictionKey = 'REDACTED'; // Replace 'YOUR_PREDICTION_KEY' with your actual prediction key

    const headers = {
      'Content-Type': 'multipart/form-data',
      'Training-key': predictionKey,
    };

    // Construct the URL for QuickTestImage endpoint
    const predictionUrl = `${endpoint}/customvision/v3.3/Training/projects/${projectId}/quicktest/image?iterationId=${iterationId}&store=true`;

    // Make a POST request to QuickTestImage endpoint
    const response = await axios.post(predictionUrl, imageFile, { headers });

    // Return the predictions as response
    res.json(response.data);
  } catch (error) {
    console.error('Error predicting image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
