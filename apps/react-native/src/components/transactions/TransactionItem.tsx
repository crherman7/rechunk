import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export type TransactionItemType = {
  date: string;
  title: string;
  location: string;
  amount: string;
  icon: string;
};

export default memo<TransactionItemType>(function TransactionItem({
  icon,
  title,
  amount,
  location,
  date,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.layout}>
        <View style={styles.contentLayout}>
          <View style={[styles.icon, {backgroundColor: icon}]} />
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.location}>{location}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <Text style={styles.amount}>${amount}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentLayout: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
  },
  location: {
    color: '#666',
    marginBottom: 6,
  },
  date: {
    color: '#666',
    fontSize: 13,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  icon: {
    height: 36,
    width: 36,
    borderRadius: 6,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
});
