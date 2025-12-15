const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    // specific validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        // Check if user already exists
        db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert User
            db.query('INSERT INTO users SET ?',
                { name, email, password: hashedPassword, role },
                (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET handler for register endpoint (so GET /api/auth/register doesn't return "Cannot GET")
exports.showRegister = (req, res) => {
    // Provide a simple helpful response for GET requests.
    res.status(200).json({
        message: 'This endpoint accepts POST requests to create a new user. POST /api/auth/register with { name, email, password, role }.'
    });
};

// 2. LOGIN USER
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;

        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });
    });
};