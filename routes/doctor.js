const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/auth-middleware');
const doctorController = require('../controllers/doctor-controller');

// Protect all doctor routes
router.use(authenticateToken);
router.use(authorizeRole('doctor'));

// Route for doctor homepage
router.get('/doctor', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/doctor/dashboard.html'));
});

// Route to get doctor’s schedule
router.get('/dashboard', doctorController.getDoctorSchedule);

module.exports = router;
