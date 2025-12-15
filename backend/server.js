const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Database Connection
const db = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const app = express();

// Middleware
app.use(express.json()); // Allows parsing of JSON data in the request body
app.use(cors());         // Allows your React frontend to communicate with this backend

// Route Middlewares
app.use('/api/auth', authRoutes); // Registers the login/register routes

app.use('/api/classes', classRoutes);

// Simple Test Route
app.get('/', (req, res) => {
    res.send("Classroom API is running...");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});