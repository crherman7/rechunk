/**
 * The entry point of the React Native application.
 * Registers the main App component with the AppRegistry.
 *
 * @remarks
 * ReChunk is used for lazy-loading chunks of data.
 *
 * @see {@link https://github.com/crherman7/rechunk ReChunk}
 */

import {AppRegistry} from 'react-native';
import {App} from './src/app';

AppRegistry.registerComponent('example', () => App);
