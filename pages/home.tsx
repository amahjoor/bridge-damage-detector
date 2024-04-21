import React, { ChangeEvent, useState, useRef } from 'react';
import "../app/globals.css";

const Home = () => {
  // State for uploaded image
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('Drop event triggered');
    // Handle the dropped files
    const files = e.dataTransfer.files;
    // Process the files...
    console.log('Files dropped:', files);
    // Assuming you want to display only the first dropped image
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  // Function to prevent default behavior on drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('Drag over event triggered');
  };

  // Function to handle image upload
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string); // Asserting the result to be a string
    };

    reader.readAsDataURL(file);
  };

  // Function to handle file input click
  const handleFileInputClick = () => {
    inputRef.current?.click();
  };

  // Function to handle file input change
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    handleImageUpload(file);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="flex min-h-screen flex-col items-center justify-center p-24">test1</h2>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <h2>test2</h2>
      </div>

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

      {/* Footer */}
      <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </div>
    </main>
  );
};

export default Home;
