const { PredictionAPIClient } = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");

// Add these variables to your environment variables or directly here
const predictionKey = process.env.PREDICTION_KEY; // Your prediction resource key
const endPoint = process.env.CUSTOM_VISION_ENDPOINT; // Endpoint URL
const projectId = process.env.PROJECT_ID; // Project ID from Custom Vision
const publishedName = process.env.PUBLISHED_NAME; // Published iteration name

const upload = multer();

// Ensure the blob is publicly accessible if you're passing the URL to Custom Vision
app.post('/upload', upload.single('file'), async (req, res) => {
    const blobName = req.file.originalname;
    const stream = req.file.buffer;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.upload(stream, stream.length);
        const uploadedImageUrl = `https://${account}.blob.core.windows.net/${containerName}/${blobName}`;

        // Initialize prediction client
        const predictor = new PredictionAPIClient(new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": predictionKey } }), endPoint);

        // Send image for analysis
        const results = await predictor.classifyImage(projectId, publishedName, { url: uploadedImageUrl });

        // Optionally store the results in the response or handle otherwise
        console.log(results.predictions);
        res.status(200).json({ message: "File uploaded and analyzed", predictions: results.predictions });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
