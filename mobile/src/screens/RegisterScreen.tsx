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

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing details", "Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
    } catch (error: any) {
      Alert.alert("Register failed", error.message);
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
            <Ionicons name="person-add-outline" size={34} color="#fff" />
          </View>

          <Text
            style={{
              fontSize: 38,
              fontWeight: "900",
              color: colors.ink,
              letterSpacing: -1,
            }}
          >
            Create Account
          </Text>

          <Text
            style={{
              color: colors.muted,
              marginTop: 8,
              fontSize: 16,
              lineHeight: 23,
            }}
          >
            Join Mini Shop and start ordering in seconds.
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
            <Ionicons name="person-outline" size={21} color="#94A3B8" />
            <TextInput
              placeholder="Full name"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>

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

          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={21} color="#94A3B8" />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <AnimatedButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(450)}>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                textAlign: "center",
                marginTop: 22,
                color: colors.muted,
                fontWeight: "700",
              }}
            >
              Already have an account?{" "}
              <Text style={{ color: colors.primary, fontWeight: "900" }}>
                Login
              </Text>
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