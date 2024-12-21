import { type ImageSource } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { clamp } from '@/utils';

type Props = {
  imageSize: number;
  stickerSource: ImageSource;
};
const { width, height } = Dimensions.get('screen');

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);
  const startScale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // 捏合手势
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
  // 拖动手势
  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value - 40,
        },
        {
          translateY: translateY.value - 40,
        },
      ],
    };
  });

  const composed = Gesture.Simultaneous(drag, scale);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[containerStyle, styles.imageContainer]}>
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={[imageStyle, { width: imageSize, height: imageSize }]}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
