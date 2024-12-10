module.exports = api => {
  // Determine if we should disable Babel runtime based on the caller
  const isRechunk = api.caller(caller => caller && caller.name === 'rechunk');

  return {
    presets: [['babel-preset-expo', {enableBabelRuntime: !isRechunk}]],
    plugins: [['@crherman7/rechunk-babel-plugin']],
  };
};
