import { View, Text, Pressable, StyleSheet } from 'react-native';
import { PropsWithChildren, useEffect } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
} from 'react-native-reanimated';
import React from 'react';

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function EmojiPicker({ isVisible, children, onClose }: Props) {
  return (
    // <Modal
    //   animationType="slide"
    //   transparent={true}
    //   visible={isVisible}
    //   presentationStyle="formSheet"
    // >
    <>
      {isVisible && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.modalContent}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Choose a sticker</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" color="#fff" size={22} />
            </Pressable>
          </View>
          {children}
        </Animated.View>
      )}
    </>

    // </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '25%',
    width: '100%',
    backgroundColor: '#25292e',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'fixed',
    top: 0,
  },
  titleContainer: {
    height: '16%',
    backgroundColor: '#464C55',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
});
