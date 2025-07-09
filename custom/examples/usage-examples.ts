/**
 * Usage examples for custom functions
 */

import { executeSimpleCalculator } from "../tools/SimpleCalculator";
import StringUtils from "../utils/StringUtils";

// Example 1: Using the Simple Calculator
console.log("=== Calculator Examples ===");
console.log(executeSimpleCalculator("add", 10, 5));      // 10 + 5 = 15
console.log(executeSimpleCalculator("subtract", 10, 5)); // 10 - 5 = 5
console.log(executeSimpleCalculator("multiply", 10, 5)); // 10 × 5 = 50
console.log(executeSimpleCalculator("divide", 10, 5));   // 10 ÷ 5 = 2
console.log(executeSimpleCalculator("divide", 10, 0));   // Error: Division by zero is not allowed

// Example 2: Using String Utilities
console.log("\n=== String Utilities Examples ===");

const sampleText = "hello world programming";
console.log("Original:", sampleText);
console.log("Capitalize:", StringUtils.capitalize(sampleText));
console.log("CamelCase:", StringUtils.toCamelCase(sampleText));
console.log("Snake_case:", StringUtils.toSnakeCase(sampleText));
console.log("Kebab-case:", StringUtils.toKebabCase(sampleText));
console.log("Truncated:", StringUtils.truncate(sampleText, 10));
console.log("Word count:", StringUtils.countWords(sampleText));

// Example 3: String validation
console.log("\n=== String Validation Examples ===");
console.log("Is email 'test@example.com':", StringUtils.StringValidation.isEmail("test@example.com"));
console.log("Is email 'invalid-email':", StringUtils.StringValidation.isEmail("invalid-email"));
console.log("Is URL 'https://example.com':", StringUtils.StringValidation.isURL("https://example.com"));
console.log("Has only numbers '12345':", StringUtils.StringValidation.hasOnlyNumbers("12345"));
console.log("Has only letters 'hello':", StringUtils.StringValidation.hasOnlyLetters("hello"));

// Example 4: Fun utilities
console.log("\n=== Fun Utilities Examples ===");
console.log("Random string (8 chars):", StringUtils.generateRandomString(8));
console.log("Is 'racecar' a palindrome?", StringUtils.isPalindrome("racecar"));
console.log("Is 'hello' a palindrome?", StringUtils.isPalindrome("hello"));
console.log("Initials of 'John Doe':", StringUtils.getInitials("John Doe"));
console.log("Initials of 'Jane Smith Johnson':", StringUtils.getInitials("Jane Smith Johnson"));

// Example 5: Demonstrating practical use cases
console.log("\n=== Practical Examples ===");

// Creating a user profile formatter
function formatUserProfile(firstName: string, lastName: string, email: string): string {
  const initials = StringUtils.getInitials(`${firstName} ${lastName}`);
  const displayName = `${StringUtils.capitalize(firstName)} ${StringUtils.capitalize(lastName)}`;
  const isValidEmail = StringUtils.StringValidation.isEmail(email);
  
  return `
User Profile:
- Name: ${displayName}
- Initials: ${initials}
- Email: ${email} ${isValidEmail ? '✓' : '✗'}
- Profile ID: ${StringUtils.generateRandomString(6)}
  `.trim();
}

console.log(formatUserProfile("john", "doe", "john.doe@example.com"));

// Creating a text analysis function
function analyzeText(text: string): string {
  const wordCount = StringUtils.countWords(text);
  const charCount = text.length;
  const preview = StringUtils.truncate(text, 50);
  
  return `
Text Analysis:
- Word count: ${wordCount}
- Character count: ${charCount}
- Preview: ${preview}
- Is palindrome: ${StringUtils.isPalindrome(text)}
  `.trim();
}

console.log(analyzeText("This is a sample text for analysis purposes"));

export {
  analyzeText, executeSimpleCalculator, formatUserProfile, StringUtils
};

