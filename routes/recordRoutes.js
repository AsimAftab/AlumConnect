// routes/recordRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const recordController = require('../controllers/recordController');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });
const router = express.Router();

// Upload Excel and save to DB
router.post('/upload', upload.single('file'), recordController.uploadExcel);

// Fetch records for rendering
router.get('/records', recordController.getRecords);

module.exports = router;
