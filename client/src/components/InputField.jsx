/**
 * InputField - Reusable form input component
 * Integrates with React Hook Form and displays validation errors
 */

import React from 'react';

/**
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.name - Field name (used by RHF)
 * @param {string} [props.type] - Input type (default: 'text')
 * @param {string} [props.placeholder] - Placeholder text
 * @param {Object} props.register - React Hook Form register function result
 * @param {Object} [props.error] - RHF field error object
 * @param {string} [props.hint] - Optional hint text below the input
 * @param {boolean} [props.required] - Whether the field is required
 */
const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  hint,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label
        htmlFor={name}
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">*</span>
        )}
      </label>

      {/* Input */}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        className={`
          w-full px-4 py-2.5 rounded-lg border text-sm transition-colors duration-200
          bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error
            ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
          }
        `}
        {...register}
      />

      {/* Hint text */}
      {hint && !error && (
        <p id={`${name}-hint`} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}

      {/* Validation error */}
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
