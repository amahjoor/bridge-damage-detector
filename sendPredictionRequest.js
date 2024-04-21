const axios = require('axios');
const fs = require('fs'); // Node.js built-in module for file system operations

const imagePath = 'C:/Users/jdcan/Downloads/Images2/main-qimg-afe0fa6985509ee2f317716958a22dc6.jpeg';

// Read the image file
const imageFile = fs.readFileSync(imagePath);

// Create FormData object and append the image file
const formData = new FormData();
formData.append('image', imageFile);

// Send the POST request using Axios
axios.post('http://localhost:5000/api/predict', formData)
  .then(response => {
    console.log('Prediction response:', response.data);
  })
  .catch(error => {
    console.error('Error predicting image:', error);
  });
