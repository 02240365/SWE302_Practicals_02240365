/**
 * routes/payment.js
 * -----------------------------------------------------------------------
 * POST /api/payment/upload
 * Implements R5 (Mobile Banking only - informational/fixed method),
 * R6 (screenshot mandatory + file type), R7 (transaction number format),
 * R8 (receipt generated when verified) and R9 (registration stays
 * incomplete when verification fails / upload is incomplete).
 *
 * Uses multer with memory storage so no files are ever written to disk
 * (keeps the demo self-contained and safe to run anywhere).
 * -----------------------------------------------------------------------
 */
const express = require('express');
const multer = require('multer');
const { validatePaymentScreenshot, validateTransactionNumber } = require('../validators');
const { findStudent } = require('../db');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/payment/upload', upload.single('screenshot'), (req, res) => {
  const { studentId, transactionNumber, verifiedByCollege } = req.body;

  const student = findStudent(studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  // R6: screenshot mandatory + file type check
  const fileName = req.file ? req.file.originalname : null;
  const fileCheck = validatePaymentScreenshot(fileName);
  if (!fileCheck.valid) {
    return res.status(400).json({ success: false, message: fileCheck.message });
  }

  // R7: transaction number format check
  const txnCheck = validateTransactionNumber(transactionNumber);
  if (!txnCheck.valid) {
    return res.status(400).json({ success: false, message: txnCheck.message });
  }

  // R8 / R9: college verification outcome (simulated via a form field,
  // representing the back-office verification step in a real system)
  const isVerified = verifiedByCollege === 'true' || verifiedByCollege === true;

  if (!isVerified) {
    student.tuitionPaid = false;
    student.paymentReceipt = null;
    return res.status(202).json({
      success: false,
      message: 'Payment could not be verified. Registration remains incomplete.',
    });
  }

  student.tuitionPaid = true;
  student.paymentReceipt = `RECEIPT-${transactionNumber}-${Date.now()}`;
  return res.status(200).json({
    success: true,
    message: 'Payment verified. Electronic receipt generated.',
    receipt: student.paymentReceipt,
  });
});

module.exports = router;
