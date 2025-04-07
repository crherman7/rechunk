const path = require('node:path');
const {cacheVersion} = require('@rechunk/metro-config');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withMetroRequirexConfig} = require('@metro-requirex/metro-config');

const root = path.resolve(__dirname, '../..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [root],
  cacheVersion,
  resolver: {
    disableHierarchicalLookup: true,
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(root, 'node_modules'),
    ],
  },
};

module.exports = withMetroRequirexConfig(
  mergeConfig(getDefaultConfig(__dirname), config),
);
