const path = require('node:path');
const {cacheVersion} = require('@rechunk/metro-config');
const {getDefaultConfig} = require('expo/metro-config');
const {withMetroRequirexConfig} = require('@metro-requirex/metro-config');

const root = path.resolve(__dirname, '../..');
const config = getDefaultConfig(__dirname);

config.watchFolders = [root];
config.cacheVersion = cacheVersion;
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(root, 'node_modules'),
];

module.exports = withMetroRequirexConfig(config, {eager: true});
