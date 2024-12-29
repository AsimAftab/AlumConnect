const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const settingsRoutes = require('./routes/settingsRoutes');  
const recordRoutes=  require('./routes/recordRoutes');
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

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Uploads directory created.');
}
// Middleware for logging requests
app.use(morgan('dev'));

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();


// Homepage
app.get('/', (req, res) => {
    res.render('homepage', { title: 'Welcome to Alum Connect' }); // Render the EJS file
});



app.use(authRoutes);
app.use(dashboardRoutes);
app.use(settingsRoutes);
app.use(recordRoutes);




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
