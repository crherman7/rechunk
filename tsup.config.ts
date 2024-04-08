import {defineConfig} from 'tsup';

export default defineConfig({
  dts: true,
  minify: true,
  external: ['babel-plugin-module-resolver'],
  entry: ['src/react-native/index.ts', 'src/cli/index.ts'],
});
