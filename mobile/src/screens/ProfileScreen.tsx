import React from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import AnimatedButton from "../components/AnimatedButton";
import { colors } from "../theme";

function getInitials(name?: string) {
  if (!name) return "U";

  const parts = name.trim().split(" ");

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 58,
        paddingHorizontal: 20,
        paddingBottom: 40,
      }}
    >
      <Animated.View entering={FadeInUp.duration(450)}>
        <Text
          style={{
            fontSize: 34,
            fontWeight: "900",
            color: colors.ink,
            letterSpacing: -0.8,
          }}
        >
          Profile
        </Text>

        <Text style={{ color: colors.muted, marginTop: 6, fontSize: 16 }}>
          Your account details and secure session.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(100).duration(420)}
        style={{
          backgroundColor: colors.ink,
          borderRadius: 32,
          padding: 22,
          marginTop: 24,
          shadowColor: "#0F172A",
          shadowOpacity: 0.18,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 14 },
          elevation: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 74,
              height: 74,
              borderRadius: 26,
              backgroundColor: "#EFF6FF",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontSize: 26,
                fontWeight: "900",
              }}
            >
              {getInitials(user?.name)}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                color: "#fff",
                fontSize: 23,
                fontWeight: "900",
              }}
            >
              {user?.name || "Customer"}
            </Text>

            <Text
              numberOfLines={1}
              style={{
                color: "#CBD5E1",
                marginTop: 5,
                fontWeight: "700",
              }}
            >
              {user?.email || "customer@email.com"}
            </Text>

            <View
              style={{
                alignSelf: "flex-start",
                marginTop: 10,
                backgroundColor: "rgba(147,197,253,0.16)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={15}
                color="#93C5FD"
              />

              <Text
                style={{
                  color: "#93C5FD",
                  fontWeight: "900",
                  marginLeft: 5,
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "customer"}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: "rgba(255,255,255,0.12)",
            marginVertical: 20,
          }}
        />

        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 22,
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="lock-closed-outline" size={22} color="#93C5FD" />

          <Text
            style={{
              color: "#CBD5E1",
              marginLeft: 10,
              flex: 1,
              fontWeight: "700",
              lineHeight: 20,
            }}
          >
            Your session token is securely stored using Expo SecureStore.
          </Text>
        </View>
      </Animated.View>


      <Animated.View entering={FadeInUp.delay(250).duration(420)}>
        <AnimatedButton
          title="Logout"
          onPress={handleLogout}
          danger
          style={{ marginTop: 24 }}
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = {
  row: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  label: {
    color: colors.muted,
    fontWeight: "800" as const,
  },
  value: {
    color: colors.ink,
    fontWeight: "900" as const,
    maxWidth: "62%" as const,
    textAlign: "right" as const,
  },
};