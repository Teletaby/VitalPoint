const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/auth-middleware');
const adminController = require('../controllers/admin-controller');
const path = require('path');

// Protect all admin routes
//router.use(authenticateToken);
//router.use(authorizeRole('admin'));

// Route for admin homepage
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
});


// Route to get admin dashboard data
router.get('/dashboard', (req, res, next) => {
    //console.log('Route called');
    next();
}, adminController.getAllUsers);

module.exports = router;