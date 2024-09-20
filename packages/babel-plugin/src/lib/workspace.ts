import findUp from 'find-up';
import fs from 'fs';
import path from 'path';

const WORKSPACE_DIR_ENV_VAR = 'NPM_CONFIG_WORKSPACE_DIR';
const WORKSPACE_MANIFEST_FILENAME = 'pnpm-workspace.yaml';

/**
 * Finds the workspace directory by locating the workspace manifest file.
 *
 * The function first checks the environment variable for the workspace directory.
 * If it's not set, it uses the `find-up` package to search for the workspace manifest file
 * in the current directory and its parents. The expected manifest file names are:
 * - pnpm-workspace.yaml
 * - pnpm-workspace.yml
 *
 * @param {string} cwd - The current working directory from which to start searching.
 * @returns {string | undefined} The path to the workspace directory if found, or undefined if not found.
 *
 * @throws {Error} If the workspace manifest file is found but has an incorrect name (i.e., ends with `.yml`).
 */
export function findWorkspaceDir(cwd: string): string | undefined {
  const workspaceManifestDirEnvVar =
    process.env[WORKSPACE_DIR_ENV_VAR] ??
    process.env[WORKSPACE_DIR_ENV_VAR.toLowerCase()];

  const workspaceManifestLocation = workspaceManifestDirEnvVar
    ? path.join(workspaceManifestDirEnvVar, WORKSPACE_MANIFEST_FILENAME)
    : findUp.sync([WORKSPACE_MANIFEST_FILENAME, 'pnpm-workspace.yml'], {
        cwd: getRealPath(cwd),
      });

  if (workspaceManifestLocation?.endsWith('.yml')) {
    throw new Error(
      'BAD_WORKSPACE_MANIFEST_NAME' +
        ` The workspace manifest file should be named "pnpm-workspace.yaml". File found: ${workspaceManifestLocation}`,
    );
  }

  return workspaceManifestLocation && path.dirname(workspaceManifestLocation);
}

/**
 * Resolves the real native path for a given file path.
 *
 * This is particularly useful for case-insensitive file systems,
 * where different casing can lead to discrepancies in file paths.
 * For example, accessing the file as `C:\Code\Project` vs. `c:\code\projects`
 * can cause issues when installing packages with the `-w` flag if the root directory
 * is not consistently cased.
 *
 * @param {string} filePath - The path of the file to resolve.
 * @returns {string} The resolved real path, or the original path if resolution fails.
 */
function getRealPath(filePath: string): string {
  try {
    return fs.realpathSync.native(filePath);
  } catch {
    return filePath;
  }
}
