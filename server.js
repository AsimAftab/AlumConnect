const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authController = require('./controllers/admin'); // Correctly import your login controller

dotenv.config();

const app = express();

// Session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET || '12345',
    resave: false,
    saveUninitialized:true,
    cookie: {
        httpOnly: true,
        secure: false,  // Set to true if using HTTPS
        maxAge: 3600000,  // Cookie expiration time (1 hour)
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
        return next();  // User is authenticated, proceed to the next middleware or route handler
    } else {
        // alert('You are not authenticated!');  // Alert the user that they are not authenticated
        return res.redirect('/login');  // User is not authenticated, redirect to login
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homepage.html'));
});

// Login route (GET)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Dashboard route (GET) - Protected by authentication middleware
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// POST route for login
app.post('/login', authController.postLogin);  // Use the login controller to handle login form submission

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
  
      // Clear the session cookie
      res.clearCookie('connect.sid', {
        httpOnly: true,  // Make sure cookie is only accessible via HTTP requests
        secure: false,   // Set to true in production when using HTTPS
        path: '/'        // Make sure it matches the path where the cookie is set
      });
  
      res.json({ message: 'Logged out successfully' });
    });
  });
  

// app.post('/logout', (req, res) => {
//     res.json({ message: 'Logged out successfully' });
//   });
  
// Route not found handler
// app.use((req, res, next) => {
//     res.status(404).json({ error: 'Route not found' });
// });

  
  

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
