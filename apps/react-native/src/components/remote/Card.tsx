import React, {
  forwardRef,
  useRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import {StyleSheet} from 'react-native';
import CardFlip, {type FlipCardProps} from 'react-native-card-flip';

import {FrontSide, BackSide, type CardFlipEvents} from '@/components';

export default forwardRef<CardFlipEvents, FlipCardProps>(function Card(
  props,
  ref,
) {
  const cardRef = useRef<CardFlip | null>(null);

  useImperativeHandle(ref, () => ({
    flip: () => cardRef?.current?.flip(),
    tip: args => cardRef.current?.tip(args),
    jiggle: args => cardRef.current?.jiggle(args),
  }));

  const handleFlip = useCallback(() => {
    cardRef?.current?.flip();
  }, []);

  return (
    // @ts-ignore
    <CardFlip
      ref={cardRef}
      flipZoom={-0.15}
      style={styles.container}
      {...props}>
      <FrontSide handleFlip={handleFlip} />
      <BackSide handleFlip={handleFlip} />
    </CardFlip>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 24,
    borderRadius: 12,
  },
});
