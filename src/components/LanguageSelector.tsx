'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { language, setLanguage, translate } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  ];

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        title={translate('app.title')}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === language)?.flag} {' '}
          {languages.find(lang => lang.code === language)?.name}
        </span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ${
              language === lang.code
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <div>
              <div className="font-medium">{lang.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {lang.code === 'en' && 'English'}
                {lang.code === 'hi' && 'हिंदी'}
                {lang.code === 'mr' && 'मराठी'}
              </div>
            </div>
            {language === lang.code && (
              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
