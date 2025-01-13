const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.send({
        message: 'File uploaded successfully!',
        file: req.file,
    });
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
