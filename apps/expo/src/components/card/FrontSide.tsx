import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CardWrapper from './CardWrapper';

type FrontSideProps = {
  handleFlip?: () => void;
};

export default memo<FrontSideProps>(function FrontSide({handleFlip}) {
  return (
    <CardWrapper colors={backgroundGradient} handleFlip={handleFlip}>
      <View style={styles.cardContent}>
        <View style={[styles.cardMask, styles.cardNumber]} />
        <View style={[styles.cardMask, styles.cardNumber]} />
        <View style={[styles.cardMask, styles.cardNumber]} />
        <Text style={styles.cardText}>6538</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={[styles.cardMask, styles.cardCode]} />
        <Text style={styles.cardText}>/</Text>
        <View style={[styles.cardMask, styles.cardCode]} />
      </View>
    </CardWrapper>
  );
});

const backgroundGradient = ['rgba(0,0,0,0.7)', 'black'];

const styles = StyleSheet.create({
  cardText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    marginRight: 8,
  },
  cardMask: {
    backgroundColor: '#888',
    borderRadius: 4,
    opacity: 0.5,
    height: 20,
    marginRight: 8,
  },
  cardNumber: {
    width: 48,
  },
  cardCode: {
    width: 36,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
