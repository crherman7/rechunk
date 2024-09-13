module.exports = {
  presets: ['babel-preset-expo'],
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
