/**
 * Reusable backend validation helpers for SIF form data
 */

/**
 * Validates all fields for SIF generation
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: Object }}
 */
const validateSIFData = (data) => {
  const errors = {};

  const {
    employeeQID,
    employeeName,
    employeeBank,
    employeeAccount,
    workingDays,
    totalSalary,
  } = data;

  // ── Employee QID ──────────────────────────────────────────────────────────
  if (!employeeQID || String(employeeQID).trim() === '') {
    errors.employeeQID = 'Employee QID is required';
  } else if (!/^\d+$/.test(String(employeeQID).trim())) {
    errors.employeeQID = 'Employee QID must contain numbers only';
  } else if (String(employeeQID).trim().length !== 11) {
    errors.employeeQID = 'Employee QID must be exactly 11 digits';
  }

  // ── Employee Name ─────────────────────────────────────────────────────────
  if (!employeeName || String(employeeName).trim() === '') {
    errors.employeeName = 'Employee name is required';
  }

  // ── Employee Bank ─────────────────────────────────────────────────────────
  if (!employeeBank || String(employeeBank).trim() === '') {
    errors.employeeBank = 'Employee bank is required';
  }

  // ── Employee Account ──────────────────────────────────────────────────────
  if (!employeeAccount || String(employeeAccount).trim() === '') {
    errors.employeeAccount = 'Employee account number is required';
  } else if (!/^[a-zA-Z0-9]+$/.test(String(employeeAccount).trim())) {
    errors.employeeAccount = 'Account number must be alphanumeric only';
  }

  // ── Working Days ──────────────────────────────────────────────────────────
  const days = Number(workingDays);
  if (workingDays === undefined || workingDays === null || String(workingDays).trim() === '') {
    errors.workingDays = 'Working days is required';
  } else if (isNaN(days) || !Number.isFinite(days)) {
    errors.workingDays = 'Working days must be a valid number';
  } else if (days < 0) {
    errors.workingDays = 'Working days cannot be negative';
  } else if (days > 31) {
    errors.workingDays = 'Working days cannot exceed 31';
  }

  // ── Total Salary ──────────────────────────────────────────────────────────
  const salary = Number(totalSalary);
  if (totalSalary === undefined || totalSalary === null || String(totalSalary).trim() === '') {
    errors.totalSalary = 'Total salary is required';
  } else if (isNaN(salary) || !Number.isFinite(salary)) {
    errors.totalSalary = 'Total salary must be a valid number';
  } else if (salary <= 0) {
    errors.totalSalary = 'Total salary must be a positive number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitizes string input by trimming whitespace
 * @param {string} value
 * @returns {string}
 */
const sanitizeString = (value) => {
  if (typeof value !== 'string') return String(value ?? '').trim();
  return value.trim();
};

module.exports = { validateSIFData, sanitizeString };
