/**
 * Home Page - Main page of the SIF Generator application
 */

import React, { useState } from 'react';
import FormCard from '../components/FormCard';
import HistoryTable from '../components/HistoryTable';

const Home = () => {
  const [historyKey, setHistoryKey] = useState(0);

  // Refresh history table after a new SIF is generated
  const handleGenerated = () => {
    setHistoryKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:py-16">
      {/* Page Header */}
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          SIF Generator
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto">
          Generate Salary Information Files from employee data — fast, validated, and ready to download.
        </p>
      </header>

      {/* Form Section */}
      <section aria-label="SIF Generation Form" onClick={handleGenerated}>
        <FormCard />
      </section>

      {/* History Section */}
      <section aria-label="Generated SIF History">
        <HistoryTable key={historyKey} />
      </section>

      {/* Footer */}
      <footer className="text-center mt-12 text-xs text-slate-400 dark:text-slate-600">
        SIF Generator &copy; {new Date().getFullYear()} — Built with MERN Stack
      </footer>
    </main>
  );
};

export default Home;
