import { Tool } from "../..";
import { BUILT_IN_GROUP_NAME, BuiltInToolNames } from "../builtIn";

export const simpleCalculatorTool: Tool = {
  type: "function",
  displayTitle: "Simple Calculator",
  wouldLikeTo: "calculate {{{ operation }}} of {{{ a }}} and {{{ b }}}",
  isCurrently: "calculating {{{ operation }}} of {{{ a }}} and {{{ b }}}",
  hasAlready: "calculated {{{ operation }}} of {{{ a }}} and {{{ b }}}",
  readonly: true,
  isInstant: true,
  group: BUILT_IN_GROUP_NAME,
  function: {
    name: BuiltInToolNames.SimpleCalculator,
    description: "Perform basic arithmetic operations (add, subtract, multiply, divide)",
    parameters: {
      type: "object",
      required: ["operation", "a", "b"],
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
      }
    }
  }
}; 