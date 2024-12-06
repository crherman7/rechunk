import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {cwd} from 'node:process';

import {
  loadPartialConfig,
  PluginItem,
  PluginOptions,
  TransformOptions,
} from '@babel/core';
import {getBabelOutputPlugin} from '@rollup/plugin-babel';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import {RollupOptions} from 'rollup';

/**
 * Represents a modification to a Babel plugin or preset.
 *
 * This type is used to define changes that should be made to Babel plugins or presets.
 * - The key is the name or identifier of the plugin or preset.
 * - The value can either be `null` to indicate that the plugin or preset should be removed,
 *   or a function that receives the current `PluginOptions` and returns the modified `PluginOptions`.
 */
type PluginModification = {
  [key: string]: null | ((options: PluginOptions) => PluginOptions);
};

/**
 * Modifications to be applied to the Babel configuration.
 *
 * This object defines modifications to Babel plugins and presets.
 * - Plugins can be removed by setting their corresponding value to `null`.
 * - Presets can be modified by providing a function that updates their options.
 */
const BABEL_MODIFICATIONS = {
  plugins: {
    /**
     * Removes the `module-resolver` plugin from the Babel configuration.
     *
     * Setting the value to `null` indicates that the plugin should be removed.
     */
    'module-resolver': null,
  },
  presets: {
    /**
     * Updates the options for the `@react-native/babel-preset` preset.
     *
     * This modification function disables the `enableBabelRuntime` option in the preset.
     *
     * @param options - The existing options for the preset.
     * @returns The modified options with `enableBabelRuntime` set to `false`.
     */
    'module:@react-native/babel-preset': (options: any) => ({
      ...options,
      enableBabelRuntime: false,
    }),
    /**
     * Updates the options for the `babel-preset-expo` preset.
     *
     * This modification function disables the `enableBabelRuntime` option in the preset.
     *
     * @param options - The existing options for the preset.
     * @returns The modified options with `enableBabelRuntime` set to `false`.
     */
    'babel-preset-expo': (options: any) => ({
      ...options,
      enableBabelRuntime: false,
    }),
  },
};

/**
 * Updates or removes plugins/presets from the Babel configuration.
 *
 * @param babelConfig - The loaded Babel configuration.
 * @param modifications - An object defining plugins/presets to remove or update.
 * @returns The modified Babel configuration.
 */
function modifyBabelConfig(
  babelConfig: TransformOptions | null,
  modifications: {
    plugins?: PluginModification;
    presets?: PluginModification;
  },
): TransformOptions | null {
  if (!babelConfig) {
    return null;
  }

  const plugins = babelConfig.plugins || [];
  const presets = babelConfig.presets || [];

  const processItems = (
    items: PluginItem[],
    modificationRules?: PluginModification,
  ): PluginItem[] => {
    return items
      .map(item => {
        let nameOrPath: string | undefined;
        let options: PluginOptions | undefined;

        if (Array.isArray(item)) {
          // Handle items that are arrays
          nameOrPath = item[0] as string;
          options = item[1] as PluginOptions;

          if (modificationRules && modificationRules[nameOrPath]) {
            const rule = modificationRules[nameOrPath];
            if (rule === null) {
              return null; // Remove the plugin/preset
            } else if (typeof rule === 'function') {
              return [nameOrPath, rule(options), item[2]] as PluginItem; // Update options
            }
          }
        } else if (typeof item === 'string') {
          // Handle items that are just strings
          nameOrPath = item;

          if (modificationRules && modificationRules[nameOrPath]) {
            const rule = modificationRules[nameOrPath];
            if (rule === null) {
              return null; // Remove the plugin/preset
            }
            // If there's an update function, we assume the plugin might need options.
            return item; // Strings return as-is
          }
        } else if (typeof item === 'object' && item !== null) {
          // Handle PluginObj or ConfigItem
          nameOrPath =
            (item as any).file?.request ??
            (item as any).name ??
            item.toString();

          if (
            nameOrPath &&
            modificationRules &&
            nameOrPath in modificationRules
          ) {
            const rule = modificationRules[nameOrPath];
            if (rule === null) {
              return null; // Remove the plugin/preset
            } else if (typeof rule === 'function') {
              return [nameOrPath, rule((item as any).options || {})];
            }
          }
        }

        return item; // Return the item as it was originally
      })
      .filter(Boolean) as PluginItem[]; // Remove null entries
  };

  // Apply modifications to plugins and presets
  babelConfig.plugins = processItems(plugins, modifications.plugins);
  babelConfig.presets = processItems(presets, modifications.presets);

  return babelConfig;
}

/**
 * Recursively searches for the closest JSON file, starting from a given directory.
 *
 * @param filename - The name of the JSON file to search for.
 * @param start - The directory to start searching from, defaults to the current working directory.
 * @param level - The current depth of the recursive search, used to limit recursion.
 * @returns The parsed JSON content, or an empty object if the file is not found after 10 levels.
 */
function findClosestJSON(filename: string, start = cwd(), level = 0): any {
  try {
    const path = resolve(start, filename);
    const content = readFileSync(path, {encoding: 'utf8'});
    return JSON.parse(content);
  } catch {
    // Limit recursion to 10 levels to prevent potential infinite loops
    return level >= 10
      ? {}
      : findClosestJSON(filename, dirname(start), level + 1);
  }
}

/**
 * Processes the given Rollup options, merging them with default configurations.
 *
 * This function reads the project's `package.json` and `rechunk.json` files to determine
 * external dependencies and entry points, and applies Babel and TypeScript plugins.
 *
 * @param options - The Rollup configuration options to process.
 * @returns The processed Rollup configuration, fully merged with default settings.
 * @throws If `options.input` is not provided as a string, an error is thrown.
 */
async function processOptions(options: RollupOptions) {
  const pkgJSON = findClosestJSON('package.json');
  const rechunkJSON = findClosestJSON('rechunk.json');

  const external = [
    ...Object.keys(pkgJSON.dependencies || {}),
    ...Object.keys(pkgJSON.peerDependencies || {}),
    ...(rechunkJSON.external || []),
  ];

  // Ensure that the input option is a string, as required by rechunk
  if (typeof options.input !== 'string') {
    throw new Error('rechunk rollup-preset requires options.input as a string');
  }

  // Load partial Babel configuration to be used in the Rollup output plugin
  const babelConfig = loadPartialConfig();
  let babelConfigOptions;

  if (babelConfig?.options) {
    babelConfigOptions = modifyBabelConfig(
      babelConfig.options,
      BABEL_MODIFICATIONS,
    );
  }

  // Define the default Rollup options with plugins for images, TypeScript, and Babel
  const defaultOptions = {
    external,
    plugins: [
      getBabelOutputPlugin({...babelConfigOptions, filename: options.input}),
      image(),
      typescript({
        compilerOptions: {
          jsx: 'react',
          module: 'commonjs',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          downlevelIteration: true,
        },
      }),
    ],
    logLevel: 'silent',
  } satisfies RollupOptions;

  const {mergeAndConcat} = await import('merge-anything');

  return mergeAndConcat(options, defaultOptions) as RollupOptions;
}

/**
 * A Rollup preset function that extends the provided options with a default configuration.
 *
 * This preset processes single or multiple Rollup configuration objects, applying the
 * `processOptions` function to each.
 *
 * @param options - The Rollup configuration or array of configurations to extend.
 * @returns A fully configured Rollup configuration or an array of configurations.
 */
export default function withRechunk(options: RollupOptions = {}) {
  return processOptions(options);
}
