import {execFileSync} from 'child_process';
import findUp from 'find-up';
import fs from 'fs';
import {basename, dirname, resolve} from 'path';

/**
 * Resolves the real native path for a given file path.
 *
 * This is particularly useful for case-insensitive file systems,
 * where different casing can lead to discrepancies in file paths.
 * For example, accessing the file as `C:\Code\Project` vs. `c:\code\projects`
 * can cause issues when installing packages with the `-w` flag if the root directory
 * is not consistently cased.
 *
 * @param {string} filePath - The path of the file to resolve
 * @returns {string} The resolved real path, or the original path if resolution fails
 */
export function getRealPath(filePath: string): string {
  try {
    return fs.realpathSync.native(filePath);
  } catch {
    return filePath;
  }
}

/**
 * Recursively searches for the closest JSON file, starting from a given directory.
 *
 * @param {string} filename - The name of the JSON file to search for
 * @param {string} start - The directory to start searching from, defaults to current working directory
 * @param {number} level - The current depth of the recursive search, used to limit recursion
 * @returns {any} The parsed JSON content, or an empty object if file not found after 10 levels
 */
export function findClosestJSON(
  filename: string,
  start: string = process.cwd(),
  level: number = 0,
): any {
  try {
    const path = resolve(start, filename);
    const content = fs.readFileSync(path, {encoding: 'utf8'});
    return JSON.parse(content);
  } catch {
    return level >= 10
      ? {}
      : findClosestJSON(filename, dirname(start), level + 1);
  }
}

/**
 * Finds the workspace directory by locating the workspace manifest file.
 *
 * Searches for workspace-related files using the `find-up` package
 * in the current directory and its parents. Looks for:
 * - package.json with workspaces field (npm/yarn/bun)
 * - yarn.lock, pnpm-lock.yaml, or bun.lockb files
 *
 * @param {string} cwd - The current working directory from which to start searching
 * @returns {string | undefined} The path to the workspace directory if found, or undefined if not found
 */
export function findWorkspaceDir(cwd: string): string | undefined {
  if (process.env.WORKSPACE_DIR) {
    return process.env.WORKSPACE_DIR;
  }

  const manifestLocation = findUp.sync(
    ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
    {
      cwd: getRealPath(cwd),
    },
  );

  return manifestLocation ? dirname(manifestLocation) : undefined;
}

/**
 * Options for process listing operations
 */
export interface ProcessOptions {
  /** Whether to show all processes. Defaults to true */
  all?: boolean;
}

/**
 * Information about a running process
 */
export interface ProcessInfo {
  /** Process ID */
  pid: number;
  /** Parent Process ID */
  ppid: number;
  /** User ID */
  uid: number;
  /** CPU usage percentage */
  cpu: number;
  /** Memory usage percentage */
  memory: number;
  /** Process name */
  name: string;
  /** Full command line */
  cmd: string;
}

const TEN_MEGABYTES = 1000 * 1000 * 10;
const PS_OUTPUT_REGEX =
  /^[ \t]*(?<pid>\d+)[ \t]+(?<ppid>\d+)[ \t]+(?<uid>[-\d]+)[ \t]+(?<cpu>\d+\.\d+)[ \t]+(?<memory>\d+\.\d+)[ \t]+(?<comm>.*)?/;

/**
 * Retrieves information about running processes on a non-Windows system using the `ps` command.
 *
 * @param {ProcessOptions} options - Optional settings for the command
 * @returns {ProcessInfo[]} Array of objects containing process information
 * @throws {Error} If parsing the output from `ps` fails
 */
export function nonWindowsCall(options: ProcessOptions = {}): ProcessInfo[] {
  const flags = options.all === false ? 'wwxo' : 'awwxo';

  const psOutput = execFileSync('ps', [flags, 'pid,ppid,uid,%cpu,%mem,comm'], {
    maxBuffer: TEN_MEGABYTES,
  }).toString();
  const psArgsOutput = execFileSync('ps', [flags, 'pid,args'], {
    maxBuffer: TEN_MEGABYTES,
  }).toString();

  const psLines = psOutput.trim().split('\n');
  const psArgsLines = psArgsOutput.trim().split('\n');

  psLines.shift();
  psArgsLines.shift();

  const processCmds: Record<string, string> = {};
  for (const line of psArgsLines) {
    const [pid, ...cmds] = line.trim().split(' ');
    processCmds[pid] = cmds.join(' ');
  }

  return psLines.map(line => {
    const match = PS_OUTPUT_REGEX.exec(line);
    if (!match?.groups) throw new Error('ps output parsing failed');

    const {pid, ppid, uid, cpu, memory, comm} = match.groups;
    return {
      pid: parseInt(pid, 10),
      ppid: parseInt(ppid, 10),
      uid: parseInt(uid, 10),
      cpu: parseFloat(cpu),
      memory: parseFloat(memory),
      name: basename(comm),
      cmd: processCmds[pid],
    };
  });
}

/**
 * Checks if the Rechunk development server is currently running.
 *
 * Inspects the system's running processes, looking for processes
 * that match the `rechunk dev-server` command. Checks for matches that either:
 * - Start with `node ./node_modules`
 * - Start with `node <workspaceDir>`
 *
 * @returns {boolean} `true` if the Rechunk development server is running, otherwise `false`
 */
export function isRechunkDevServerRunning(): boolean {
  const processes = nonWindowsCall();
  const workspaceDir = findWorkspaceDir(process.cwd());
  const NODE_IDENTIFIER = 'node';
  const NODE_MODULES_PATH = './node_modules';
  const DEV_SERVER_CMD = 'rechunk dev-server';

  return processes.some(
    process =>
      typeof process.cmd === 'string' &&
      process.cmd.includes(DEV_SERVER_CMD) &&
      (process.cmd.startsWith(`${NODE_IDENTIFIER} ${NODE_MODULES_PATH}`) ||
        process.cmd.startsWith(`${NODE_IDENTIFIER} ${workspaceDir}`)),
  );
}
