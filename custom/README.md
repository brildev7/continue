# Custom Extensions for Continue

This directory contains custom implementations and extensions for the Continue AI assistant. All functionality is developed independently within the `custom/` directory without modifying the core Continue codebase.

## 🚀 Quick Start

The custom providers and tools are now **fully integrated** into Continue. You can use them directly in your configuration:

```json
{
  "contextProviders": [
    {
      "name": "random",
      "params": {}
    },
    {
      "name": "simple-info",
      "params": {}
    },
    {
      "name": "time",
      "params": {}
    }
  ]
}
```

## 📁 Directory Structure

```
custom/
├── README.md                 # This file
├── package.json             # Package configuration
├── tsconfig.json            # TypeScript configuration
├── index.ts                 # Main export file
├── context-providers/       # Custom context providers
│   ├── RandomProvider.ts    # Random information provider
│   ├── SimpleInfoProvider.ts # System information provider
│   └── TimeContextProvider.ts # Time information provider
├── tools/                   # Custom tools
│   └── SimpleCalculator.ts  # Basic calculator tool
├── utils/                   # Utility functions
│   └── StringUtils.ts       # String manipulation utilities
└── examples/                # Usage examples
    └── usage-examples.ts    # Comprehensive examples
```

## 🔧 Features

### Context Providers

#### RandomProvider (`@random`)
Provides random information including numbers, quotes, and facts.

```json
{
  "contextProviders": [
    {
      "name": "random",
      "params": {}
    }
  ]
}
```

**Features:**
- Random numbers (integer, float, percentage)
- Inspirational quotes
- Fun facts
- Generated timestamps

#### SimpleInfoProvider (`@simple-info`)
Provides basic system and environment information.

```json
{
  "contextProviders": [
    {
      "name": "simple-info",
      "params": {}
    }
  ]
}
```

**Features:**
- Platform information
- Node.js version
- Memory usage
- Working directory

#### TimeContextProvider (`@time`)
Provides current time and timezone information.

```json
{
  "contextProviders": [
    {
      "name": "time",
      "params": {}
    }
  ]
}
```

**Features:**
- Local time
- UTC time
- ISO 8601 format
- Unix timestamp
- Timezone information

### Tools

#### SimpleCalculator Tool
A basic calculator for arithmetic operations, now available as a built-in tool.

The calculator tool is automatically available in Continue and can be used by the AI assistant for performing basic arithmetic operations:

- Addition
- Subtraction  
- Multiplication
- Division (with zero-division protection)

### Utilities

#### StringUtils
Comprehensive string manipulation utilities available for other custom components.

```typescript
import { StringUtils } from './custom';

// Case conversion
StringUtils.capitalize("hello");          // "Hello"
StringUtils.toCamelCase("hello world");   // "helloWorld"
StringUtils.toSnakeCase("HelloWorld");    // "hello_world"
StringUtils.toKebabCase("HelloWorld");    // "hello-world"

// Text manipulation
StringUtils.truncate("Long text...", 10);     // "Long te..."
StringUtils.countWords("Hello world");        // 2
StringUtils.generateRandomString(8);          // "aB3xY7mQ"

// Validation
StringUtils.isPalindrome("racecar");          // true
StringUtils.getInitials("John Doe");          // "JD"
```

## 🛠️ Integration Status

✅ **Context Providers**: Fully integrated and available via `@random`, `@simple-info`, `@time`
✅ **Tools**: SimpleCalculator available as built-in tool
✅ **Build System**: Included in TypeScript compilation
✅ **Type Safety**: Full TypeScript support with proper interfaces

## 📋 Usage Examples

### Using Context Providers in Chat

```
@random Give me some random information
@simple-info What's my system information?
@time What's the current time?
```

### Using Tools
The calculator tool is automatically available to the AI assistant. Simply ask for calculations:

```
Calculate 25 * 4 + 10
What's 100 divided by 3?
```

## 🔌 Configuration

### Complete Configuration Example

```json
{
  "models": [
    {
      "title": "GPT-4",
      "provider": "openai",
      "model": "gpt-4",
      "apiKey": "your-api-key"
    }
  ],
  "contextProviders": [
    {
      "name": "random",
      "params": {}
    },
    {
      "name": "simple-info", 
      "params": {}
    },
    {
      "name": "time",
      "params": {}
    },
    {
      "name": "codebase",
      "params": {}
    }
  ]
}
```

## 🚧 Development

### Building

The custom folder is now integrated into the main build system:

```bash
# Watch mode (includes custom folder)
npm run tsc:watch

# Individual custom folder watch
npm run tsc:watch:custom
```

### Testing

```bash
cd custom/
node test.js
```

## 🎯 Use Cases

### Development Workflows
- **Random Data**: Generate test data, placeholders, examples with `@random`
- **System Info**: Check environment details with `@simple-info`
- **Time Context**: Get current time information with `@time`
- **Quick Calculations**: Perform arithmetic during development

### AI Assistant Enhancement
- **Context Enrichment**: Provide additional context with random facts
- **Tool Integration**: Extend Continue's capabilities with custom tools
- **System Awareness**: Give AI access to system information

## 📝 Architecture

The custom functionality is integrated into Continue's core architecture:

```
Continue Core
├── Context Providers
│   ├── Built-in (diff, tree, etc.)
│   └── Custom (random, simple-info, time)
├── Tools
│   ├── Built-in (read_file, etc.)
│   └── Custom (simple_calculator)
└── Build System
    └── TypeScript compilation
```

## 🤝 Contributing

When adding new features to the custom module:

1. Create providers in `context-providers/` extending `BaseContextProvider`
2. Create tools in `tools/` following the `Tool` interface
3. Update registration in `core/context/providers/index.ts` for context providers
4. Update registration in `core/tools/` for tools
5. Add to build system if needed
6. Update this README with usage examples

## 📜 License

MIT License - Feel free to modify and extend as needed. 