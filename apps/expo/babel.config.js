const {withBabelPresetExpoOptions} = require('@rechunk/babel-plugin');

module.exports = api => {
  return {
    presets: [['babel-preset-expo', withBabelPresetExpoOptions(api)]],
    plugins: [['@rechunk/babel-plugin']],
  };
};
