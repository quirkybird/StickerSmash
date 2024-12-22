import { type ImageSource } from 'expo-image';
import { memo, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { clamp } from '@/utils';

type Props = {
  imageSize: number;
  stickerSource: ImageSource;
  id: string;
};

const { width, height } = Dimensions.get('screen');

const EmojiSticker = ({ id, imageSize, stickerSource }: Props) => {
  const scaleImage = useSharedValue(imageSize);
  const startScale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    console.log('我是sticker， 我被更新了' + id);
  });

  // 修改手势处理
  const drag = Gesture.Pan()
    .maxPointers(1)
    .onChange((event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    });

  const scale = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scaleImage.value;
    })
    .onUpdate((e) => {
      const newScale = startScale.value * e.scale;
      const maxScale = Math.min(width / 2, height / 2);
      scaleImage.value = clamp(newScale, imageSize / 2, maxScale);
    })
    .runOnJS(true);

  const composed = Gesture.Simultaneous(drag, scale);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - 40 },
      { translateY: translateY.value - 40 },
    ],
  }));

  const imageStyle = useAnimatedStyle(() => ({
    width: scaleImage.value,
    height: scaleImage.value,
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.imageContainer, containerStyle]}>
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={[imageStyle, { width: imageSize, height: imageSize }]}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export default memo(EmojiSticker, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});
