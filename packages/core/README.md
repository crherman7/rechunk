# @rechunk/core

Core functionality for ReChunk dynamic code loading and chunk management in React Native.

## Features

- 🚀 Dynamic code loading
- 🔒 Secure chunk verification
- 💾 Smart caching
- 🔄 Event emitter support
- 📦 Type-safe imports
- ⚡️ Optimized performance

## Installation

```bash
npm install @rechunk/core

# or with yarn
yarn add @rechunk/core

# or with pnpm
pnpm add @rechunk/core
```

## Usage

### Basic Import

```typescript
import ReChunk, {importChunk} from '@rechunk/core';

// Dynamic import
const MyComponent = React.lazy(() => importChunk('component-id'));
```

### Configuration

```typescript
import ReChunk from '@rechunk/core';

ReChunk.addConfiguration({
  verify: true,
  publicKey: 'YOUR_PUBLIC_KEY',
  resolver: async chunkId => {
    // Custom chunk resolution
    return {data: '...', token: '...'};
  },
});
```

### Event Handling

```typescript
import {on} from '@rechunk/core';

on('chunkId', () => {
  console.log('Chunk loaded!');
});
```

## API Reference

### importChunk

```typescript
async function importChunk<T extends string>(
  chunkId: ValidateReChunkEntry<T>,
): Promise<{default: React.ComponentType<any>}>;
```

### addConfiguration

```typescript
interface Configuration {
  verify?: boolean;
  publicKey?: string;
  resolver?: ResolverFunction;
  global?: CustomRequire;
}

function addConfiguration(config: Configuration): void;
```

### on

```typescript
function on(event: string, callback: Function, ctx?: any): TinyEmitter;
```

## Security

- JWS verification
- Runtime integrity checks
- Secure module loading
- Configurable verification

## Type Safety

```typescript
// Valid import
const Component = await importChunk('valid-chunk');

// Type error
const Invalid = await importChunk('invalid-chunk');
//                                ^^^^^^^^^^^^^^^ Error: Not a valid chunk
```

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT
