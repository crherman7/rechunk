'use rechunk';

import React, {memo} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import type {AbstractChartConfig} from 'react-native-chart-kit/dist/AbstractChart';
import type {LineChartProps} from 'react-native-chart-kit/dist/line-chart/LineChart';

interface BalanceProps extends Omit<LineChartProps, 'width' | 'height'> {
  width?: number;
  height?: number;
  balance: number;
  config?: AbstractChartConfig;
}

export default memo<BalanceProps>(function Balance({
  balance,
  config,
  data,
  height = 100,
  width = Dimensions.get('window').width / 2,
  ...props
}) {
  return (
    <View style={styles.container}>
      <View style={styles.layout}>
        <View>
          <Text style={styles.title}>Card balance</Text>
          <Text style={styles.balance}>${balance.toFixed(2)}</Text>
        </View>
        <LineChart
          bezier
          data={data}
          width={width}
          height={height}
          withHorizontalLabels={false}
          chartConfig={{...defaultChartConfig, ...config}}
          hidePointsAtIndex={data.datasets
            .map(it => [...Array(it.data.length - 1).keys()])
            .flat(1)}
          {...props}
        />
      </View>
    </View>
  );
});

const defaultChartConfig: AbstractChartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  fillShadowGradientFrom: '#fff',
  fillShadowGradientTo: '#fff',
  propsForBackgroundLines: {stroke: 'transparent'},
  color: (opacity = 1) => `rgba(0, 200, 200, ${opacity * 2})`,
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 120,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 12,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#666',
    marginBottom: 6,
  },
  balance: {
    fontSize: 28,
    fontWeight: '600',
  },
});
