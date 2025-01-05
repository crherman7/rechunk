# @rechunk/utils

Utility functions and helpers for ReChunk packages and implementations.

## Features

- 🔍 File system utilities
- 🔄 Process management
- 🛠️ Path resolution
- 🚀 Development server detection
- 📦 Workspace utilities
- ⚡️ Performance optimizations

## Installation

```bash
npm install @rechunk/utils

# or with yarn
yarn add @rechunk/utils

# or with pnpm
pnpm add @rechunk/utils
```

## API Reference

### File System Utilities

#### getRealPath

Resolves the real native path for a given file path, handling case sensitivity issues.

```typescript
import {getRealPath} from '@rechunk/utils';

const realPath = getRealPath('/path/to/file');
```

#### findClosestJSON

Recursively searches for the closest JSON file from a starting directory.

```typescript
import {findClosestJSON} from '@rechunk/utils';

const config = findClosestJSON('.rechunkrc.json');
const pkg = findClosestJSON('package.json');
```

### Workspace Utilities

#### findWorkspaceDir

Locates the workspace directory by finding package manager files.

```typescript
import {findWorkspaceDir} from '@rechunk/utils';

const workspaceDir = findWorkspaceDir(process.cwd());
```

### Process Management

#### ProcessInfo Interface

```typescript
interface ProcessInfo {
  pid: number; // Process ID
  ppid: number; // Parent Process ID
  uid: number; // User ID
  cpu: number; // CPU usage percentage
  memory: number; // Memory usage percentage
  name: string; // Process name
  cmd: string; // Full command line
}
```

#### nonWindowsCall

Retrieves information about running processes on non-Windows systems.

```typescript
import {nonWindowsCall} from '@rechunk/utils';

const processes = nonWindowsCall({all: true});
```

### Development Server

#### isRechunkDevServerRunning

Checks if the ReChunk development server is currently running.

```typescript
import {isRechunkDevServerRunning} from '@rechunk/utils';

if (isRechunkDevServerRunning()) {
  console.log('Dev server is running');
}
```

## Use Cases

### Configuration File Management

```typescript
import {findClosestJSON, getRealPath} from '@rechunk/utils';

// Find and load configuration
const configPath = getRealPath('./config');
const config = findClosestJSON('.rechunkrc.json', configPath);
```

### Workspace Detection

```typescript
import {findWorkspaceDir} from '@rechunk/utils';

// Set up workspace environment
const workspaceDir = findWorkspaceDir(process.cwd());
process.env.WORKSPACE_DIR = workspaceDir;
```

### Process Monitoring

```typescript
import {nonWindowsCall, ProcessInfo} from '@rechunk/utils';

// Monitor specific processes
const processes: ProcessInfo[] = nonWindowsCall();
const nodeProcesses = processes.filter(p => p.name.includes('node'));
```

### Development Environment

```typescript
import {isRechunkDevServerRunning} from '@rechunk/utils';

// Configure based on dev server status
const isDev = isRechunkDevServerRunning();
const config = {
  mode: isDev ? 'development' : 'production',
  // ... other config
};
```

## Best Practices

1. **Path Resolution**

   ```typescript
   // Recommended
   const path = getRealPath(filePath);

   // Avoid
   const path = filePath; // Might have case sensitivity issues
   ```

2. **Configuration Loading**

   ```typescript
   // Recommended
   const config = findClosestJSON('.rechunkrc.json');

   // Avoid
   const config = require('.rechunkrc.json'); // Might fail if not in exact location
   ```

3. **Process Management**

   ```typescript
   // Recommended
   const processes = nonWindowsCall({all: true});

   // Avoid
   const {execSync} = require('child_process');
   const output = execSync('ps aux'); // Less reliable and platform-dependent
   ```

## Error Handling

The utilities include built-in error handling and fallbacks:

```typescript
// File not found fallback
const config = findClosestJSON('missing.json'); // Returns {}

// Path resolution fallback
const path = getRealPath('invalid/path'); // Returns original path

// Process information error handling
try {
  const processes = nonWindowsCall();
} catch (error) {
  console.error('Failed to get process information:', error);
}
```

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT
