const db = require('../config/db');

exports.getDoctorSchedule = (req, res) => {
    const doctorId = req.query.id;  // Assuming doctor ID is passed as a query parameter
    const query = 'SELECT * FROM appointments WHERE doctor_id = ?';
    db.query(query, [doctorId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
};
