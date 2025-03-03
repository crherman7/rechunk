import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';

export default memo(function BackSide() {
  return (
    <LinearGradient colors={backgroundGradient} style={styles.gradient}>
      <LinearGradient
        start={{x: 0, y: 0.1}}
        end={{x: 0.5, y: 1.0}}
        locations={[0, 0.4, 0.75, 1]}
        colors={magneticBarGradient}
        style={styles.magneticBar}
      />
      <View style={styles.layout}>
        <View style={styles.cardHolder}>
          <Text style={styles.cardText}>Card holder</Text>
          <View style={[styles.cardMask, styles.cardHolderMask]} />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardText, styles.cardCVV]}>CCV2</Text>
          <View style={[styles.cardMask, styles.cardCode]} />
        </View>
      </View>
    </LinearGradient>
  );
});

const backgroundGradient = ['rgba(32,32,32,0.7)', '#333'];
const magneticBarGradient = ['#000', '#111', '#333', '#000'];

const styles = StyleSheet.create({
  gradient: {height: '100%', width: '100%'},
  content: {paddingTop: 32},
  cardText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  cardMask: {
    backgroundColor: '#888',
    borderRadius: 4,
    opacity: 0.5,
    height: 20,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHolder: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  cardHolderMask: {
    width: 120,
  },
  cardCode: {
    width: 36,
  },
  cardCVV: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  magneticBar: {
    height: 48,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 12,
  },
});
