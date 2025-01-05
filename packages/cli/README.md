# @rechunk/cli

Command-line interface for managing ReChunk projects, chunks, and deployments.

## Features

- 🚀 Project initialization
- 📦 Chunk management
- 🔄 Development server
- 🔐 Secure publishing
- 📱 React Native integration
- 🛠️ Configuration tools

## Installation

```bash
npm install -g @rechunk/cli

# or with yarn
yarn global add @rechunk/cli

# or with pnpm
pnpm add -g @rechunk/cli
```

## Commands

### Initialize Project

```bash
rechunk init -h https://rechunk.example.com -u username -p password
```

### Start Development Server

```bash
rechunk dev-server
```

### Publish Chunks

```bash
rechunk publish
```

### Manage Chunks

```bash
rechunk manage
```

## Configuration

### .rechunkrc.json

```json
{
  "host": "https://rechunk.example.com",
  "project": "project-id",
  "readKey": "read-key",
  "writeKey": "write-key",
  "publicKey": "public-key",
  "privateKey": "private-key",
  "external": ["external-dependency"]
}
```

## Environment Variables

```bash
# Development server
RECHUNK_ENVIRONMENT=dev

# Production mode
RECHUNK_ENVIRONMENT=prod

# Offline mode
RECHUNK_ENVIRONMENT=offline
```

## Development Server

The development server runs on port 49904 by default and provides:

- Hot reloading
- Chunk signing
- Development-time optimizations

## Publishing

Interactive chunk publishing process:

1. Scans for `use rechunk` directives
2. Prompts for chunk selection
3. Bundles selected chunks
4. Signs and uploads to server

## Management Interface

Opens a browser interface for:

- Viewing published chunks
- Managing versions
- Monitoring usage
- Configuration updates

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT
