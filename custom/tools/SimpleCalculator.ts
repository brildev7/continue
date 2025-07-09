import { Tool } from "../../core/index";

/**
 * Simple calculator tool for basic arithmetic operations
 */
export const SimpleCalculatorTool: Tool = {
  type: "function",
  function: {
    name: "simple_calculator",
    description: "Perform basic arithmetic operations (add, subtract, multiply, divide)",
    parameters: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"],
          description: "The arithmetic operation to perform"
        },
        a: {
          type: "number",
          description: "First number"
        },
        b: {
          type: "number",
          description: "Second number"
        }
      },
      required: ["operation", "a", "b"]
    }
  },
  displayTitle: "Simple Calculator",
  wouldLikeTo: "perform basic arithmetic calculations",
  isCurrently: "calculating mathematical operations",
  hasAlready: "performed calculation",
  readonly: true,
  isInstant: true,
  group: "custom"
};

/**
 * Execute the calculator tool
 */
export function executeSimpleCalculator(
  operation: string,
  a: number,
  b: number
): string {
  let result: number;
  let operationSymbol: string;
  
  switch (operation) {
    case "add":
      result = a + b;
      operationSymbol = "+";
      break;
    case "subtract":
      result = a - b;
      operationSymbol = "-";
      break;
    case "multiply":
      result = a * b;
      operationSymbol = "×";
      break;
    case "divide":
      if (b === 0) {
        return "Error: Division by zero is not allowed";
      }
      result = a / b;
      operationSymbol = "÷";
      break;
    default:
      return "Error: Invalid operation";
  }
  
  return `${a} ${operationSymbol} ${b} = ${result}`;
}

export default SimpleCalculatorTool; 