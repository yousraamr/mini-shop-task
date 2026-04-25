import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import AnimatedButton from "../components/AnimatedButton";
import { colors } from "../theme";

export default function ForgotPasswordScreen({ navigation }: any) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email.trim());
      Alert.alert("Check your email", "Password reset email has been sent.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Reset failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Animated.View entering={FadeInUp.duration(450)}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              width: 46,
              height: 46,
              borderRadius: 17,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#E2E8F0",
              marginBottom: 24,
            }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </Pressable>

          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 26,
              backgroundColor: colors.ink,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Ionicons name="key-outline" size={34} color="#fff" />
          </View>

          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: colors.ink,
              letterSpacing: -1,
            }}
          >
            Reset Password
          </Text>

          <Text
            style={{
              color: colors.muted,
              marginTop: 8,
              fontSize: 16,
              lineHeight: 23,
            }}
          >
            Enter your email and we will send you a password reset link.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(120).duration(450)}
          style={{
            backgroundColor: "#fff",
            borderRadius: 30,
            padding: 18,
            marginTop: 28,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            shadowColor: "#0F172A",
            shadowOpacity: 0.07,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 4,
          }}
        >
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={21} color="#94A3B8" />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <AnimatedButton
            title="Send Reset Email"
            onPress={handleReset}
            loading={loading}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(450)}>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                textAlign: "center",
                marginTop: 22,
                color: colors.primary,
                fontWeight: "900",
              }}
            >
              Back to Login
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  inputBox: {
    height: 58,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: colors.ink,
    fontWeight: "700" as const,
  },
};