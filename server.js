// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

// Load environment variables from .env file
dotenv.config();

app.use(express.json()); // Parse incoming JSON 

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));     // General routes
app.use('/admin', require('./routes/admin')); // Admin-related routes
app.use('/doctor', require('./routes/doctor')); // Doctor-related routes
app.use('/auth', require('./routes/auth'));   // Authentication routes

// Handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running locally at http://localhost:${PORT}`);
});

// Check the .env file