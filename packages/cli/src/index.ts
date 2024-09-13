#!/bin/env node

import './cmds';

import chalk from 'chalk';
import {program} from 'commander';
import process from 'process';

import pak from '../package.json';

/**
 * The main program object for the command-line interface.
 * @type {Object}
 */
program
  .name('rechunk')
  .description('command-line interface for rechunk')
  .version(pak.version, '-v, --version', 'output the current version');
/**
 * Handles any uncaught errors and logs a message to the console.
 * @param {Error} error - The error that was caught.
 */
program.parseAsync().catch(async error => {
  console.log();
  console.log(
    chalk.red`Unexpected error. Please report it as a bug: https://github.com/crherman7/rechunk/issues`,
  );
  console.log();
  console.log(chalk.red(error.message));

  process.exit(1);
});
