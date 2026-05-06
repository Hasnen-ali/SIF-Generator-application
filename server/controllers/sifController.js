/**
 * SIF Controller
 * Handles SIF generation requests, validation, file creation, and DB persistence
 */

const path = require('path');
const SIFRecord = require('../models/SIFRecord');
const { generateSIF } = require('../utils/generateSIF');
const { validateSIFData, sanitizeString } = require('../utils/validators');

/**
 * POST /api/generate-sif
 * Generates a SIF file from submitted employee data
 */
const generateSIFHandler = async (req, res) => {
  // ── Sanitize inputs ────────────────────────────────────────────────────────
  const sanitizedData = {
    employeeQID: sanitizeString(req.body.employeeQID),
    employeeName: sanitizeString(req.body.employeeName),
    employeeBank: sanitizeString(req.body.employeeBank),
    employeeAccount: sanitizeString(req.body.employeeAccount),
    workingDays: req.body.workingDays,
    totalSalary: req.body.totalSalary,
  };

  // ── Validate inputs ────────────────────────────────────────────────────────
  const { isValid, errors } = validateSIFData(sanitizedData);

  if (!isValid) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // ── Generate SIF file ──────────────────────────────────────────────────────
  const { fileName, sifContent } = generateSIF({
    ...sanitizedData,
    workingDays: Number(sanitizedData.workingDays),
    totalSalary: Number(sanitizedData.totalSalary),
  });

  // ── Save record to MongoDB ─────────────────────────────────────────────────
  const record = await SIFRecord.create({
    employeeQID: sanitizedData.employeeQID,
    employeeName: sanitizedData.employeeName,
    employeeBank: sanitizedData.employeeBank,
    employeeAccount: sanitizedData.employeeAccount,
    workingDays: Number(sanitizedData.workingDays),
    totalSalary: Number(sanitizedData.totalSalary),
    generatedFileName: fileName,
  });

  // ── Build download URL ─────────────────────────────────────────────────────
  const downloadUrl = `/generated-files/${fileName}`;

  return res.status(201).json({
    success: true,
    message: 'SIF generated successfully',
    downloadUrl,
    fileName,
    sifContent,
    record: {
      id: record._id,
      createdAt: record.createdAt,
    },
  });
};

/**
 * GET /api/history
 * Returns all previously generated SIF records
 */
const getHistoryHandler = async (req, res) => {
  const records = await SIFRecord.find()
    .sort({ createdAt: -1 })
    .select('-__v')
    .lean();

  return res.status(200).json({
    success: true,
    count: records.length,
    records,
  });
};

module.exports = { generateSIFHandler, getHistoryHandler };
