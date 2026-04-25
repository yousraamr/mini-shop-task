import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  async function handleLogout() {
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
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 24 }}>
      <View
        style={{
          backgroundColor: "#111827",
          borderRadius: 24,
          padding: 24,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900" }}>
          {user?.name}
        </Text>
        <Text style={{ color: "#cbd5e1", marginTop: 8 }}>{user?.email}</Text>
        <Text style={{ color: "#93c5fd", marginTop: 8, fontWeight: "800" }}>
          Role: {user?.role}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 18,
          marginTop: 18,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        <Text style={{ fontWeight: "900", fontSize: 18 }}>Account</Text>
        <Text style={{ color: "#6b7280", marginTop: 8 }}>
          Your token is stored securely using Expo SecureStore.
        </Text>
      </View>

      <Pressable
        onPress={handleLogout}
        style={{
          backgroundColor: "#ef4444",
          padding: 16,
          borderRadius: 16,
          marginTop: 24,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "900" }}>
          Logout
        </Text>
      </Pressable>
    </View>
  );
}