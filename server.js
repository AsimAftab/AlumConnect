const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const Admin = require('./models/admin'); // Assuming you have an Admin model

dotenv.config();

const app = express();

// Session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET || '12345', // You can change this to any secret key
    resave: false,  // Don't save session if unmodified
    saveUninitialized: false,  // Don't create a session until something is stored
    cookie: {
        secure: false, // Set to true if you're using HTTPS (for production)
        maxAge: 3600000, // 1 hour session duration
    }
}));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();

// Routes
// Serve the homepage.html file when visiting /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homepage.html'));
});

// Serve the login.html file when visiting /login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Handle login POST request to check admin credentials
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email in the database
        const admin = await Admin.findOne({ email });

        // If no admin is found
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Compare provided password with the stored password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (isMatch) {
            // Store admin information in the session
            req.session.adminId = admin._id;
            req.session.email = admin.email;

            // Redirect or respond with success
            return res.redirect('/dashboard'); // Redirect to homepage or other protected route
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// // Route not found handler
// app.use((req, res, next) => {
//     res.status(404).json({ error: 'Route not found' });
// });

// Start the server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});
