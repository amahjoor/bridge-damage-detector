import React, { ChangeEvent, useState, useRef } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import "../app/globals.css";

const Home = () => {
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const sendImageToBackend = async () => {
    try {
      const formData = new FormData();
      formData.append('image', dataURItoBlob(image)); // Convert data URI to Blob
      await axios.post('/api/predict', formData); // Assuming the backend route is '/api/predict'
      // Handle response if needed
    } catch (error) {
      console.error('Error sending image to backend:', error);
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

      {/* Button to send image to backend */}
      <button onClick={sendImageToBackend} disabled={!image} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Send Image to Backend
      </button>
    </main>
  );
};

export default Home;
