const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { upload } = require('../middleware/uploadMiddleware');
const isAuthenticated  = require('../middleware/authMiddleware');

// Upload route with proper middleware chain
router.post('/upload',isAuthenticated,upload.single('file'), recordController.uploadExcel);

// Dashboard route


// Records API route
router.get('/records',isAuthenticated,recordController.getRecords);

module.exports = router;