/**
 * Frontend validation schema using Yup
 * Mirrors backend validation rules for immediate user feedback
 */

import * as yup from 'yup';

export const sifFormSchema = yup.object({
  employeeQID: yup
    .string()
    .required('Employee QID is required')
    .matches(/^\d+$/, 'Employee QID must contain numbers only')
    .length(11, 'Employee QID must be exactly 11 digits'),

  employeeName: yup
    .string()
    .required('Employee name is required')
    .max(100, 'Employee name cannot exceed 100 characters'),

  employeeBank: yup
    .string()
    .required('Employee bank is required')
    .max(100, 'Bank name cannot exceed 100 characters'),

  employeeAccount: yup
    .string()
    .required('Employee account number is required')
    .matches(/^[a-zA-Z0-9]+$/, 'Account number must be alphanumeric only')
    .max(50, 'Account number cannot exceed 50 characters'),

  workingDays: yup
    .number()
    .typeError('Working days must be a valid number')
    .required('Working days is required')
    .min(0, 'Working days cannot be negative')
    .max(31, 'Working days cannot exceed 31'),

  totalSalary: yup
    .number()
    .typeError('Total salary must be a valid number')
    .required('Total salary is required')
    .positive('Total salary must be a positive number'),
});
