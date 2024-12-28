const express = require('express');
const router = express.Router();
const authController = require('../controllers/admin'); // Adjusted path based on the provided controller name

const {addNewAdmin} = require('../controllers/addAdminController');

router.post('addAdmin',addNewAdmin);
// GET /login - Render login page
router.get('/login', authController.getLogin);

// POST /login - Handle login form submission
router.post('/login', authController.postLogin);

module.exports = router;
