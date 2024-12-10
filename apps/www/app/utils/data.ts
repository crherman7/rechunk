import {Chunk} from '@prisma/client';
import {useMatches} from '@remix-run/react';
import {useMemo} from 'react';

/**
 * Retrieves the loader data for a specific route using its `id`.
 *
 * @param id - The `id` of the route whose data you want to retrieve.
 * @returns The loader data for the specified route as a record of key-value pairs, or `undefined` if not found.
 *
 * @example
 * ```typescript
 * const routeData = useMatchesData('routes/_dashboard');
 * console.log(routeData); // Logs the data from the loader of the specified route
 * ```
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find(route => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

/**
 * Retrieves the `projectId` from the loader data of the `routes/_dashboard` route.
 *
 * @returns The `projectId` as a string if it exists and is valid, otherwise `undefined`.
 *
 * @example
 * ```typescript
 * const projectId = useProjectId();
 * if (projectId) {
 *   console.log(`Project ID: ${projectId}`);
 * } else {
 *   console.log('No project ID found.');
 * }
 * ```
 */
export function useProjectId(): string | undefined {
  const data = useMatchesData('routes/_dashboard');
  if (!data) {
    return undefined;
  }

  const {projectId} = data;
  if (!projectId || typeof projectId !== 'string') {
    return undefined;
  }

  return data.projectId as string;
}

/**
 * Custom hook to retrieve a single chunk by its ID from the route loader data.
 *
 * This hook extracts the `chunks` array from the specified route loader data,
 * checks its validity, and searches for a chunk with a matching `chunkId`.
 *
 * @param {string} chunkId - The ID of the chunk to retrieve.
 * @returns {Chunk | undefined} The matching chunk if found, or `undefined` if not.
 *
 * @example
 * ```tsx
 * const chunk = useChunk('chunk-id-123');
 * if (chunk) {
 *   console.log(chunk.data); // Output the chunk's data
 * }
 * ```
 */
export function useChunk(
  chunkId: string,
): (Chunk & {filePath: string}) | undefined {
  // Replace with your actual route ID
  const data = useMatchesData('routes/_dashboard.chunks');

  // Ensure data is available and `chunks` is an array
  if (!data?.chunks || !Array.isArray(data.chunks)) {
    return undefined;
  }

  // Safely find and return the chunk with the matching ID
  return data.chunks.find(
    (item): item is Chunk & {filePath: string} =>
      item && typeof item === 'object' && item.id === chunkId,
  );
}

/**
 * A custom hook that retrieves an array of chunk IDs from the `routes/_dashboard.chunks` match data.
 * This hook uses the `useMatchesData` utility to access route-specific data and extracts the `id` property
 * from the `chunks` array if it exists.
 *
 * @returns {string[] | undefined} An array of chunk IDs if available, otherwise `undefined`.
 *
 * @example
 * ```tsx
 * const chunkIds = useChunkIds();
 * if (chunkIds) {
 *   console.log('Chunk IDs:', chunkIds);
 * } else {
 *   console.log('No chunks found');
 * }
 * ```
 */
export function useChunkIds(): string[] | undefined {
  const data = useMatchesData('routes/_dashboard.chunks');

  if (!data?.chunks || !Array.isArray(data.chunks)) {
    return undefined;
  }

  return data.chunks.map(it => it.id);
}
