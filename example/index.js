import {AppRegistry} from 'react-native';
import ReChunk from '@crherman7/rechunk';

import App from '@/app/App';

ReChunk.addConfiguration(async chunkId => {
  const res = await fetch(`http://localhost:3000?chunkId=${chunkId}`);

  return res.json();
}, true);

AppRegistry.registerComponent('example', () => App);
