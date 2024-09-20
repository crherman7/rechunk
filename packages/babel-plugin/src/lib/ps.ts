import {execFileSync} from 'child_process';
import path from 'path';

const TEN_MEGABYTES = 1000 * 1000 * 10;
const ERROR_MESSAGE_PARSING_FAILED = 'ps output parsing failed';

/**
 * Regular expression to parse the output of the `ps` command.
 * It captures the PID, PPID, UID, CPU usage, memory usage, and command name.
 */
const psOutputRegex =
  /^[ \t]*(?<pid>\d+)[ \t]+(?<ppid>\d+)[ \t]+(?<uid>[-\d]+)[ \t]+(?<cpu>\d+\.\d+)[ \t]+(?<memory>\d+\.\d+)[ \t]+(?<comm>.*)?/;

/**
 * Retrieves information about running processes on a non-Windows system using the `ps` command.
 *
 * @param {Object} [options={}] - Optional settings for the command.
 * @param {boolean} [options.all=true] - Whether to show all processes or not.
 * @returns {Array<Object>} An array of objects containing process information, where each object includes:
 * - `pid`: The process ID.
 * - `ppid`: The parent process ID.
 * - `uid`: The user ID.
 * - `cpu`: The CPU usage percentage.
 * - `memory`: The memory usage percentage.
 * - `name`: The name of the command.
 * - `cmd`: The full command line arguments of the process.
 *
 * @throws {Error} If parsing the output from `ps` fails.
 */
const nonWindowsCall = (options = {} as any) => {
  const flags = options.all === false ? 'wwxo' : 'awwxo';

  const psOutput = execFileSync('ps', [flags, 'pid,ppid,uid,%cpu,%mem,comm'], {
    maxBuffer: TEN_MEGABYTES,
  }).toString();
  const psArgsOutput = execFileSync('ps', [flags, 'pid,args'], {
    maxBuffer: TEN_MEGABYTES,
  }).toString();

  const psLines = psOutput.trim().split('\n');
  const psArgsLines = psArgsOutput.trim().split('\n');

  psLines.shift(); // Remove header line
  psArgsLines.shift(); // Remove header line

  const processCmds = {};
  for (const line of psArgsLines) {
    const [pid, ...cmds] = line.trim().split(' ');
    processCmds[pid] = cmds.join(' ');
  }

  const processes = psLines.map(line => {
    const match = psOutputRegex.exec(line);

    if (match === null) {
      throw new Error(ERROR_MESSAGE_PARSING_FAILED);
    }

    const {pid, ppid, uid, cpu, memory, comm} = match.groups;

    const processInfo = {
      pid: Number.parseInt(pid, 10),
      ppid: Number.parseInt(ppid, 10),
      uid: Number.parseInt(uid, 10),
      cpu: Number.parseFloat(cpu),
      memory: Number.parseFloat(memory),
      name: path.basename(comm),
      cmd: processCmds[pid],
    };

    return processInfo;
  });

  return processes;
};

export {nonWindowsCall};
