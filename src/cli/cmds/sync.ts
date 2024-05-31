import chalk from 'chalk';
import {program} from 'commander';

import {
  doesKeywordExist,
  getInfoPlistPath,
  getRechunkConfig,
  getStringsXmlPath,
  LOGO,
  updateFile,
} from '../lib';

/**
 * Defines a command for the "sync" operation using the "commander" library.
 *
 * @example
 * ```bash
 * yarn rechunk sync
 * ```
 *
 * @remarks
 * This command is part of a larger program defined using the "commander" library.
 *
 * @see {@link https://www.npmjs.com/package/commander | commander} - Command-line framework for Node.js.
 */
program
  .command('sync')
  .description('sync keys from the ReChunk configuration with native files')
  .action(async () => {
    console.log();
    console.log(LOGO);

    const rc = getRechunkConfig();
    const infoPlistPath = getInfoPlistPath();
    const stringsXmlPath = getStringsXmlPath();

    /* synchronisation steps for IOS */
    if (doesKeywordExist(infoPlistPath, '<key>ReChunkPublicKey</key>')) {
      updateFile(
        infoPlistPath,
        /(<key>ReChunkPublicKey<\/key>\s*<string>)[\s\S]*?(<\/string>)/,
        `$1${rc.publicKey}$2`,
      );
      console.log(
        chalk.yellow('🔐 ReChunk publicKey has been overwritten for ios!'),
      );
    } else {
      /* @todo: implement init steps */
    }

    /* synchronisation steps for ANDROID */
    if (doesKeywordExist(stringsXmlPath, '<string name="ReChunkPublicKey">')) {
      updateFile(
        stringsXmlPath,
        /(<string name="ReChunkPublicKey">)[\s\S]*?(<\/string>)/,
        `$1${rc.publicKey}$2`,
      );
      console.log(
        chalk.yellow('🔐 ReChunk publicKey has been overwritten for android!'),
      );
    } else {
      /* @todo: implement init steps */
    }

    console.log('🎉 Successfully synchronized ReChunk keys with native files!');
  });
