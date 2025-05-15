import React, { useState } from 'react';
import { Copy, CheckCircle2, Code2, Quote } from 'lucide-react';

interface OutputDisplayProps {
  output: string;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, error }) => {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [quoteStyle, setQuoteStyle] = useState<'single' | 'double'>('double');

  const handleCopy = () => {
    const textToCopy = showRaw ? output : formattedOutput;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedOutput = showRaw ? output.trim() : `${quoteStyle === 'single' ? "'''" : '"""'}${output}${quoteStyle === 'single' ? "'''" : '"""'}`;

  return (
    <div className="w-1/2 flex flex-col overflow-hidden">
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium">Output</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setQuoteStyle(prev => prev === 'single' ? 'double' : 'single')}
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
              showRaw ? 'opacity-50 cursor-not-allowed' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            } text-gray-700 dark:text-gray-300 transition-colors duration-150`}
            disabled={showRaw}
            title={showRaw ? 'Switch to rendered view to change quote style' : 'Toggle quote style'}
          >
            <Quote className="w-4 h-4 mr-1" />
            {quoteStyle === 'single' ? "'''" : '"""'}
          </button>

          <button
            onClick={() => setShowRaw(!showRaw)}
            className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
          >
            <Code2 className="w-4 h-4 mr-1" />
            {showRaw ? 'Rendered' : 'Raw'}
          </button>

          <button
            onClick={handleCopy}
            disabled={!output || !!error}
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
              !output || !!error
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
            } transition-colors duration-150`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-auto">
          <div className="p-4 font-mono text-sm bg-white dark:bg-gray-800 whitespace-pre-wrap min-h-full">
            {error ? (
              <div className="text-red-500 dark:text-red-400">
                <span className="font-bold">Error: </span>
                {error}
              </div>
            ) : output ? (
              formattedOutput
            ) : (
              <span className="text-gray-400 dark:text-gray-500 italic">
                Output will appear here
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputDisplay;