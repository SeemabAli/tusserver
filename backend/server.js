import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();

// Enable CORS for all origins
app.use(cors());

// Configure multer to store files in a local directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads');
        // Ensure the uploads directory exists
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    },
});

const upload = multer({ storage });

// Endpoint to handle file uploads
app.post('/uploads', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Construct the cloud path URL
    const cloudPath = `https://ahcl.tssclinicallabs.com/uploads/${req.file.originalname}`;

    res.send({
        message: 'File uploaded successfully!',
        file: req.file,
        cloudPath: cloudPath, // Return the cloud path
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});