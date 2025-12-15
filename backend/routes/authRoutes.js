const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /api/auth/register -> helpful message
router.get('/register', authController.showRegister);

// POST /api/auth/register -> actually register a user
router.post('/register', authController.register);

// POST /api/auth/login -> login
router.post('/login', authController.login);

module.exports = router;