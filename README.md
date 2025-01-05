<picture>
  <img alt="ReChunk Banner" src="./.github/assets/hero.png">
</picture>

<br/>
<br/>

<div align="center">
<a href="https://www.npmjs.com/package/@rechunk/core"><img src="https://img.shields.io/npm/v/@rechunk/core.svg?style=flat" alt="npm version"></a>
<a href="https://www.npmjs.com/package/@rechunk/core"><img src="https://img.shields.io/npm/dm/@rechunk/core.svg?style=flat" alt="Downloads"></a>
<a href="https://bundlephobia.com/package/@rechunk/core"><img src="https://img.shields.io/bundlephobia/minzip/@rechunk/core" alt="Bundle Size"></a>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript"></a>
<a href="LICENSE.md"><img src="https://img.shields.io/github/license/crherman7/rechunk.svg" alt="License"></a>
<a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
</div>

<br/>

<div align="center">
  <p><strong>ReChunk is a lightweight React Native library that enables secure over-the-air updates and dynamic component loading, allowing you to update your app's UI without app store submissions.</strong></p>
</div>

<div align="center">
  <a aria-label="rechunk.xyz" href="https://rechunk.xyz">Website</a>
  &nbsp;•&nbsp;
  <a aria-label="ReChunk Documentation" href="https://rechunk.xyz/docs/">Documentation</a>
  &nbsp;•&nbsp;
  <a aria-label="ReChunk Discord Community" href="https://discord.gg/xFhuxjwhss">Discord Community</a>
</div>

<br/>

## Why ReChunk?

- 📱 **Bypass App Store Updates**: Deploy UI changes without waiting for app store approval
- 🔄 **Instant Updates**: Push changes to all users simultaneously
- 🛠 **Developer Friendly**: Simple API with TypeScript support
- 🏃 **Performance First**: Minimal bundle size impact and optimized loading

## Installation

```bash
npm install @rechunk/core
npm install -D @rechunk/cli @rechunk/babel-plugin @rechunk/metro-config

# or

yarn add @rechunk/core
yarn add -D @rechunk/cli @rechunk/babel-plugin @rechunk/metro-config
```

## Quick Example

### 1. Initialize Project

```bash
# Create a new ReChunk project
npx rechunk init -h https://your-rechunk-host.com -u username -p password
```

### 2. Create a ReChunk Component

```tsx
// components/FeatureCard.tsx
'use rechunk';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  onPress?: () => void;
}

export default function FeatureCard({
  title = 'New Feature',
  description = 'Try out our latest update!',
  onPress,
}: FeatureCardProps) {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    setPressed(true);
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={[styles.container, pressed && styles.pressed]}
      onPress={handlePress}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ... styles remain the same
});
```

### 3. Configure Your Project

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

// metro.config.js
const {cacheVersion} = require('@rechunk/metro-config');

module.exports = {
  cacheVersion,
  // ... other Metro configuration
};
```

### 4. Use the Component

```tsx
// App.tsx
import React, {Suspense} from 'react';
import {View, ActivityIndicator} from 'react-native';
import ReChunk from '@rechunk/core';

import FeatureCard from './FeatureCard';

export default function App() {
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <FeatureCard
        title="Welcome!"
        description="This component was loaded dynamically!"
        onPress={() => console.log('Pressed!')}
      />
    </Suspense>
  );
}
```

### 5. Publish Your Component

```bash
# Start development server
npx rechunk dev-server

# Or publish to production
npx rechunk publish
```

## Usage Guide

### Development Workflow

1. **Start Development Server**

```bash
npx rechunk dev-server
```

2. **Mark Components for Remote Loading**
   Add the `"use rechunk"` directive to any component you want to load remotely.

3. **Configure Environment**

```bash
# Development
export RECHUNK_ENVIRONMENT=dev

# Production
export RECHUNK_ENVIRONMENT=prod

# Offline testing
export RECHUNK_ENVIRONMENT=offline
```

### Production Deployment

1. **Publish Components**

```bash
npx rechunk publish
```

2. **Manage Deployments**

```bash
npx rechunk manage
```

## Features

- **🚀 Over-The-Air Updates**: Deploy React Native components instantly without app store submissions. Push UI changes directly to your users in real-time.
- **⚡️ Zero-Config Hosting**: Host your components anywhere - from S3 to your own servers. Zero vendor lock-in, maximum flexibility.
- **🔒 Built-in Security**: Industry-standard digital signatures verify every component. Keep your dynamic updates secure and your users protected.

## Getting Started

Visit our [Quick Start Guide](https://rechunk.xyz/docs/) to begin using ReChunk in your project.

## Community

Join our growing community! We're excited to help and hear your feedback:

- 💬 Join our [Discord](https://discord.gg/xFhuxjwhss) for real-time discussions
- ⭐ Star us on [GitHub](https://github.com/crherman7/rechunk) to show your support

## Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) and help us build ReChunk together. For questions or feedback, feel free to open an issue.

## Code of Conduct

Please review our [Code of Conduct](./CODE_OF_CONDUCT.md) for guidelines on community interaction.

## License

ReChunk is licensed under the [MIT License](./LICENSE.md).
