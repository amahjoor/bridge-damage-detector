// ------------ THE IMPORTS ------------
// necessary modules to create an express app
const express = require('express');
const app = express();
const cors = require('cors'); // import CORS for cross-origin requests

app.use(cors()); // apply CORS

const multer = require('multer'); // import for handling multipart/form-data (file uploads)
const { BlobServiceClient } = require('@azure/storage-blob'); // import Azure storage blob SDK to interact with Azure Blob Storage
require('dotenv').config(); // load environemnt variables from .env file

const port = process.env.PORT || 5001; // set the port to 5000 if not provided
const upload = multer(); // create an instance of multer

app.use(express.static('public')); // serve static files from the 'public' directory

// extract Azure credentials from environment variables
const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;

// create a connection string using the credentials
const connectStr = `DefaultEndpointsProtocol=https;AccountName=${account};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;

// create a blob service client instance using the connection string
const blobServiceClient = BlobServiceClient.fromConnectionString(connectStr);

// define a POST endpoint for uploading files to Azure Blob Storage
app.post('/upload', upload.single('file'), async (req, res) => {
    const blobName = req.file.originalname; // extract filename from uploaded file
    const stream = req.file.buffer; // get the buffer of the file from uploaded file
    const containerClient = blobServiceClient.getContainerClient(containerName); // get client for the container from blob service client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // get the block blob client for the specific file to be uploaded.

    
    try { // try to upload the file to Azure Blob Storage
        await blockBlobClient.upload(stream, stream.length); // send a success response back to client
        res.status(200).send("File uploaded to Azure Blob Storage.");
    } catch (error) {
        console.error(error); // log the error and send an error message response to the client.
        res.status(500).send(error.message);
    }
});

app.listen(port, () => { // start the server and listen on the specified port
    console.log(`Server running on http://localhost:${port}`);
});

/*
async function listBlobs() {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log(`Listing blobs in container: ${containerName}`);

    for await (const blob of containerClient.listBlobsFlat()) {
        console.log(`Blob name: ${blob.name} | URL: https://${account}.blob.core.windows.net/${containerName}/${blob.name}`);
    }
}

listBlobs();
*/