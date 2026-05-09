/**
 * SIF File Generator Utility
 *
 * Generates a Salary Information File (.sif) matching the provided sample
 * and saves it to the /generated-files directory.
 */

const fs = require('fs');
const path = require('path');

/**
 * Formats a Date object into YYYYMMDD string
 * @param {Date} date
 * @returns {string}
 */
const formatTimestamp = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * Sanitizes a name for use in a filename (replaces spaces with underscores, removes special chars)
 * @param {string} name
 * @returns {string}
 */
const sanitizeFileName = (name) => {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')   // remove non-alphanumeric except spaces
    .trim()
    .replace(/\s+/g, '_');          // replace spaces with underscores
};

/**
 * Escapes a value for comma-separated SIF content.
 * @param {*} value
 * @returns {string}
 */
const escapeSIFValue = (value) => {
  const stringValue = String(value ?? '');

  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

/**
 * Generates SIF file content as a comma-separated string
 * @param {Object} data - Employee data
 * @returns {string} - SIF file content
 */
const buildSIFContent = (data) => {
  const header = [
    'Record Sequence',
    'Employee QID',
    'Employee Name',
    'Employee Bank Short Name',
    'Employee Account',
    'Number of Working Days',
    'Net Salary',
  ].join(',');

  const record = [
    1,
    data.employeeQID,
    data.employeeName.toUpperCase(),
    data.employeeBank.toUpperCase(),
    data.employeeAccount,
    data.workingDays,
    data.totalSalary,
  ].map(escapeSIFValue).join(',');

  return `${header}\r\n${record}\r\n`;
};

/**
 * Main function: generates and saves a SIF file
 * @param {Object} data - Validated employee data
 * @returns {{ filePath: string, fileName: string, sifContent: string }}
 */
const generateSIF = (data) => {
  const timestamp = formatTimestamp();
  const safeName = sanitizeFileName(data.employeeName);
  const fileName = `SIF_${safeName}_${timestamp}.sif`;

  // In Electron mode, use the userData path; otherwise use the default
  const outputDir = process.env.GENERATED_FILES_DIR
    || path.join(__dirname, '..', 'generated-files');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, fileName);
  const sifContent = buildSIFContent(data);

  // Write file synchronously
  fs.writeFileSync(filePath, sifContent, { encoding: 'utf8' });

  return { filePath, fileName, sifContent };
};

module.exports = { generateSIF, formatTimestamp, sanitizeFileName, buildSIFContent };
