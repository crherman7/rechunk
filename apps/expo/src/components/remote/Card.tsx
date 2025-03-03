'use rechunk';

import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {BackSide, FrontSide} from '@/components';

export default function Card() {
  const progress = useSharedValue(0);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      progress.value,
      [0, 1],
      [0, Math.PI],
      Extrapolation.CLAMP,
    );

    return {transform: [{rotateY: `${rotateY}rad`}]};
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      progress.value,
      [0, 1],
      [Math.PI, 2 * Math.PI],
      Extrapolation.CLAMP,
    );

    return {transform: [{rotateY: `${rotateY}rad`}]};
  });

  const flipCard = () => {
    progress.value = withSpring(progress.value ? 0 : 1, {
      duration: 900,
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.cardContainer} onPress={flipCard}>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <FrontSide />
        </Animated.View>
        <Animated.View style={[styles.card, backAnimatedStyle]}>
          <BackSide />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {height: 200, width: '100%'},
  card: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    borderRadius: 8,
  },
});
