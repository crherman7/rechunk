import React, {Suspense} from 'react';
import {importChunk} from '@crherman7/rechunk';
import {ErrorBoundary} from 'react-error-boundary';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

const Foo = React.lazy(() => importChunk('foo'));

function Error404() {
  return (
    <View style={styles.container}>
      <Text>404 Page Not Found</Text>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <ErrorBoundary FallbackComponent={Error404}>
      <Suspense fallback={<ActivityIndicator style={styles.container} />}>
        <Foo />
      </Suspense>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
