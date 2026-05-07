/**
 * FormCard - Main SIF generation form
 * Uses React Hook Form + Yup for validation
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import InputField from './InputField';
import Loader from './Loader';
import PreviewBox from './PreviewBox';
import { sifFormSchema } from '../utils/validation';
import { generateSIF } from '../services/api';
import { downloadFile } from '../utils/helpers';

const FormCard = ({ onGenerated }) => {
  // ── React Hook Form setup ─────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(sifFormSchema),
    mode: 'onTouched', // validate on blur
  });

  // ── Generated file state ──────────────────────────────────────────────────
  const [result, setResult] = React.useState(null);

  // ── Form submission handler ───────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      setResult(null);
      const response = await generateSIF(data);

      setResult(response);
      onGenerated?.();

      // Auto-download the file
      const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      downloadFile(`${baseUrl}${response.downloadUrl}`, response.fileName);

      toast.success('SIF file generated and downloaded!', {
        icon: '📄',
      });
    } catch (error) {
      toast.error(error.message || 'Failed to generate SIF file. Please try again.');
    }
  };

  // ── Reset form and result ─────────────────────────────────────────────────
  const handleReset = () => {
    reset();
    setResult(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SIF Generator</h1>
              <p className="text-blue-100 text-sm">Generate Salary Information Files</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-5">
          {/* Row 1: QID + Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Employee QID"
              name="employeeQID"
              type="text"
              placeholder="e.g. 28765432109"
              required
              hint="Must be exactly 11 digits"
              register={register('employeeQID')}
              error={errors.employeeQID}
            />
            <InputField
              label="Employee Name"
              name="employeeName"
              type="text"
              placeholder="e.g. SEBASTIAN PAUL"
              required
              register={register('employeeName')}
              error={errors.employeeName}
            />
          </div>

          {/* Row 2: Bank + Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Employee Bank"
              name="employeeBank"
              type="text"
              placeholder="e.g. QNB"
              required
              register={register('employeeBank')}
              error={errors.employeeBank}
            />
            <InputField
              label="Account Number"
              name="employeeAccount"
              type="text"
              placeholder="e.g. 65641126497"
              required
              hint="Alphanumeric characters only"
              register={register('employeeAccount')}
              error={errors.employeeAccount}
            />
          </div>

          {/* Row 3: Working Days + Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Working Days"
              name="workingDays"
              type="number"
              placeholder="e.g. 30"
              required
              hint="Between 0 and 31"
              register={register('workingDays')}
              error={errors.workingDays}
            />
            <InputField
              label="Total Salary"
              name="totalSalary"
              type="number"
              placeholder="e.g. 10000"
              required
              hint="Must be a positive number"
              register={register('totalSalary')}
              error={errors.totalSalary}
            />
          </div>

          {/* Required fields note */}
          <p className="text-xs text-slate-400 dark:text-slate-500">
            <span className="text-red-500">*</span> All fields are required
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 px-6 rounded-xl font-semibold text-white text-sm
              flex items-center justify-center gap-2
              transition-all duration-200
              ${isSubmitting
                ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg'
              }
            `}
          >
            {isSubmitting ? (
              <Loader text="Generating SIF..." size="sm" />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                GENERATE SIF
              </>
            )}
          </button>
        </form>

        {/* Preview Section */}
        {result && (
          <div className="px-6 pb-6">
            <PreviewBox
              sifContent={result.sifContent}
              downloadUrl={result.downloadUrl}
              fileName={result.fileName}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCard;
