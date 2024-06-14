import {defineConfig} from 'tsup';

export default defineConfig({
  dts: true,
  external: ['babel-plugin-module-resolver'],
  entry: [
    'src/babel/index.ts',
    'src/cli/index.ts',
    'src/react-native/index.ts',
  ],
});
