# ReChunk API Documentation

## Overview

This API provides endpoints for managing projects and chunks, with Basic Authentication required for all endpoints.

## Authentication

The API uses Basic Authentication for security. Each endpoint requires credentials to be sent in the `Authorization` header in the format `Authorization: Basic <base64-encoded-credentials>`.

### Credentials

- **Create Project**: Requires **admin** credentials:

  - **Username**: `admin`
  - **Password**: `password123`

- **Other Endpoints**: Requires **project-specific** credentials:
  - **Username**: `projectId` (the unique ID of the project)
  - **Password**: Either the `writeKey` or `readKey` depending on the access level needed.

To encode credentials, use:

```javascript
const authHeader = 'Basic ' + btoa(`${username}:${password}`);
```

Replace `username` and `password` with the relevant `projectId` and key.

## Base URL

Replace `{yourdomain.com}` with the actual domain where your Remix app is hosted:

```
https://{yourdomain.com}/api/v1
```

---

## Endpoints

### 1. Create Project

- **Endpoint**: `/projects`
- **Method**: `POST`
- **Description**: Creates a new project with optional unique ID, defaulting to a generated cuid if not specified.
- **Authentication**: Requires `admin:password123`

**Example using `fetch`**:

```javascript
fetch('https://{yourdomain.com}/api/v1/projects', {
  method: 'POST',
  headers: {
    Authorization: 'Basic ' + btoa('admin:password123'),
  },
})
  .then(response => response.json())
  .then(data => console.log('Project created:', data))
  .catch(error => console.error('Error:', error));
```

---

### 2. Get Project by ID

- **Endpoint**: `/projects/{id}`
- **Method**: `GET`
- **Description**: Retrieves a project by its unique ID.
- **Authentication**: Requires `projectId` as username and `readKey` as password

**Example using `fetch`**:

```javascript
fetch(`https://{yourdomain.com}/api/v1/projects/{projectId}`, {
  headers: {
    Authorization: 'Basic ' + btoa('{projectId}:{readKey}'),
  },
})
  .then(response => response.json())
  .then(data => console.log('Project details:', data))
  .catch(error => console.error('Error:', error));
```

---

### 3. Delete Project by ID

- **Endpoint**: `/projects/{id}`
- **Method**: `DELETE`
- **Description**: Deletes a project based on its ID.
- **Authentication**: Requires `projectId` as username and `writeKey` as password

**Example using `fetch`**:

```javascript
fetch(`https://{yourdomain.com}/api/v1/projects/{projectId}`, {
  method: 'DELETE',
  headers: {
    Authorization: 'Basic ' + btoa('{projectId}:{writeKey}'),
  },
})
  .then(response => {
    if (response.ok) {
      console.log('Project deleted');
    } else {
      console.error('Error deleting project');
    }
  })
  .catch(error => console.error('Error:', error));
```

---

### 4. Create or Update Chunk

- **Endpoint**: `/projects/{projectId}/chunks`
- **Method**: `PUT`
- **Description**: Creates or updates a chunk associated with a project by its `projectId`.
- **Authentication**: Requires `projectId` as username and `writeKey` as password

**Example using `fetch`**:

```javascript
fetch(`https://{yourdomain.com}/api/v1/projects/{projectId}/chunks`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + btoa('{projectId}:{writeKey}'),
  },
  body: JSON.stringify({
    id: 'optionalChunkId',
    name: 'exampleChunkName',
    data: 'exampleChunkData',
  }),
})
  .then(response => response.json())
  .then(data => console.log('Chunk created or updated:', data))
  .catch(error => console.error('Error:', error));
```

---

### 5. Get Chunks by Project ID

- **Endpoint**: `/projects/{projectId}/chunks`
- **Method**: `GET`
- **Description**: Retrieves all chunks associated with a project by its `projectId`.
- **Authentication**: Requires `projectId` as username and `readKey` as password

**Example using `fetch`**:

```javascript
fetch(`https://{yourdomain.com}/api/v1/projects/{projectId}/chunks`, {
  headers: {
    Authorization: 'Basic ' + btoa('{projectId}:{readKey}'),
  },
})
  .then(response => response.json())
  .then(data => console.log('Chunks:', data))
  .catch(error => console.error('Error:', error));
```

---

### 6. Get Chunk by ID

- **Endpoint**: `/projects/{projectId}/chunks/{chunkId}`
- **Method**: `GET`
- **Description**: Retrieves a specific chunk by `chunkId` within a given project.
- **Authentication**: Requires `projectId` as username and `readKey` as password

**Example using `fetch`**:

```javascript
fetch(`https://{yourdomain.com}/api/v1/projects/{projectId}/chunks/{chunkId}`, {
  headers: {
    Authorization: 'Basic ' + btoa('{projectId}:{readKey}'),
  },
})
  .then(response => response.json())
  .then(data => console.log('Chunk details:', data))
  .catch(error => console.error('Error:', error));
```

---

### 7. Delete Chunk by ID

- **Endpoint**: `/projects/{projectId}/chunks/{chunkId}`
- **Method**: `DELETE`
- **Description**: Deletes a specific chunk by `chunkId` within a given project.
- **Authentication**: Requires `projectId` as username and `writeKey` as password

**Example using `fetch`**:

```javascript
fetch(`https://{yourdomain.com}/api/v1/projects/{projectId}/chunks/{chunkId}`, {
  method: 'DELETE',
  headers: {
    Authorization: 'Basic ' + btoa('{projectId}:{writeKey}'),
  },
})
  .then(response => {
    if (response.ok) {
      console.log('Chunk deleted');
    } else {
      console.error('Error deleting chunk');
    }
  })
  .catch(error => console.error('Error:', error));
```

---

## Error Responses

- **401 Unauthorized**: Incorrect credentials or missing authentication.
- **404 Not Found**: Resource (Project or Chunk) does not exist.
- **500 Internal Server Error**: An unexpected error occurred on the server.
