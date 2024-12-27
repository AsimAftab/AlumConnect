const express = require('express');
const router = express.Router();
const authController = require('../controllers/admin'); // Adjusted path based on the provided controller name

// GET /login - Render login page
router.get('/login', authController.getLogin);

// POST /login - Handle login form submission
router.post('/login', authController.postLogin);

module.exports = router;
