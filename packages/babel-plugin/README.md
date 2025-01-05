# @rechunk/babel-plugin

Babel plugin for transforming and processing ReChunk directives in React Native applications.

## Features

- 🎯 Transforms `use rechunk` directives
- 🔄 Automatic code splitting support
- ⚡️ Dynamic imports generation
- 🛡️ Secure token handling
- 🔍 Path alias resolution
- 📦 React Native optimization

## Installation

```bash
npm install --save-dev @rechunk/babel-plugin

# or with yarn
yarn add -D @rechunk/babel-plugin

# or with pnpm
pnpm add -D @rechunk/babel-plugin
```

## Usage

### Basic Configuration

```javascript
// babel.config.js
module.exports = {
  plugins: ['@rechunk/babel-plugin'],
};
```

### With React Native

```javascript
// babel.config.js
const {withReactNativeBabelPresetOptions} = require('@rechunk/babel-plugin');

module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      api => withReactNativeBabelPresetOptions(api),
    ],
  ],
  plugins: ['@rechunk/babel-plugin'],
};
```

### With Expo

```javascript
// babel.config.js
const {withBabelPresetExpoOptions} = require('@rechunk/babel-plugin');

module.exports = {
  presets: [['babel-preset-expo', api => withBabelPresetExpoOptions(api)]],
  plugins: ['@rechunk/babel-plugin'],
};
```

## Features

### Directive Transform

```tsx
// Input
'use rechunk';
export default function MyComponent() {
  return <View>...</View>;
}

// Output
import React from 'react';
import {importChunk} from '@rechunk/core';

const $$ReChunkModule = React.lazy(() => importChunk('base64-encoded-path'));
export default $$ReChunkModule;
```

### Environment Support

```bash
# Production mode
RECHUNK_ENVIRONMENT=prod

# Development mode
RECHUNK_ENVIRONMENT=dev

# Offline mode
RECHUNK_ENVIRONMENT=offline
```

## Configuration

### .rechunkrc.json

```json
{
  "host": "https://your-rechunk-host.com",
  "project": "your-project-id",
  "readKey": "your-read-key",
  "publicKey": "your-public-key",
  "external": ["optional-external-dependency"]
}
```

## API Reference

### withReactNativeBabelPresetOptions

```typescript
function withReactNativeBabelPresetOptions(
  api: ConfigAPI,
  options: Record<string, unknown> = {},
): Record<string, unknown>;
```

### withBabelPresetExpoOptions

```typescript
function withBabelPresetExpoOptions(
  api: ConfigAPI,
  options: BabelPresetExpoOptions = {},
): BabelPresetExpoOptions;
```

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT
