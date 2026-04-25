import React, { useState } from "react";
import { Alert, FlatList, Image, Pressable, Text, View } from "react-native";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function CartScreen() {
  const { token } = useAuth();
  const { items, increase, decrease, clearCart, subtotal } = useCart();
  const [loading, setLoading] = useState(false);

  async function checkout() {
    try {
      setLoading(true);

      await apiRequest(
        "/orders",
        {
          method: "POST",
          body: JSON.stringify({
            items: items.map((item) => ({
              product_id: item.product.id,
              quantity: item.quantity,
            })),
          }),
        },
        token
      );

      clearCart();
      Alert.alert("Success", "Your order has been placed successfully.");
    } catch (error: any) {
      Alert.alert("Checkout failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc", padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "800" }}>Your cart is empty</Text>
        <Text style={{ color: "#6b7280", marginTop: 8, textAlign: "center" }}>
          Add products from the shop to start checkout.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 16 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderRadius: 18,
              marginBottom: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <Image
              source={{ uri: item.product.image_url }}
              style={{ width: 76, height: 76, borderRadius: 14, backgroundColor: "#e5e7eb" }}
            />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: "800", fontSize: 15 }}>{item.product.name}</Text>
              <Text style={{ color: "#2563eb", fontWeight: "800", marginTop: 4 }}>
                EGP {item.product.price}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <Pressable onPress={() => decrease(item.product.id)} style={styles.qtyBtn}>
                  <Text style={styles.qtyText}>-</Text>
                </Pressable>

                <Text style={{ marginHorizontal: 14, fontWeight: "800" }}>
                  {item.quantity}
                </Text>

                <Pressable onPress={() => increase(item.product.id)} style={styles.qtyBtn}>
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <View
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}>
          <Text style={{ color: "#6b7280", fontSize: 16 }}>Subtotal</Text>
          <Text style={{ fontWeight: "900", fontSize: 18 }}>EGP {subtotal}</Text>
        </View>

        <Pressable
          onPress={checkout}
          disabled={loading}
          style={{
            backgroundColor: "#2563eb",
            padding: 16,
            borderRadius: 14,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "900" }}>
            {loading ? "Placing order..." : "Checkout"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = {
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#111827",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  qtyText: {
    color: "#fff",
    fontWeight: "900" as const,
    fontSize: 18,
  },
};