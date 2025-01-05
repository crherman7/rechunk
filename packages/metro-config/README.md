# @rechunk/metro-config

Metro bundler configuration utilities for ReChunk integration with React Native.

## Features

- 🔄 Intelligent cache versioning
- ⚡️ Optimized bundling
- 🔍 Environment-aware configuration
- 🚀 Dev server integration
- 📦 React Native optimization

## Installation

```bash
npm install @rechunk/metro-config

# or with yarn
yarn add @rechunk/metro-config

# or with pnpm
pnpm add @rechunk/metro-config
```

## Usage

### Basic Configuration

```javascript
// metro.config.js
const {cacheVersion} = require('@rechunk/metro-config');

module.exports = {
  cacheVersion,
  // ... other Metro configuration
};
```

### Advanced Configuration

```javascript
// metro.config.js
const {cacheVersion} = require('@rechunk/metro-config');

module.exports = {
  cacheVersion,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
```

## Cache Version Generation

The cache version is generated based on:

- `.rechunkrc.json` modification time
- Current `RECHUNK_ENVIRONMENT` value
- ReChunk dev server status

```typescript
const version = cacheVersion; // Returns MD5 hash string
```

## Environment Support

```bash
# Development mode
RECHUNK_ENVIRONMENT=dev

# Production mode
RECHUNK_ENVIRONMENT=prod

# Offline mode
RECHUNK_ENVIRONMENT=offline
```

## Integration with ReChunk

- Automatically invalidates cache when configuration changes
- Supports development server hot reloading
- Optimizes builds for different environments

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT
