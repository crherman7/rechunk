module.exports = api => {
  // Determine if we should disable Babel runtime based on the caller
  const isRechunk = api.caller(caller => caller && caller.name === 'rechunk');

  return {
    presets: [
      [
        'module:@react-native/babel-preset',
        {
          enableBabelRuntime: !isRechunk,
          disableImportExportTransform: isRechunk,
        },
      ],
    ],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            '@': './src',
          },
        },
      ],
      ['@crherman7/rechunk-babel-plugin'],
    ],
  };
};
