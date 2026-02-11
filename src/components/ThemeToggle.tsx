'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => {
        toggleTheme();
      }}
      className="p-2 rounded-lg transition-all duration-200 ease-in-out group"
      style={{
        backgroundColor: theme === 'light' ? '#f3f4f6' : '#1f2937',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme === 'light' ? '#e5e7eb' : '#374151';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme === 'light' ? '#f3f4f6' : '#1f2937';
      }}
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 w-5 h-5 text-amber-600 transition-all duration-200 ${
            theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 w-5 h-5 text-blue-600 transition-all duration-200 ${
            theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`} 
        />
      </div>
    </button>
  );
};
