const db = require('../config/db');

// Helper to generate a unique Class Code (e.g., "AB12CD")
const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 1. CREATE CLASS (Teacher Only)
exports.createClass = (req, res) => {
    const { title, description } = req.body;
    const teacher_id = req.user.id; // Comes from the middleware
    const join_code = generateClassCode();

    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied. Teachers only.' });
    }

    const sql = 'INSERT INTO classes (title, description, teacher_id, join_code) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, description, teacher_id, join_code], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Class created!', join_code });
    });
};

// 2. JOIN CLASS (Student Only)
exports.joinClass = (req, res) => {
    const { join_code } = req.body;
    const student_id = req.user.id;

    // First, find the class ID using the code
    db.query('SELECT id FROM classes WHERE join_code = ?', [join_code], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Invalid Class Code' });

        const class_id = results[0].id;

        // Then, enroll the student
        const sql = 'INSERT INTO enrollments (student_id, class_id) VALUES (?, ?)';
        db.query(sql, [student_id, class_id], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Already joined this class' });
                return res.status(500).json(err);
            }
            res.status(200).json({ message: 'Joined class successfully!' });
        });
    });
};

// 3. GET MY CLASSES (For Dashboard)
exports.getClasses = (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    let sql;
    if (role === 'teacher') {
        // If teacher, get classes they created
        sql = 'SELECT * FROM classes WHERE teacher_id = ?';
    } else {
        // If student, join tables to get classes they are enrolled in
        sql = `SELECT c.*, u.name as teacher_name 
               FROM classes c 
               JOIN enrollments e ON c.id = e.class_id 
               JOIN users u ON c.teacher_id = u.id 
               WHERE e.student_id = ?`;
    }
    // ... existing imports and functions

    // 4. CREATE ASSIGNMENT (Teacher Only)
    exports.createAssignment = (req, res) => {
        const { class_id, title, description, due_date } = req.body;

        // Security check: Ensure the teacher actually owns this class
        // (In a real app, you would query the DB to check ownership here)

        const sql = 'INSERT INTO assignments (class_id, title, description, due_date) VALUES (?, ?, ?, ?)';
        db.query(sql, [class_id, title, description, due_date], (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ message: 'Assignment created successfully!' });
        });
    };

    // 5. GET ASSIGNMENTS (For a specific class)
    exports.getAssignments = (req, res) => {
        const { class_id } = req.params; // We will pass class_id in the URL

        const sql = 'SELECT * FROM assignments WHERE class_id = ? ORDER BY due_date ASC';
        db.query(sql, [class_id], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        });
    };

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};