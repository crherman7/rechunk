/**
 * The entry point of the React Native application.
 * Registers the main App component with the AppRegistry.
 * Configures ReChunk library with the fetchChunk function for fetching data chunks.
 *
 * @remarks
 * ReChunk is used for lazy-loading chunks of data.
 *
 * @see {@link https://github.com/crherman7/rechunk ReChunk}
 * @see {@link fetchChunk}
 */

import {AppRegistry} from 'react-native';
import ReChunk from '@crherman7/rechunk'; // Importing ReChunk library

import {App} from '@/app'; // Importing the main App component
import {fetchChunk} from '@/shared'; // Importing the fetchChunk function from shared module

// Adding configuration to ReChunk library with the fetchChunk function and enabling caching
ReChunk.addConfiguration(fetchChunk, true);

// Registering the main App component with the AppRegistry
AppRegistry.registerComponent('example', () => App);
