const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Login route (for both admin and doctor)
exports.login = (req, res) => {
    const { email, password } = req.body;
    //console.log(email, password)
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Invalid email1 or password' });
        }

        const user = results[0];
        console.log(user)
        //bcrypt.compare(password, user.password, (err, match) => {
        //console.log(password, user.password, match)
        if (user.password != password) {
            return res.status(401).json({ error: 'Invalid email2 or password' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' });
        console.log(token)
        res.json({ message: 'Login successful', token, role: user.role });
        });
    //});
};

// Logout route 
exports.logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

// MODIFY THE FRONTEND TO DISCARD THE TOKEN