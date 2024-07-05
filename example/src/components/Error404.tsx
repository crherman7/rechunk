import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export function Error404() {
  return (
    <View style={styles.container}>
      <Text>404 Page Not Found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
