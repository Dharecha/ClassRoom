const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes here require the user to be logged in
router.post('/create', authMiddleware, classController.createClass);
router.post('/join', authMiddleware, classController.joinClass);
router.post('/assignment', authMiddleware, classController.createAssignment);
router.get('/my-classes', authMiddleware, classController.getClasses);
router.get('/:class_id/assignments', authMiddleware, classController.getAssignments);

module.exports = router;