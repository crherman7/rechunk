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
      pinVersion: '0.76.9',
    },
    {
      dependencies: ['react'],
      dependencyTypes: ['dev', 'prod'],
      pinVersion: '18.3.1',
    },
  ],
};

module.exports = config;
