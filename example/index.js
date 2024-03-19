import {AppRegistry} from 'react-native';
import ReChunk from '@crherman7/rechunk';

import App from './App';

ReChunk.addConfiguration(async chunkId => {
  return new Promise(res =>
    setTimeout(
      () =>
        res({
          data: 'InVzZSBzdHJpY3QiO3ZhciBlPXJlcXVpcmUoInJlYWN0LW5hdGl2ZSIpLHI9cmVxdWlyZSgicmVhY3QiKTttb2R1bGUuZXhwb3J0cz0oKT0+ci5jcmVhdGVFbGVtZW50KGUuVmlldyxudWxsLHIuY3JlYXRlRWxlbWVudChlLlRleHQsbnVsbCwiRm9vIikpOwo=',
          hash: 'a72ffc3281a7958a8e8ccae8b89966bf10ff924cac303354176b90a281005e71',
          sig: 'Hn/exBd3jTzAYyEqR7rlIrXXQZ3N8RxXL6g6Wyahn0J1hksc9AY1fVUH/HSmYzX+okd9CQCIcNtJuDM1ytrkiQjfTlfx77EY0kbuH1oSGcfhyCUPorG1Ry/7YFm9WXW4esM0qk6LTYVpZ/VFtxHNJjCiB+1+EUPHtwXlsKyFGBhh4GFvNYwdoFu8k8risgnfzKuNY0kxjeVRWIKOJ7Bx0LvqWc3FNqq0QwjfpSeFBrRtZBvi0xysy2NKzNQSX4WknLQSuhUsiSv3a+scY4Av/ahGLRraTbK+VEN2hZECfaOrh3Va+bCexNDZTtN1064Kpd/R0bkTkGsWGA0l9IHpHQ==',
        }),
      1000,
    ),
  );
}, true);

AppRegistry.registerComponent('example', () => App);
