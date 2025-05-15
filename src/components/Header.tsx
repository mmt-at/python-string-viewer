import React from 'react';
import { Code2, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  selectedLanguage, 
  setSelectedLanguage,
  isDark,
  setIsDark
}) => {
  const languages = [
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'plaintext', name: 'Plain Text' }
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Code2 className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Python String Visualizer
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <label htmlFor="language-select" className="text-sm font-medium">
              Language:
            </label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;