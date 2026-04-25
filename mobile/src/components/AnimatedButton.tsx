import React from "react";
import { Pressable, Text, ActivityIndicator, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { colors } from "../theme";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  danger?: boolean;
};

export default function AnimatedButton({
  title,
  onPress,
  loading,
  disabled,
  style,
  danger,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={disabled || loading}
        onPressIn={() => {
          scale.value = withSpring(0.96);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
        style={[
          {
            backgroundColor: danger ? colors.danger : colors.primary,
            padding: 16,
            borderRadius: 18,
            opacity: disabled ? 0.6 : 1,
            alignItems: "center",
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
            {title}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}