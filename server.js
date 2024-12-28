const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authController = require('./controllers/admin'); // Correctly import your login controller

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set views directory

// Session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET || '12345',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 3600000, // Cookie expiration time (1 hour)
    },
}));

// Middleware for logging requests
app.use(morgan('dev'));

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.adminId) {
        return next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        return res.redirect('/login'); // User is not authenticated, redirect to login
    }
};

// Routes

// Homepage
app.get('/', (req, res) => {
    res.render('homepage', { title: 'Welcome to Alum Connect' }); // Render the EJS file
});

// Settings
app.get('/settings',isAuthenticated, (req, res) => {
    // Assuming you have user data stored in session or database
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
        activeSidebar: 'accountSetting'
    });
});

// Login
app.get('/login', authController.getLogin);



// Dashboard (Protected by authentication middleware)
app.get('/dashboard',isAuthenticated, (req, res) => {
    // Fetch user data, e.g., from a database
    const users = [
      { name: 'John Doe', email: 'john.doe@example.com' },
      { name: 'Jane Smith', email: 'jane.smith@example.com' },
      // Add more users if needed
    ];
  
    // Make sure to pass the 'users' array to the view
    res.render('dashboard', {
      users: users, // passing the users array to the EJS template
      alumniCount: 10, // Example: Pass any other dynamic data
      higherStudiesCount: 5,
      placedCount: 8,
      entrepreneurCount: 3
    });
  });
  
  
// Add New Admin (Protected by authentication middleware)
app.get('/addNewAdmin', (req, res) => {
    // Optionally, pass any default values for admin (if any)
    const admin = {
        name: '',
        email: ''
    };
    
    res.render('addNewAdmin', { admin });
});

// POST route for login
app.post('/login', authController.postLogin); // Use the login controller to handle login form submission

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to destroy session' });
        }

        // Clear the session cookie
        res.clearCookie('connect.sid', {
            httpOnly: true,
            secure: false, // Set to true in production when using HTTPS
            path: '/',
        });

        // Send a success response to indicate that the logout was successful
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
