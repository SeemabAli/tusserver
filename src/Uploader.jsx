import React, { useState } from 'react';
import { Upload } from 'tus-js-client';

const Uploader = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [upload, setUpload] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setUploadProgress(0); // Reset progress on new file selection
    };

    const handleUpload = () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const newUpload = new Upload(file, {
            // Use the provided endpoint for your server
            endpoint: 'http://ahcl.tssclinicallabs.com/uploads', // Your server's endpoint
            metadata: {
                filename: file.name,
                filetype: file.type,
            },
            onError: (error) => {
                console.error('Upload failed:', error);
                alert(`Upload failed: ${error.message}`);
                setIsUploading(false); // Reset the uploading status
            },
            onProgress: (bytesUploaded, bytesTotal) => {
                const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
                setUploadProgress(percentage);
                console.log(`${bytesUploaded}/${bytesTotal} bytes uploaded (${percentage}%)`);
            },
            onSuccess: () => {
                console.log('Upload finished:', newUpload.url);
                alert('Upload successful!');
                setIsUploading(false); // Reset the uploading status
            },
        });

        setUpload(newUpload);
        setIsUploading(true);
        newUpload.start();
    };

    const handlePause = () => {
        if (upload) {
            upload.abort(); // This pauses the upload
            setIsUploading(false);
            console.log('Upload paused.');
        }
    };

    const handleResume = () => {
        if (upload && !isUploading) {
            setIsUploading(true);
            upload.start(); // This resumes the upload from where it was paused
            console.log('Upload resumed.');
        }
    };

    return (
        <div>
            <h1>File Upload with tus-js-client</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={isUploading || !file}>Upload</button>
            {isUploading && <button onClick={handlePause}>Pause</button>}
            {uploadProgress > 0 && (
                <p>Upload Progress: {uploadProgress}%</p>
            )}
            {!isUploading && uploadProgress > 0 && (
                <button onClick={handleResume}>Resume</button>
            )}
        </div>
    );
};

export default Uploader;