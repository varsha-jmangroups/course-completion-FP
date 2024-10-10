const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getCertificatesForUser,
  updateCertificate,
  deleteCertificate,
  getCertificateDetails,
} = require('../controllers/certificateController');

// Route to generate a new certificate for a user
router.post('/', generateCertificate);

// Route to get all certificates for a specific user
router.get('/user/:userId', getCertificatesForUser);

// Route to update a certificate by ID
router.put('/:id', updateCertificate);

// Route to delete a certificate by ID
router.delete('/:id', deleteCertificate);

// Route to get detailed certificate info
router.get('/:id', getCertificateDetails);

module.exports = router;
