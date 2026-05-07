/**
 * PreviewBox - Displays the generated SIF file content before download
 */

import React, { useState } from 'react';
import { downloadFile, getAppOrigin } from '../utils/helpers';

/**
 * @param {Object} props
 * @param {string} props.sifContent - The raw SIF file content to preview
 * @param {string} props.downloadUrl - Full URL to download the file
 * @param {string} props.fileName - The generated file name
 * @param {Function} props.onReset - Callback to reset the form for a new entry
 */
const PreviewBox = ({ sifContent, downloadUrl, fileName, onReset }) => {
  const [copied, setCopied] = useState(false);

  // Copy SIF content to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sifContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = sifContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Trigger file download
  const handleDownload = () => {
    const fullUrl = `${getAppOrigin()}${downloadUrl}`;
    downloadFile(fullUrl, fileName);
  };

  return (
    <div className="mt-6 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-green-100 dark:bg-green-900/40 border-b border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2">
          {/* Success checkmark */}
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              SIF Generated Successfully
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 font-mono">{fileName}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* SIF Content Preview */}
      <div className="p-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
          File Preview
        </p>
        <pre className="sif-preview text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-lg p-4 overflow-x-auto border border-slate-200 dark:border-slate-700 whitespace-pre-wrap break-all">
          {sifContent}
        </pre>
      </div>

      {/* Generate another button */}
      <div className="px-4 pb-4">
        <button
          onClick={onReset}
          className="w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
        >
          + Generate Another SIF
        </button>
      </div>
    </div>
  );
};

export default PreviewBox;
