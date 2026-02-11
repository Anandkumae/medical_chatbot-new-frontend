'use client';

import { useEffect, useState } from 'react';

interface ThemeTestProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeTest = ({ theme, toggleTheme }: ThemeTestProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div 
      className="fixed bottom-4 left-4 p-3 sm:p-4 rounded-lg border z-50"
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
        borderColor: theme === 'light' ? '#d1d5db' : '#4b5563',
        color: theme === 'light' ? '#111827' : '#f9fafb'
      }}
    >
      <p className="text-xs sm:text-sm font-mono">
        Current theme: <span className="font-bold">{theme}</span>
      </p>
      <p 
        className="text-xs mt-1"
        style={{
          color: theme === 'light' ? '#6b7280' : '#9ca3af'
        }}
      >
        HTML class: {isClient ? (typeof window !== 'undefined' ? document.documentElement.className : 'N/A') : 'Loading...'}
      </p>
      <button
        onClick={toggleTheme}
        className="mt-2 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors duration-200"
        style={{
          backgroundColor: '#2563eb',
          color: '#ffffff'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1d4ed8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
        }}
      >
        Toggle Theme
      </button>
    </div>
  );
};
