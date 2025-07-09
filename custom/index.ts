/**
 * Main index file for custom functionality
 * 
 * This file exports all custom implementations including:
 * - Context Providers
 * - Tools
 * - Utilities
 * - Examples
 */

// Import statements
import RandomProvider from "./context-providers/RandomProvider";
import { analyzeText, formatUserProfile } from "./examples/usage-examples";
import { SimpleCalculatorTool, executeSimpleCalculator } from "./tools/SimpleCalculator";
import StringUtils, {
    StringValidation, capitalize, countWords,
    generateRandomString, getInitials, isPalindrome,
    toCamelCase, toKebabCase, toSnakeCase, truncate
} from "./utils/StringUtils";

// Export Context Providers
export { RandomProvider };

// Export Tools
    export {
        SimpleCalculatorTool,
        executeSimpleCalculator
    };

// Export Utilities
    export {
        StringUtils, StringValidation, capitalize, countWords,
        generateRandomString, getInitials, isPalindrome,
        toCamelCase, toKebabCase, toSnakeCase, truncate
    };

// Export Examples
    export {
        analyzeText, formatUserProfile
    };

// Main custom functionality registry
export const CustomRegistry = {
  contextProviders: {
    random: RandomProvider,
  },
  tools: {
    calculator: SimpleCalculatorTool,
  },
  utilities: {
    string: StringUtils,
  },
  examples: {
    formatUserProfile,
    analyzeText,
  }
};

// Version information
export const CUSTOM_VERSION = "1.0.0";

export default CustomRegistry; 