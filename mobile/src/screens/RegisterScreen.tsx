import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", padding: 24 }}
    >
      <Text style={{ fontSize: 32, fontWeight: "800", color: "#111827" }}>
        Create Account
      </Text>
      <Text style={{ marginTop: 8, marginBottom: 28, color: "#6b7280" }}>
        Join Mini Shop and place your first order
      </Text>

      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
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

      <Pressable onPress={handleRegister} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Register"}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={{ textAlign: "center", marginTop: 18, color: "#2563eb", fontWeight: "700" }}>
          Already have an account? Login
        </Text>
      </Pressable>
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