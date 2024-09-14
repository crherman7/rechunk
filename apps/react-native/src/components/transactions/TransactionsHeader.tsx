import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default memo(function TransactionsHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Latest transactions</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    backgroundColor: '#ecf0f1',
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    color: '#666',
  },
});
