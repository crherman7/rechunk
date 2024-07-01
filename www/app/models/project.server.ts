import type {Project} from '@prisma/client';

/**
 * Creates a new project.
 *
 * @returns {Promise<Project>} A promise that resolves when the project is created.
 */
export async function createProject(): Promise<Project> {}

/**
 * Deletes a project by its ID.
 *
 * @param {Project['id']} id - The ID of the project to delete.
 * @returns {Promise<void>} A promise that resolves when the project is deleted.
 */
export async function deleteProjectById(id: Project['id']): Promise<void> {}

/**
 * Deletes a project by its name.
 *
 * @param {Project['name']} name - The name of the project to delete.
 * @returns {Promise<void>} A promise that resolves when the project is deleted.
 */
export async function deleteProjectByName(
  name: Project['name'],
): Promise<void> {}

/**
 * Retrieves a project by its ID.
 *
 * @param {Project['id']} id - The ID of the project to retrieve.
 * @returns {Promise<Project | null>} A promise that resolves with the project if found, or null if not found.
 */
export async function getProjectById(
  id: Project['id'],
): Promise<Project | null> {}

/**
 * Retrieves a project by its name.
 *
 * @param {Project['name']} name - The name of the project to retrieve.
 * @returns {Promise<Project | null>} A promise that resolves with the project if found, or null if not found.
 */
export async function getProjectByName(
  name: Project['name'],
): Promise<Project | null> {}

/**
 * Verifies a login using the project name and write key.
 *
 * @param {Project['name']} name - The name of the project.
 * @param {Project['writeKey']} writeKey - The write key of the project.
 * @returns {Promise<Project>} A promise that resolves with true if the login is verified, or false otherwise.
 */
export async function verifyLogin(
  name: Project['name'],
  writeKey: Project['writeKey'],
): Promise<Project> {}
