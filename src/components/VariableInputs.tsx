import React from 'react';

interface VariableInputsProps {
  variables: Record<string, string>;
  setVariables: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const VariableInputs: React.FC<VariableInputsProps> = ({ variables, setVariables }) => {
  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (Object.keys(variables).length === 0) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400 italic">
        No variables detected in the f-string.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-md font-medium mb-3">F-string Variables</h3>
      <div className="space-y-4">
        {Object.keys(variables).map(name => (
          <div key={name} className="space-y-1">
            <label 
              htmlFor={`var-${name}`} 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {name}
            </label>
            <textarea
              id={`var-${name}`}
              value={variables[name]}
              onChange={(e) => handleVariableChange(name, e.target.value)}
              className="w-full h-24 p-2 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter value for ${name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariableInputs;