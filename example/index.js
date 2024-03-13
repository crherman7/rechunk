import {AppRegistry} from 'react-native';
import * as ReChunk from '@crherman7/rechunk';

import App from './App';
import {name as appName} from './app.json';

ReChunk.addResolver(async chunkId => {
  return new Promise(res =>
    setTimeout(
      () =>
        res(
          'InVzZSBzdHJpY3QiO3ZhciBlPXJlcXVpcmUoInJlYWN0LW5hdGl2ZSIpLHI9cmVxdWlyZSgicmVhY3QiKTttb2R1bGUuZXhwb3J0cz0oKT0+ci5jcmVhdGVFbGVtZW50KGUuVmlldyxudWxsLHIuY3JlYXRlRWxlbWVudChlLlRleHQsbnVsbCwiRm9vIikpOwo=',
        ),
      1000,
    ),
  );
});

AppRegistry.registerComponent(appName, () => App);
