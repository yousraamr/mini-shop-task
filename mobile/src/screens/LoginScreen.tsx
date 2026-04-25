import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState("customer@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error: any) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", padding: 24 }}
    >
      <Text style={{ fontSize: 32, fontWeight: "800", color: "#111827" }}>
        Mini Shop
      </Text>
      <Text style={{ marginTop: 8, marginBottom: 28, color: "#6b7280" }}>
        Login to continue shopping
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable onPress={handleLogin} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={{ textAlign: "center", marginTop: 18, color: "#2563eb", fontWeight: "700" }}>
          Create new account
        </Text>
      </Pressable>

      <Text style={{ textAlign: "center", marginTop: 14, color: "#9ca3af" }}>
        Forgot password is available through backend API.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = {
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  buttonText: {
  color: "#fff",
  fontWeight: "800" as const,
  textAlign: "center" as const,
  fontSize: 16,
},
};