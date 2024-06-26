import type {Project} from '@prisma/client';

/**
 * Creates a new project.
 *
 * @returns {Promise<Project>} A promise that resolves when the project is created.
 */
export async function createProject(projectId: string): Promise<Project> {}

/**
 * Deletes a project by its ID.
 *
 * @param {Project['id']} id - The ID of the project to delete.
 * @returns {Promise<void>} A promise that resolves when the project is deleted.
 */
export async function deleteProjectById(id: Project['id']): Promise<void> {}

/**
 * Retrieves a project by its ID.
 *
 * @param {Project['id']} id - The ID of the project to retrieve.
 * @returns {Promise<Project | null>} A promise that resolves with the project if found, or null if not found.
 */
export async function getProjectById(
  id: Project['id'],
): Promise<Project | null> {}
