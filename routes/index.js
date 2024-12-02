const express = require('express');
const router = express.Router();
const path = require('path');

// Route for homepage (non-logged in users)
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/about', (req, res) => {
    res.send('About page');
});

module.exports = router;
