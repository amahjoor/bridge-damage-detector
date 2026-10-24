const express = require('express');
const axios = require('axios');

const router = express.Router();

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    const error = new Error(`${name} is not set`);
    error.status = 500;
    throw error;
  }
  return value;
}

router.post(
  '/predict',
  express.raw({ type: 'application/octet-stream', limit: '10mb' }),
  async (req, res) => {
    try {
      const predictionKey = requiredEnv('PREDICTION_KEY');
      const endpoint = requiredEnv('CUSTOM_VISION_ENDPOINT').replace(/\/$/, '');
      const projectId = requiredEnv('PROJECT_ID');
      const iteration = process.env.ITERATION_NAME || 'Iteration4';

      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: 'Image body is required' });
      }

      const predictionUrl = `${endpoint}/customvision/v3.0/Prediction/${projectId}/detect/iterations/${iteration}/image`;
      const response = await axios.post(predictionUrl, req.body, {
        headers: {
          'Prediction-Key': predictionKey,
          'Content-Type': 'application/octet-stream',
        },
      });

      res.json({ predictions: response.data.predictions });
    } catch (error) {
      const status = error.status || error.response?.status || 500;
      console.error('Error predicting image:', error.message);
      res.status(status).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
