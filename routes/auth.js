const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

// Login route (for both admin and doctor)
router.post('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;

