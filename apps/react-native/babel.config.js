const {withReactNativeBabelPresetOptions} = require('@rechunk/babel-plugin');

module.exports = api => {
  return {
    presets: [
      [
        'module:@react-native/babel-preset',
        withReactNativeBabelPresetOptions(api),
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
      ['@rechunk/babel-plugin'],
    ],
  };
};
