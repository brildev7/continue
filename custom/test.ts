/**
 * Simple test file to verify custom functionality
 */

import { executeSimpleCalculator } from './tools/SimpleCalculator';
import StringUtils from './utils/StringUtils';

console.log('=== Testing Simple Calculator ===');
console.log('Add:', executeSimpleCalculator('add', 10, 5));
console.log('Subtract:', executeSimpleCalculator('subtract', 10, 5));
console.log('Multiply:', executeSimpleCalculator('multiply', 10, 5));
console.log('Divide:', executeSimpleCalculator('divide', 10, 5));
console.log('Divide by zero:', executeSimpleCalculator('divide', 10, 0));

console.log('\n=== Testing String Utils ===');
console.log('Capitalize:', StringUtils.capitalize('hello world'));
console.log('CamelCase:', StringUtils.toCamelCase('hello world'));
console.log('Snake_case:', StringUtils.toSnakeCase('HelloWorld'));
console.log('Kebab-case:', StringUtils.toKebabCase('HelloWorld'));
console.log('Truncate:', StringUtils.truncate('This is a long text', 10));
console.log('Word count:', StringUtils.countWords('Hello world from TypeScript'));
console.log('Random string:', StringUtils.generateRandomString(8));
console.log('Is palindrome racecar:', StringUtils.isPalindrome('racecar'));
console.log('Is palindrome hello:', StringUtils.isPalindrome('hello'));
console.log('Initials:', StringUtils.getInitials('John Doe Smith'));

console.log('\n=== Testing String Validation ===');
console.log('Email validation test@example.com:', StringUtils.StringValidation.isEmail('test@example.com'));
console.log('Email validation invalid:', StringUtils.StringValidation.isEmail('invalid-email'));
console.log('URL validation https://example.com:', StringUtils.StringValidation.isURL('https://example.com'));
console.log('URL validation invalid:', StringUtils.StringValidation.isURL('not-a-url'));
console.log('Has only numbers 12345:', StringUtils.StringValidation.hasOnlyNumbers('12345'));
console.log('Has only numbers abc123:', StringUtils.StringValidation.hasOnlyNumbers('abc123'));
console.log('Has only letters hello:', StringUtils.StringValidation.hasOnlyLetters('hello'));
console.log('Has only letters hello123:', StringUtils.StringValidation.hasOnlyLetters('hello123'));

console.log('\n=== All tests completed successfully! ==='); 