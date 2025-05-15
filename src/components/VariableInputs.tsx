import React, { useState } from 'react';
import { Palette } from 'lucide-react';

interface VariableInputsProps {
  variables: Record<string, string>;
  setVariables: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  variableColors: Record<string, string>;
  onColorChange: (name: string, color: string) => void;
}

const COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#71717a' }
];

const VariableInputs: React.FC<VariableInputsProps> = ({ 
  variables, 
  setVariables, 
  variableColors,
  onColorChange 
}) => {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorPickerClick = (name: string) => {
    setActiveColorPicker(activeColorPicker === name ? null : name);
  };

  const handleColorSelect = (name: string, color: string) => {
    onColorChange(name, color);
    setActiveColorPicker(null);
  };

  // Close color picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeColorPicker && !(event.target as Element).closest('.color-picker-container')) {
        setActiveColorPicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeColorPicker]);

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
            <div className="flex items-center justify-between">
              <label 
                htmlFor={`var-${name}`} 
                className="block text-sm font-medium"
                style={{ color: variableColors[name] || 'inherit' }}
              >
                {name}
              </label>
              <div className="relative color-picker-container">
                <button
                  type="button"
                  onClick={() => handleColorPickerClick(name)}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  aria-label="Choose color"
                >
                  <Palette 
                    className="w-4 h-4" 
                    style={{ color: variableColors[name] || 'rgb(107 114 128)' }}
                  />
                </button>
                {activeColorPicker === name && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-20">
                    <div className="grid grid-cols-4 gap-1.5">
                      {COLORS.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handleColorSelect(name, color.value)}
                          className="w-6 h-6 rounded-full hover:scale-110 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <textarea
              id={`var-${name}`}
              value={variables[name]}
              onChange={(e) => handleVariableChange(name, e.target.value)}
              className="w-full h-24 p-2 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150"
              placeholder={`Enter value for ${name}`}
              style={{ color: variableColors[name] || 'inherit' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariableInputs;