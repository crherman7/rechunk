import React, {memo} from 'react';
import {FlatList, type FlatListProps, StyleSheet} from 'react-native';

import {
  TransactionItem,
  type TransactionItemType,
  TransactionsHeader,
} from '@/components';

interface TransactionsProps
  extends Omit<FlatListProps<TransactionItemType>, 'renderItem'> {}

export default memo<TransactionsProps>(function Transactions({data, ...props}) {
  return (
    <FlatList
      data={data}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => <TransactionItem {...item} />}
      keyExtractor={item => item.date}
      ListHeaderComponent={TransactionsHeader}
      stickyHeaderIndices={[0]}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
