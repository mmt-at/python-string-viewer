/**
 * Utility functions for processing and parsing strings
 */

/**
 * Parse a regular string, processing escape sequences based on the selected language
 */
export function parseString(input: string, language: string): string {
  if (!input) return '';
  
  try {
    // Trim whitespace from input
    let cleanInput = input.trim();
    
    // Handle triple quoted strings
    if ((cleanInput.startsWith('"""') && cleanInput.endsWith('"""')) || 
        (cleanInput.startsWith("'''") && cleanInput.endsWith("'''"))) {
      cleanInput = cleanInput.slice(3, -3);
    }
    // Remove quotes if present
    else if ((cleanInput.startsWith('"') && cleanInput.endsWith('"')) || 
        (cleanInput.startsWith("'") && cleanInput.endsWith("'"))) {
      cleanInput = cleanInput.slice(1, -1);
    }
    
    // Handle f-string prefix
    if (cleanInput.startsWith('f')) {
      cleanInput = cleanInput.slice(1);
    }
    
    // For Python and JavaScript, we can use JSON.parse with some adjustments
    if (language === 'python' || language === 'javascript') {
      // Replace Python raw strings
      if (language === 'python' && (input.startsWith('r"') || input.startsWith("r'"))) {
        return cleanInput;
      }
      
      // Make the string JSON compatible
      let jsonString = cleanInput
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\f/g, '\f')
        .replace(/\\b/g, '\b')
        .replace(/\\v/g, '\v')
        .replace(/\\\\/g, '\\')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"');
        
      return jsonString;
    }
    
    // For plaintext, just return as is
    return cleanInput;
  } catch (error) {
    console.error('Error parsing string:', error);
    return input; // Return the original input if there's an error
  }
}

/**
 * Extract variable names from an f-string
 */
export function extractVariables(fstring: string): string[] {
  const variablePattern = /\{([a-zA-Z0-9_]+)(?:\.[a-zA-Z0-9_]+)*(?:\[[^\]]*\])*(?::(?:[^{}]|\{[^{}]*\})*)?}/g;
  const matches = fstring.match(variablePattern) || [];
  
  // Extract just the variable names from matches like {variable_name}
  return matches
    .map(match => {
      // Extract the content between the braces
      const content = match.slice(1, -1);
      
      // Get the variable name (stops at any formatting like : or . or [)
      const varName = content.split(/[:.[\s]/)[0];
      return varName;
    })
    .filter((value, index, self) => value && self.indexOf(value) === index); // Remove duplicates
}

/**
 * Process an f-string with variable values
 */
export function processStringWithVariables(
  fstring: string, 
  variables: Record<string, string>
): string {
  try {
    // Handle different quote styles for f-strings
    let content = fstring.trim();
    
    // Extract the string content from f-string
    if (content.startsWith('f"""') && content.endsWith('"""')) {
      content = content.slice(4, -3);
    } else if (content.startsWith("f'''") && content.endsWith("'''")) {
      content = content.slice(4, -3);
    } else if (content.startsWith('f"') && content.endsWith('"')) {
      content = content.slice(2, -1);
    } else if (content.startsWith("f'") && content.endsWith("'")) {
      content = content.slice(2, -1);
    }
    
    // Replace variables in the string
    const result = content.replace(
      /\{([a-zA-Z0-9_]+)(?:\.[a-zA-Z0-9_]+)*(?:\[[^\]]*\])*(?::(?:[^{}]|\{[^{}]*\})*)?}/g,
      (match, varName) => {
        // Extract just the variable name without any formatting
        const bareVarName = varName.split(/[:.[\s]/)[0];
        
        if (bareVarName in variables) {
          let processedValue = variables[bareVarName].trim();
          // 去掉头尾空格，去掉头尾的''或者""
          if ((processedValue.startsWith('"""') && processedValue.endsWith('"""')) || 
              (processedValue.startsWith("'''") && processedValue.endsWith("'''"))) {
            processedValue = processedValue.slice(3, -3);
          } else if ((processedValue.startsWith('"') && processedValue.endsWith('"')) || 
                     (processedValue.startsWith("'") && processedValue.endsWith("'"))) {
            processedValue = processedValue.slice(1, -1);
          }
          return processedValue;
        }
        return `{${varName}}`;
      }
    );
    
    // Process escape sequences
    return parseString(result, 'python');
  } catch (error) {
    console.error('Error processing f-string:', error);
    throw new Error('Invalid f-string format');
  }
}