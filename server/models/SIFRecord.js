/**
 * Mongoose schema for SIF records saved to MongoDB
 */

const mongoose = require('mongoose');

const SIFRecordSchema = new mongoose.Schema(
  {
    employeeQID: {
      type: String,
      required: [true, 'Employee QID is required'],
      match: [/^\d{11}$/, 'Employee QID must be exactly 11 digits'],
      trim: true,
    },
    employeeName: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      maxlength: [100, 'Employee name cannot exceed 100 characters'],
    },
    employeeBank: {
      type: String,
      required: [true, 'Employee bank is required'],
      trim: true,
      maxlength: [100, 'Bank name cannot exceed 100 characters'],
    },
    employeeAccount: {
      type: String,
      required: [true, 'Employee account number is required'],
      trim: true,
      maxlength: [50, 'Account number cannot exceed 50 characters'],
    },
    workingDays: {
      type: Number,
      required: [true, 'Working days is required'],
      min: [0, 'Working days cannot be negative'],
      max: [31, 'Working days cannot exceed 31'],
    },
    totalSalary: {
      type: Number,
      required: [true, 'Total salary is required'],
      min: [0.01, 'Salary must be a positive number'],
    },
    generatedFileName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('SIFRecord', SIFRecordSchema);
