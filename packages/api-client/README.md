# @rechunk/api-client

TypeScript API client for ReChunk services with OpenAPI-generated interfaces.

## Features

- 🔄 Auto-generated TypeScript interfaces from OpenAPI spec
- 🔒 Built-in authentication handling
- 📦 Comprehensive API coverage
- 🌐 Fetch-based HTTP client
- 📝 Full TypeScript support

## Installation

```bash
npm install @rechunk/api-client

# or with yarn
yarn add @rechunk/api-client

# or with pnpm
pnpm add @rechunk/api-client
```

## Usage

```typescript
import {ChunksApi, Configuration} from '@rechunk/api-client';

// Configure the API client
const config = new Configuration({
  basePath: 'https://api.example.com',
  headers: {
    Authorization: `Basic ${btoa('project:key')}`,
  },
});

// Create API instance
const api = new ChunksApi(config);

// Use the API
async function getChunk(projectId: string, chunkId: string) {
  return await api.getChunkById({projectId, chunkId});
}
```

## API Reference

### Authentication

```typescript
import {AuthenticationApi} from '@rechunk/api-client';

const authApi = new AuthenticationApi(config);
const token = await authApi.createToken();
```

### Projects

```typescript
import {ProjectsApi} from '@rechunk/api-client';

const projectsApi = new ProjectsApi(config);
const project = await projectsApi.createProject();
```

### Chunks

```typescript
import {ChunksApi} from '@rechunk/api-client';

const chunksApi = new ChunksApi(config);

// Get chunk
const chunk = await chunksApi.getChunkById({
  projectId: 'project-id',
  chunkId: 'chunk-id',
});

// Create chunk
const newChunk = await chunksApi.createChunkForProject({
  projectId: 'project-id',
  chunkId: 'chunk-id',
  chunkCreate: {data: 'chunk-content'},
});
```

## Models

- `Chunk` - Represents a code chunk with data and signature
- `Project` - Project configuration and credentials
- `Token` - Authentication token information
- `ChunkCreate` - Parameters for creating new chunks

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT
