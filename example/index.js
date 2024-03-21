import {AppRegistry} from 'react-native';
import ReChunk from '@crherman7/rechunk';

import App from '@/app/App';
import {fetchChunk} from '@/shared';

ReChunk.addConfiguration(fetchChunk, true);

AppRegistry.registerComponent('example', () => App);
