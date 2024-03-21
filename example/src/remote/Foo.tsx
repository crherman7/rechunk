import React from 'react';
import {View, Text} from 'react-native';

import {SharedComponent} from '@/shared';

export default function Foo() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>
        Deserunt nostrud proident anim in eiusmod cillum culpa nulla cillum sint
        excepteur enim minim dolore. Ullamco non eu reprehenderit nisi duis sint
        et aliquip amet anim ut quis do proident. Consectetur laboris quis
        dolore ea aliquip officia sit. Culpa minim id tempor ut dolore proident
        aliquip nisi est cillum velit consequat sint. Amet amet ullamco id
        excepteur esse eiusmod.
      </Text>
      <SharedComponent />
    </View>
  );
}
