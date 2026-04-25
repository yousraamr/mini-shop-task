import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Order } from "../types";
import { EmptyState, SkeletonCard } from "../components/StateViews";
import { colors } from "../theme";
import { supabase } from "../lib/supabase";

function getStatusStyle(status: string) {
  const value = status?.toLowerCase();

  if (value === "pending") {
    return {
      bg: "#FEF3C7",
      text: "#92400E",
      icon: "time-outline" as const,
      label: "Pending",
    };
  }

  if (value === "processing") {
    return {
      bg: "#DBEAFE",
      text: "#1D4ED8",
      icon: "sync-outline" as const,
      label: "Processing",
    };
  }

  if (value === "completed" || value === "delivered") {
    return {
      bg: "#DCFCE7",
      text: "#166534",
      icon: "checkmark-circle-outline" as const,
      label: "Delivered",
    };
  }

  if (value === "cancelled" || value === "canceled") {
    return {
      bg: "#FEE2E2",
      text: "#991B1B",
      icon: "close-circle-outline" as const,
      label: "Cancelled",
    };
  }

  return {
    bg: "#E2E8F0",
    text: "#334155",
    icon: "receipt-outline" as const,
    label: status || "Order",
  };
}

export default function OrdersScreen({ navigation }: any) {
  const { token, user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadOrders() {
    const data = await apiRequest("/orders/my", {}, token);
    setOrders(data.orders || []);
  }

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function run() {
        try {
          setLoading(true);
          await loadOrders();
        } catch (error: any) {
          if (active) Alert.alert("Orders failed", error.message);
        } finally {
          if (active) setLoading(false);
        }
      }

      run();

      return () => {
        active = false;
      };
    }, [token])
  );

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`customer-orders-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        async (payload: any) => {
          const updatedOrder = payload.new as Partial<Order>;

          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === updatedOrder.id
                ? {
                    ...order,
                    ...updatedOrder,
                  }
                : order
            )
          );

          await loadOrders();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `customer_id=eq.${user.id}`,
        },
        async () => {
          await loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, token]);

  async function onRefresh() {
    try {
      setRefreshing(true);
      await loadOrders();
    } catch (error: any) {
      Alert.alert("Refresh failed", error.message);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8FAFC",
          paddingTop: 58,
          paddingHorizontal: 20,
        }}
      >
        <SkeletonCard height={45} />
        <SkeletonCard height={145} />
        <SkeletonCard height={145} />
        <SkeletonCard height={145} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: 58 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 34,
              fontWeight: "900",
              color: colors.ink,
              letterSpacing: -0.8,
            }}
          >
            My Orders
          </Text>

          <Text style={{ color: colors.muted, marginTop: 6, fontSize: 16 }}>
            Track your purchases and order status.
          </Text>
        </View>

        <EmptyState
          title="No orders yet"
          message="Your placed orders will appear here after checkout."
          actionText="Start Shopping"
          onAction={() => navigation.getParent()?.navigate("Shop")}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingTop: 58,
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <Animated.View entering={FadeInUp.duration(450)}>
            <View style={{ marginBottom: 22 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 34,
                      fontWeight: "900",
                      color: colors.ink,
                      letterSpacing: -0.8,
                    }}
                  >
                    My Orders
                  </Text>

                  <Text
                    style={{
                      color: colors.muted,
                      marginTop: 6,
                      fontSize: 16,
                    }}
                  >
                    {orders.length} order{orders.length > 1 ? "s" : ""} in your
                    history
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#DCFCE7",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#16A34A",
                      marginRight: 6,
                    }}
                  />

                  <Text
                    style={{
                      color: "#166534",
                      fontWeight: "900",
                      fontSize: 12,
                    }}
                  >
                    Live
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        }
        renderItem={({ item, index }) => {
          const status = getStatusStyle(item.status);
          const orderItems = item.order_items || [];

          const itemsCount = orderItems.reduce(
            (sum: number, orderItem: any) =>
              sum + Number(orderItem.quantity || 0),
            0
          );

          return (
            <Animated.View entering={FadeInDown.delay(index * 70).duration(380)}>
              <Pressable
                onPress={() => navigation.navigate("OrderDetail", { order: item })}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 28,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  shadowColor: "#0F172A",
                  shadowOpacity: 0.07,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        fontWeight: "900",
                        letterSpacing: 0.7,
                        textTransform: "uppercase",
                      }}
                    >
                      Order ID
                    </Text>

                    <Text
                      style={{
                        color: colors.ink,
                        fontSize: 20,
                        fontWeight: "900",
                        marginTop: 4,
                      }}
                    >
                      #{item.id.slice(0, 8)}
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: status.bg,
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                      borderRadius: 999,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name={status.icon} size={15} color={status.text} />
                    <Text
                      style={{
                        marginLeft: 5,
                        color: status.text,
                        fontWeight: "900",
                        fontSize: 12,
                      }}
                    >
                      {status.label}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 18,
                    backgroundColor: "#F8FAFC",
                    borderRadius: 22,
                    padding: 14,
                  }}
                >
                  <View style={styles.infoRow}>
                    <View>
                      <Text style={styles.infoLabel}>Date</Text>
                      <Text style={styles.infoValue}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.infoLabel}>Items</Text>
                      <Text style={styles.infoValue}>
                        {itemsCount || orderItems.length}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.infoLabel}>Total</Text>
                      <Text style={[styles.infoValue, { color: colors.primary }]}>
                        EGP {Number(item.total_amount).toFixed(0)}
                      </Text>
                    </View>
                  </View>
                </View>

                {orderItems.length > 0 && (
                  <View style={{ marginTop: 14 }}>
                    {orderItems.slice(0, 2).map((orderItem: any) => (
                      <Text
                        key={orderItem.id}
                        numberOfLines={1}
                        style={{
                          color: "#475569",
                          fontWeight: "700",
                          marginBottom: 4,
                        }}
                      >
                        • {orderItem.products?.name || "Product"} ×{" "}
                        {orderItem.quantity}
                      </Text>
                    ))}

                    {orderItems.length > 2 && (
                      <Text style={{ color: colors.muted, fontWeight: "800" }}>
                        +{orderItems.length - 2} more item
                        {orderItems.length - 2 > 1 ? "s" : ""}
                      </Text>
                    )}
                  </View>
                )}

                <View
                  style={{
                    marginTop: 16,
                    paddingTop: 14,
                    borderTopWidth: 1,
                    borderTopColor: "#E2E8F0",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: status.text,
                        marginRight: 8,
                      }}
                    />
                    <Text style={{ color: colors.muted, fontWeight: "800" }}>
                      Live status enabled
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={colors.primary}
                  />
                </View>
              </Pressable>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = {
  infoRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700" as const,
  },
  infoValue: {
    color: colors.ink,
    fontWeight: "900" as const,
    marginTop: 4,
  },
};