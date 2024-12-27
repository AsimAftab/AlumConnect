const express = require('express');
const { loginAdmin } = require('../controllers/admin');  // Admin controller
const validateLogin = require('../middleware/authMiddleware');  // Middleware for validation

const router = express.Router();

// POST route for login
router.post('/login', validateLogin, loginAdmin);

module.exports = router;
