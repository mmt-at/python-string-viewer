import React, { useRef, useState } from 'react';
import VariableInputs from './VariableInputs';

interface StringEditorProps {
  inputString: string;
  setInputString: React.Dispatch<React.SetStateAction<string>>;
  variables: Record<string, string>;
  setVariables: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isFString: boolean;
  selectedLanguage: string;
}

const StringEditor: React.FC<StringEditorProps> = ({
  inputString,
  setInputString,
  variables,
  setVariables,
  isFString,
  selectedLanguage
}) => {
  const [splitPosition, setSplitPosition] = useState(70);
  const splitPaneRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !splitPaneRef.current) return;

    const containerRect = splitPaneRef.current.getBoundingClientRect();
    const newPosition = Math.min(
      Math.max(
        ((e.clientY - containerRect.top) / containerRect.height) * 100,
        20
      ),
      80
    );
    
    setSplitPosition(newPosition);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const getPlaceholderText = () => {
    if (selectedLanguage === 'python') {
      return 'Enter a Python string (e.g., """Hello\\nWorld""" or f"""Hello {name}""")';
    } else if (selectedLanguage === 'javascript') {
      return 'Enter a JavaScript string (e.g., `Hello\\nWorld` or `Hello ${name}`)';
    }
    return 'Enter text with escape sequences like \\n, \\t, etc.';
  };

  return (
    <div className="w-1/2 border-r border-gray-200 dark:border-gray-700">
      <div className="h-full flex flex-col">
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium">Input</h2>
        </div>

        <div 
          ref={splitPaneRef}
          className="flex-1 flex flex-col relative"
        >
          <div 
            style={{ height: isFString ? `${splitPosition}%` : '100%' }}
            className="relative"
          >
            <textarea
              value={inputString}
              onChange={(e) => setInputString(e.target.value)}
              placeholder={getPlaceholderText()}
              className="w-full h-full p-4 font-mono text-sm bg-white dark:bg-gray-800 border-none resize-none focus:outline-none focus:ring-0 absolute inset-0 overflow-auto"
              spellCheck="false"
            />
          </div>

          {isFString && (
            <>
              <div 
                className="cursor-row-resize h-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors duration-150"
                onMouseDown={handleMouseDown}
              />
              
              <div 
                className="relative bg-white dark:bg-gray-800" 
                style={{ height: `${100 - splitPosition}%` }}
              >
                <div className="absolute inset-0 overflow-auto">
                  <VariableInputs 
                    variables={variables} 
                    setVariables={setVariables} 
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StringEditor;