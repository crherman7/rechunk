import fs from 'fs';
import path from 'path';
import {program} from 'commander';
import {
  getRechunkConfig,
  getIOSPath,
  getAndroidPath,
  doesKeywordExist,
  updateFile,
  LOGO,
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

    const iosPath = getIOSPath();
    const infoPlistPath = path.resolve(iosPath, 'example', 'Info.plist');

    if (!fs.existsSync(infoPlistPath)) {
      throw new Error('[ReChunk]: cannot find Info.plist file.');
    }

    if (!doesKeywordExist(infoPlistPath, '<key>ReChunkPublicKey</key>')) {
      throw new Error(
        '[ReChunk]: cannot find ReChunkPublicKey key in Info.plist file.',
      );
    }

    updateFile(
      infoPlistPath,
      /(<key>ReChunkPublicKey<\/key>\s*<string>)[\s\S]*?(<\/string>)/,
      `$1${rc.publicKey}$2`,
    );

    const androidPath = getAndroidPath();
    const stringsValuesPath = path.resolve(
      androidPath,
      'app',
      'src',
      'main',
      'res',
      'values',
      'strings.xml',
    );

    if (!fs.existsSync(stringsValuesPath)) {
      throw new Error('[ReChunk]: cannot find strings.xml file');
    }

    if (
      !doesKeywordExist(stringsValuesPath, '<string name="ReChunkPublicKey">')
    ) {
      throw new Error(
        '[ReChunk]: cannot find ReChunkPublicKey key in strings.xml file.',
      );
    }

    updateFile(
      stringsValuesPath,
      /(<string name="ReChunkPublicKey">)[\s\S]*?(<\/string>)/,
      `$1${rc.publicKey}$2`,
    );

    console.log('🎉 Successfully synchronized ReChunk keys with native files!');
  });
