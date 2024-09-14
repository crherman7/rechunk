import React, {memo, type PropsWithChildren} from 'react';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import LinearGradient, {
  type LinearGradientProps,
} from 'react-native-linear-gradient';

interface CardWrapperProps {
  colors: LinearGradientProps['colors'];
  handleFlip?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
}

export default memo<PropsWithChildren<CardWrapperProps>>(function CardWrapper({
  children,
  colors,
  contentStyle,
  handleFlip,
}) {
  return (
    <LinearGradient colors={colors} style={styles.container}>
      <Pressable style={[styles.content, contentStyle]} onPress={handleFlip}>
        {children}
      </Pressable>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  content: {
    height: 200,
  },
});
