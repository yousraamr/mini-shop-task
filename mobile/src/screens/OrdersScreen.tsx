import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Order } from "../types";

export default function OrdersScreen() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadOrders() {
    const data = await apiRequest("/orders/my", {}, token);
    setOrders(data.orders);
  }

  useFocusEffect(
    useCallback(() => {
      async function run() {
        try {
          setLoading(true);
          await loadOrders();
        } finally {
          setLoading(false);
        }
      }

      run();
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 16 }}>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            style={{
              height: 120,
              borderRadius: 18,
              backgroundColor: "#e5e7eb",
              marginBottom: 12,
            }}
          />
        ))}
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "900" }}>No orders yet</Text>
        <Text style={{ color: "#6b7280", textAlign: "center", marginTop: 8 }}>
          Your placed orders will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 16 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 18,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "900", fontSize: 16 }}>
                Order #{item.id.slice(0, 8)}
              </Text>

              <View
                style={{
                  backgroundColor:
                    item.status === "Pending"
                      ? "#fef3c7"
                      : item.status === "Processing"
                      ? "#dbeafe"
                      : "#dcfce7",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                }}
              >
                <Text style={{ fontWeight: "800", color: "#111827" }}>
                  {item.status}
                </Text>
              </View>
            </View>

            <Text style={{ color: "#6b7280", marginTop: 8 }}>
              {new Date(item.created_at).toLocaleString()}
            </Text>

            <Text style={{ fontWeight: "900", marginTop: 8 }}>
              Total: EGP {item.total_amount}
            </Text>

            <View style={{ marginTop: 12 }}>
              {item.order_items?.map((orderItem: any) => (
                <Text key={orderItem.id} style={{ color: "#374151", marginBottom: 4 }}>
                  • {orderItem.products?.name} × {orderItem.quantity}
                </Text>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}