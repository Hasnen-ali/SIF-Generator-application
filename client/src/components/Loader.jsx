/**
 * Loader - Animated spinner component for loading states
 */

import React from 'react';

/**
 * @param {Object} props
 * @param {string} [props.text] - Optional loading text
 * @param {string} [props.size] - 'sm' | 'md' | 'lg'
 */
const Loader = ({ text = 'Generating...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-4',
  };

  return (
    <span className="flex items-center justify-center gap-2" role="status" aria-live="polite">
      <span
        className={`
          inline-block rounded-full border-white border-t-transparent animate-spin
          ${sizeClasses[size]}
        `}
        aria-hidden="true"
      />
      {text && <span>{text}</span>}
    </span>
  );
};

export default Loader;
