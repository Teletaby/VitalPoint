const db = require('../config/db'); // Access db config

// Controller to fetch all users
function getAllUsers(req, res) {
    console.log('Controller called: Fetching all users');
    db.query('SELECT id, email, role FROM users', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Failed to fetch users' });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        console.log('Query results:', results);
        res.json(results); // Send the users as a response
    });
}


module.exports = { getAllUsers };

