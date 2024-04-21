const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/api/predict', async (req, res) => {
  try {
    const imageUrl = req.body.image; // Assuming the image is sent in a field named 'image'
    const predictionUrl = 'https://bitcamp24cv-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/208e9081-a204-49b8-ae65-cd8e6a94a8a4/detect/iterations/Iteration4/url';
    const predictionKey = 'REDACTED';

    const headers = {
      'Prediction-Key': predictionKey,
      'Content-Type': 'application/json'
    };

    const body = {
      'Url': imageUrl
    };

    const response = await axios.post(predictionUrl, body, { headers });
    // Handle response from Azure Prediction API
    res.json(response.data);
  } catch (error) {
    console.error('Error predicting image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
