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
