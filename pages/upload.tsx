import React, { ChangeEvent, useState } from 'react';
import axios from 'axios'; // Make sure axios is imported

const UploadImage = () => {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null); // State to hold the file

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setFile(file); // Save the file to state
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result as string); // Set image for preview
            };

            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Upload successful!');
            console.log('Server Response:', response.data);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed!');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
            {image && <img src={image} alt="Uploaded Image" style={{ maxWidth: '300px' }} />}
            <button onClick={uploadImage}>Upload to Server</button>
        </div>
    );
};

export default UploadImage;
