import { ToolImpl } from ".";

export const simpleCalculatorImpl: ToolImpl = async (args, extras) => {
  const { operation, a, b } = args;
  
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
        return [
          {
            name: "Calculator Error",
            description: "Division by zero",
            content: "Error: Division by zero is not allowed",
          },
        ];
      }
      result = a / b;
      operationSymbol = "÷";
      break;
    default:
      return [
        {
          name: "Calculator Error",
          description: "Invalid operation",
          content: `Error: Invalid operation "${operation}". Valid operations are: add, subtract, multiply, divide`,
        },
      ];
  }
  
  const calculation = `${a} ${operationSymbol} ${b} = ${result}`;
  
  return [
    {
      name: "Calculator Result",
      description: "Arithmetic calculation result",
      content: calculation,
    },
  ];
}; 