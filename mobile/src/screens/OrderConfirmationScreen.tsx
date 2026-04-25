import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import AnimatedButton from "../components/AnimatedButton";
import { colors } from "../theme";

export default function OrderConfirmationScreen({ navigation, route }: any) {
  const total = route.params?.total;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Animated.View entering={ZoomIn.duration(450)}>
        <View
          style={{
            width: 94,
            height: 94,
            borderRadius: 47,
            backgroundColor: "#DCFCE7",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="checkmark" size={52} color={colors.success} />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(150).duration(450)}
        style={{ alignItems: "center" }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "900",
            color: colors.ink,
            marginTop: 24,
          }}
        >
          Order Confirmed
        </Text>

        <Text
          style={{
            color: colors.muted,
            textAlign: "center",
            marginTop: 8,
            lineHeight: 22,
          }}
        >
          Your order has been placed successfully.
        </Text>

        <Text style={{ marginTop: 16, fontWeight: "900", fontSize: 20 }}>
          EGP {Number(total || 0).toFixed(2)}
        </Text>

        <AnimatedButton
          title="View Orders"
          onPress={() => navigation.getParent()?.navigate("Orders")}
          style={{ marginTop: 28, width: 220 }}
        />
      </Animated.View>
    </View>
  );
}