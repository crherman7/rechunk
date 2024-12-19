import React, {Suspense} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {ActivityIndicator, SafeAreaView, StyleSheet, View} from 'react-native';

import {Error404} from '@/components';
import Balance from '@/components/remote/Balance';
import Card from '@/components/remote/Card';
import Transactions from '@/components/remote/Transactions';
import {balanceData, transactionsData} from '@/lib';

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Error404}>
      <Suspense fallback={<ActivityIndicator style={styles.container} />}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Card />
            <Balance data={balanceData.data} balance={balanceData.total} />
          </View>
          <Transactions data={transactionsData} />
        </SafeAreaView>
      </Suspense>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: '#ecf0f1',
  },
  content: {
    paddingHorizontal: 16,
  },
});
