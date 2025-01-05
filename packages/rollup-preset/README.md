# @rechunk/rollup-preset

Rollup configuration preset for bundling ReChunk components and modules.

## Features

- 🎯 Optimized for ReChunk components
- 🔧 Babel integration
- 📦 Asset handling
- 🔄 Tree shaking
- ⚡️ Performance optimization
- 🛡️ TypeScript support

## Installation

```bash
npm install @rechunk/rollup-preset

# or with yarn
yarn add @rechunk/rollup-preset

# or with pnpm
pnpm add @rechunk/rollup-preset
```

## Usage

### Basic Configuration

```javascript
// rollup.config.js
import withRechunk from '@rechunk/rollup-preset';

export default withRechunk({
  input: 'src/component.tsx',
});
```

### Advanced Configuration

```javascript
// rollup.config.js
import withRechunk from '@rechunk/rollup-preset';

export default withRechunk({
  input: 'src/component.tsx',
  external: ['react', 'react-native'],
  output: {
    format: 'cjs',
    sourcemap: true,
  },
});
```

## Features

### Babel Integration

Automatically configures Babel with:

- TypeScript support
- React/JSX transformation
- Module resolution
- Plugin optimization

```javascript
export const BABEL_ROLLUP_OVERRIDES = {
  overrides: [
    {
      plugins: [['module-resolver', false]],
    },
  ],
};
```

### Asset Handling

Built-in support for:

- Images
- SVGs
- Other static assets

### External Dependencies

Automatically handles:

- Package dependencies
- Peer dependencies
- Custom externals from `.rechunkrc.json`

## API Reference

### withRechunk

```typescript
function withRechunk(options: RollupOptions = {}): Promise<RollupOptions>;
```

### Configuration Options

```typescript
interface RollupOptions {
  input: string;
  external?: string[];
  plugins?: Plugin[];
  // ... other Rollup options
}
```

## Integration with ReChunk

- Optimized for ReChunk component bundling
- Supports development server
- Handles chunk signing and verification

## Best Practices

1. Always specify `input` as a string path
2. Use `.rechunkrc.json` for external dependencies
3. Let the preset handle Babel configuration
4. Utilize tree shaking for optimal bundles

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT
