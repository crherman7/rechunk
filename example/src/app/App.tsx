import React, {Suspense, lazy} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {ActivityIndicator, StyleSheet, SafeAreaView, View} from 'react-native';
import {importChunk} from '@crherman7/rechunk';
import {Error404} from '@/components';

const Card = lazy(() => importChunk('card'));
const Balance = lazy(() => importChunk('balance'));
const Transactions = lazy(() => importChunk('transactions'));

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

const balanceData = {
  total: 921.27,
  data: {
    labels: ['test'],
    datasets: [
      {
        data: [
          0,
          25 + Math.random() * 25,
          50 + Math.random() * 25,
          75 + Math.random() * 25,
          75 + Math.random() * 25,
          100 + Math.random() * 25,
          100 + Math.random() * 25,
          120 + Math.random() * 25,
          130 + Math.random() * 25,
          150 + Math.random() * 25,
        ],
      },
    ],
  },
};

const transactionsData = [
  {
    title: 'Akamai Coffee Shop',
    location: 'Kihei, HI',
    date: 'Today, 13:21',
    amount: (Math.random() * 10).toFixed(2),
    icon: '#FB8E41',
  },
  {
    title: 'Shops at Wailea',
    location: 'Wailea, HI',
    date: 'Yesterday, 20:07',
    amount: (Math.random() * 25).toFixed(2),
    icon: '#0091FF',
  },
  {
    title: 'Ono Hawaiian BBQ',
    location: 'Paia, HI',
    date: 'Thursday',
    amount: (Math.random() * 100).toFixed(2),
    icon: '#34D058',
  },
  {
    title: 'Fond',
    location: 'Lahaina, HI',
    date: 'Wensday',
    amount: (Math.random() * 10).toFixed(2),
    icon: '#34D058',
  },
  {
    title: 'Ula’Ula Cafe',
    location: 'Waihee-Waiehu, HI',
    date: 'Tuesday',
    amount: (Math.random() * 15).toFixed(2),
    icon: '#FB8E41',
  },
  {
    title: "Tante's Fishmarket",
    location: 'Wailuku, HI',
    date: 'Monday',
    amount: (Math.random() * 10).toFixed(2),
    icon: '#0091FF',
  },
];

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
