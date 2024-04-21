const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const predictionRoute = require('./routes/prediction'); // Assuming you have a prediction route file

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/api', predictionRoute); // Mount prediction route

// app.get("/", (req, res) => {
//   res.render("index.html");
// });

// Handle GET request to the root URL ("/")
app.get('/', (req, res) => {
  res.send('Welcome to the Bitcamp 2024 Bridge Analysis App!');
});

// Error handling middleware - Log errors to console
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment port if available, otherwise default to 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
