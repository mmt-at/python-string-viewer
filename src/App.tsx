import React, { useState, useEffect } from 'react';
import StringEditor from './components/StringEditor';
import OutputDisplay from './components/OutputDisplay';
import { parseString, extractVariables, processStringWithVariables } from './utils/stringProcessor';
import Header from './components/Header';

function App() {
  const [inputString, setInputString] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [isFString, setIsFString] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variableColors, setVariableColors] = useState<Record<string, string>>({});
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    try {
      if (isFString) {
        setOutput(processStringWithVariables(inputString, variables, variableColors));
      } else {
        setOutput(parseString(inputString, selectedLanguage));
      }
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [inputString, variables, selectedLanguage, isFString, variableColors]);

  useEffect(() => {
    const fStringPattern = /f(['"]).*\{.*\}.*\1/s;
    const tripleFStringPattern = /f(['"])(['"])(['"])([\s\S]*?)\3\2\1/s;
    
    const isFStr = 
      fStringPattern.test(inputString) || 
      tripleFStringPattern.test(inputString) ||
      inputString.trim().startsWith('f"""') || 
      inputString.trim().startsWith("f'''");
    
    setIsFString(isFStr);
    
    if (isFStr) {
      const extractedVars = extractVariables(inputString);
      const newVars: Record<string, string> = {};
      
      extractedVars.forEach(varName => {
        newVars[varName] = variables[varName] || '';
      });
      
      setVariables(newVars);
      
      // Clean up colors for removed variables
      setVariableColors(prev => {
        const newColors = { ...prev };
        Object.keys(prev).forEach(key => {
          if (!extractedVars.includes(key)) {
            delete newColors[key];
          }
        });
        return newColors;
      });
    }
  }, [inputString]);

  const handleColorChange = (name: string, color: string) => {
    setVariableColors(prev => ({
      ...prev,
      [name]: color
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header 
        selectedLanguage={selectedLanguage} 
        setSelectedLanguage={setSelectedLanguage}
        isDark={isDark}
        setIsDark={setIsDark}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <StringEditor 
          inputString={inputString}
          setInputString={setInputString}
          variables={variables}
          setVariables={setVariables}
          isFString={isFString}
          selectedLanguage={selectedLanguage}
          variableColors={variableColors}
          onColorChange={handleColorChange}
        />
        
        <OutputDisplay 
          output={output} 
          error={error}
          variableColors={variableColors}
        />
      </div>
    </div>
  );
}

export default App;