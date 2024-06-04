import chalk from 'chalk';
import {program} from 'commander';

import {
  getInfoPlistPath,
  getRechunkConfig,
  getStringsXmlPath,
  LOGO,
  type StringArrayElementsType,
  withPlist,
  withXml,
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
    const rcKey = rc.publicKey.replaceAll('\n', '');

    const infoPlistPath = getInfoPlistPath();
    const stringsXmlPath = getStringsXmlPath();

    withPlist<Record<string, unknown>>(infoPlistPath, plist => {
      if (plist.ReChunkPublicKey) {
        plist.ReChunkPublicKey = rcKey;

        console.log(
          chalk.yellow('🔐 ReChunk publicKey has been overwritten for ios!\n'),
        );
      } else {
        plist.ReChunkPublicKey = rcKey;

        console.log(
          chalk.yellow('🔐 ReChunk publicKey has been created for ios!\n'),
        );
      }

      return plist;
    });

    withXml<StringArrayElementsType>(stringsXmlPath, xml => {
      const xmlHasKey = !!xml.resources.string?.find(
        ({_attribute_name}) => _attribute_name.name === 'ReChunkPublicKey',
      );

      xml.resources.string?.forEach(attr => {
        if (xmlHasKey) {
          if (attr._attribute_name.name === 'ReChunkPublicKey') {
            attr._attribute_value = rcKey;

            console.log(
              chalk.yellow(
                '🔐 ReChunk publicKey has been overwritten for android!\n',
              ),
            );
          }
        } else {
          xml.resources.string?.push({
            _attribute_name: {name: 'ReChunkPublicKey'},
            _attribute_value: rcKey,
          });

          console.log(
            chalk.yellow(
              '🔐 ReChunk publicKey has been created for android!\n',
            ),
          );
        }
      });
    });

    console.log(
      '🎉 Successfully synchronized ReChunk keys with native files!\n',
    );
  });
