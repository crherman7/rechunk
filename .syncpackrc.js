// @ts-check

/** @type {import("syncpack").RcFile} */
const config = {
  versionGroups: [
    {
      dependencies: ['@repo/**', '@rechunk/**'],
      dependencyTypes: ['dev', 'prod'],
      pinVersion: 'workspace:*',
    },
    {
      dependencies: ['react-native'],
      dependencyTypes: ['dev', 'prod'],
    },
    {
      dependencies: ['react'],
      dependencyTypes: ['dev', 'prod'],
    },
    {
      dependencies: ['**'],
    },
  ],
};

module.exports = config;
