const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 3000;

app.use('/uploads', express.static('uploads'));

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will be stored in the 'uploads/' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});

const upload = multer({ storage: storage });

// Enable CORS
app.use(cors());

// POST endpoint for uploading a post with text and image
app.post('/upload', upload.single('image'), (req, res) => {
    const { text } = req.body;
    const image = req.file;
    // Check if text and image are provided
    if (!text || !image) {
        return res.status(400).json({ error: 'Text and image are required' });
    }

    // Save or append the text to a file
    const textFileName = `uploads/response.txt`;
    const filePath = path.join(__dirname, textFileName);
    fs.appendFile(filePath, `${text}~http://localhost:${port}/uploads/${image.filename}~${Date.now()}\n`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to append text' });
        }
        // Process the post (e.g., save to database, upload image to storage)
        // Replace this with your actual processing logic

        res.json({ message: 'Post uploaded successfully' });
    });
});

app.get('/uploads', (req, res) => {
    fs.readFile('uploads/response.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve uploads' });
        }
        const uploads = data.split('\n').map((upload) => {
            const [text, image, uploadedOn] = upload.split('~');
            return { text, image, uploadedOn };
        }).filter((upload) => upload.text || upload.image);
        res.json(uploads);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
