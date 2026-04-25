import React from "react";
import { Text, View, Pressable } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { colors } from "../theme";

export function EmptyState({
  title,
  message,
  actionText,
  onAction,
}: {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <Animated.View
      entering={FadeIn.duration(350)}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "900", color: colors.ink }}>
        {title}
      </Text>
      <Text
        style={{
          color: colors.muted,
          marginTop: 8,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        {message}
      </Text>

      {actionText && onAction && (
        <Pressable
          onPress={onAction}
          style={{
            marginTop: 18,
            backgroundColor: colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "900" }}>{actionText}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

export function SkeletonCard({ height = 120 }: { height?: number }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(350)}
      style={{
        height,
        backgroundColor: "#E5E7EB",
        borderRadius: 22,
        marginBottom: 14,
      }}
    />
  );
}