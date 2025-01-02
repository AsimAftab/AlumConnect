// const express = require('express');
// const addAdminController = require('../controllers/addAdminController');
// const router = express.Router();
// const isAuthenticated = require('../middleware/authMiddleware');

// // Settings Route
// router.get('/settings', isAuthenticated, (req, res) => {
//     const user = {
//         name: 'Rheya',
//         role: 'Admin',
//         profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces',
//         fullname: 'Rheya Kumar',
//         email: 'rheya@example.com',
//         phone: '9876543210'
//     };

//     res.render('settings', {
//         user: user,
//         activePage: 'settings',
//         activeSidebar: 'accountSetting'
//     });
// });

// // Add New Admin Route (under settings)
// router.get('/settings/addNewAdmin',isAuthenticated, (req, res) => {
//     const admin = { name: '', email: '' };
//     res.render('addNewAdmin', { admin });
//     // res.render('settings', { activePage: 'settings', activeSidebar: 'addNewAdmin', user: req.user });
// });

// // Handle the POST request to add new admin
// router.post('/settings/addNewAdmin',isAuthenticated, addAdminController.addNewAdmin);

// app.get('/settings/account', (req, res) => {
//     res.render('partials/accountSettings'); // Render the Account Settings partial
// });

// app.get('/settings/addAdmin', (req, res) => {
//     res.render('partials/addAdmin'); // Render the Add Admin partial
// });

// module.exports = router;
const express = require('express');
const addAdminController = require('../controllers/addAdminController');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');

// Settings Route
router.get('/settings', isAuthenticated, (req, res) => {
    const user = {
        name: 'Rheya',
        role: 'Admin',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces',
        fullname: 'Rheya Kumar',
        email: 'rheya@example.com',
        phone: '9876543210'
    };

    res.render('settings', {
        user: user,
        activePage: 'settings',
        activeSidebar: 'accountSetting', // Default sidebar
        panel: 'account' // Default panel for rendering
    });
});

// Add New Admin Route (under settings)
router.get('/settings/addNewAdmin', isAuthenticated, (req, res) => {
    const user = {
        name: 'Rheya',
        role: 'Admin',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces',
        fullname: 'Rheya Kumar',
        email: 'rheya@example.com',
        phone: '9876543210'
    };

    res.render('settings', {
        user: user,
        activePage: 'settings',
        activeSidebar: 'addNewAdmin', // Highlight Add New Admin sidebar
        panel: 'addAdmin' // Specify the panel to render dynamically
    });
});

// Handle the POST request to add a new admin
router.post('/settings/addNewAdmin', isAuthenticated, addAdminController.addNewAdmin);

module.exports = router;
