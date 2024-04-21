import React, { ChangeEvent, useState, useRef } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import "../app/globals.css";

const Home = () => {
  const [image, setImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showText, setShowText] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputClick = () => {
    inputRef.current?.click();
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    handleImageUpload(file);
  };

  const processImage = async () => {
    try {
      if (!image) {
        console.error('No image selected');
        return;
      }
  
      // Get your project ID and iteration ID from the Custom Vision project
      const projectId = '208e9081-a204-49b8-ae65-cd8e6a94a8a4';
      const iterationId = 'c87022e8-122f-4bb6-9d5d-3fa4c8547c9c';
  
      // Construct the URL for Quick Test Image endpoint
      const endpoint = 'https://bitcamp24cv.cognitiveservices.azure.com/';
      const predictionUrl = `https://bitcamp24cv-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/208e9081-a204-49b8-ae65-cd8e6a94a8a4/detect/iterations/Iteration4/image`;
  
      // Create a FormData object and append the image file
      const formData = new FormData();
      formData.append('image', dataURItoBlob(image)); // Convert data URI to Blob
  
      // Make a POST request to Quick Test Image endpoint
      const response = await axios.post(predictionUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Prediction-Key': 'REDACTED', // Replace with your prediction key
        },
      });
  
      // Log the entire response
      console.log('Response:', response);
  
      // Parse the response and extract prediction results
      const predictions = response.data.predictions;
      console.log('Prediction results:', predictions);
      setPredictions(predictions);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };
  

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const toggleTextDisplay = () => {
    setShowText(!showText);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* Your existing code for image upload */}
      {/* Drag and drop area */}
      <div
        className="h-48 w-full flex items-center justify-center border border-gray-300 rounded-lg mt-8 bg-black text-white"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleFileInputClick} // Add onClick event handler
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <label htmlFor="fileInput">Drag and drop your files here or click to upload</label>
      </div>

      {/* Uploaded image */}
      {image && (
        <div className="mt-4">
          <img src={image} alt="Uploaded Image" className="max-w-full h-auto" />
        </div>
      )}

      {/* Button to process the uploaded image */}
      <button onClick={processImage} disabled={!image} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Process Image
      </button>

      {/* Toggle text display button */}
      <button onClick={toggleTextDisplay} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Refresh
      </button>

      {/* Display predictions as text */}
      {showText && (
        <div className="mt-4">
          <h2>Predictions:</h2>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>
                {prediction.tagName}: {prediction.probability.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default Home;
