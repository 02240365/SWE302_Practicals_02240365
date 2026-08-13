/**
 * routes/results.js
 * -----------------------------------------------------------------------
 * GET /api/results/:studentId
 * Only registered students (those with at least one registered module)
 * may view their results: Module Code, Module Title, Grade.
 * -----------------------------------------------------------------------
 */
const express = require('express');
const { findStudent } = require('../db');

const router = express.Router();

router.get('/results/:studentId', (req, res) => {
  const { studentId } = req.params;
  const student = findStudent(studentId);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  // Only registered students (i.e. registeredModules is non-empty) may view results.
  if (!student.registeredModules || student.registeredModules.length === 0) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only registered students may view results.',
    });
  }

  return res.status(200).json({ success: true, results: student.results });
});

module.exports = router;
