const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fs = require('fs');
const cors = require('cors');
const connectDB = require('./config/db');
const authController = require('./controllers/authController');
const recordRoutes = require('./routes/recordRoutes');

dotenv.config();
const app = express();

// Middleware setup
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware setup
app.use(
    session({
        secret: process.env.SESSION_SECRET || '12345',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            maxAge: 3600000, // Cookie expiration time (1 hour)
        },
    })
);

// Connect to MongoDB
connectDB();

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Uploads directory created.');
}

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.adminId) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

// Routes

// Homepage
app.get('/', (req, res) => {
    res.render('homepage', { title: 'Welcome to Alum Connect' });
});

// Settings
app.get('/settings', isAuthenticated, (req, res) => {
    const user = {
        name: 'Rheya',
        role: 'Admin',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces',
        fullname: 'Rheya Kumar',
        email: 'rheya@example.com',
        phone: '9876543210',
    };

    res.render('settings', {
        user: user,
        activePage: 'settings',
        activeSidebar: 'accountSetting',
    });
});

// Login
app.get('/login', authController.getLogin);

// Add New Admin
app.get('/addNewAdmin', isAuthenticated, (req, res) => {
    const admin = {
        name: '',
        email: '',
    };

    res.render('addNewAdmin', { admin });
});

// Main routes for dashboard and upload
app.use('/', recordRoutes);

// POST route for login
app.post('/login', authController.postLogin);

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to destroy session' });
        }
        res.clearCookie('connect.sid', {
            httpOnly: true,
            secure: false,
            path: '/',
        });
        res.json({ message: 'Logged out successfully' });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong' });
});

// Route not found handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});