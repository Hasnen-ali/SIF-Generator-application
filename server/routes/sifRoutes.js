/**
 * SIF API Routes
 */

const express = require('express');
const router = express.Router();
const { generateSIFHandler, getHistoryHandler } = require('../controllers/sifController');

// POST /api/generate-sif  → Generate a new SIF file
router.post('/generate-sif', generateSIFHandler);

// GET /api/history        → Fetch all generated SIF records
router.get('/history', getHistoryHandler);

module.exports = router;
