import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

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

export default function OrderDetailScreen({ navigation, route }: any) {
  const order = route.params.order;
  const status = getStatusStyle(order.status);
  const orderItems = order.order_items || [];

  const itemsCount = orderItems.reduce(
    (sum: number, item: any) => sum + Number(item.quantity || 0),
    0
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <FlatList
        data={orderItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 54,
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <Animated.View entering={FadeInUp.duration(450)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 22,
              }}
            >
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
                  marginRight: 14,
                }}
              >
                <Ionicons name="chevron-back" size={24} color={colors.ink} />
              </Pressable>

              <View>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "900",
                    color: colors.ink,
                    letterSpacing: -0.8,
                  }}
                >
                  Order Details
                </Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>
                  Receipt and item summary
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: colors.ink,
                borderRadius: 30,
                padding: 20,
                marginBottom: 18,
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
                      color: "#94A3B8",
                      fontWeight: "900",
                      fontSize: 12,
                      letterSpacing: 0.7,
                      textTransform: "uppercase",
                    }}
                  >
                    Order ID
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 24,
                      fontWeight: "900",
                      marginTop: 5,
                    }}
                  >
                    #{order.id.slice(0, 8)}
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
                      color: status.text,
                      marginLeft: 5,
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
                  marginTop: 24,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: 22,
                  padding: 16,
                }}
              >
                <View style={styles.darkRow}>
                  <Text style={styles.darkLabel}>Date</Text>
                  <Text style={styles.darkValue}>
                    {new Date(order.created_at).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.darkRow}>
                  <Text style={styles.darkLabel}>Items</Text>
                  <Text style={styles.darkValue}>{itemsCount}</Text>
                </View>

                <View style={[styles.darkRow, { marginBottom: 0 }]}>
                  <Text style={styles.darkLabel}>Total</Text>
                  <Text
                    style={{
                      color: "#93C5FD",
                      fontWeight: "900",
                      fontSize: 20,
                    }}
                  >
                    EGP {Number(order.total_amount).toFixed(0)}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                color: colors.ink,
                fontSize: 20,
                fontWeight: "900",
                marginBottom: 14,
              }}
            >
              Ordered Items
            </Text>
          </Animated.View>
        }
        renderItem={({ item, index }) => {
          const name = item.products?.name || "Product";
          const quantity = Number(item.quantity || 0);
          const price = Number(item.products?.price || 0);
          const itemTotal = price * quantity;

          return (
            <Animated.View
              entering={FadeInDown.delay(index * 70).duration(380)}
              style={{
                backgroundColor: "#fff",
                borderRadius: 26,
                padding: 16,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                shadowColor: "#0F172A",
                shadowOpacity: 0.06,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 3,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 18,
                    backgroundColor: "#EFF6FF",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons name="cube-outline" size={25} color={colors.primary} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: colors.ink,
                      fontSize: 16,
                      fontWeight: "900",
                    }}
                  >
                    {name}
                  </Text>

                  <Text
                    style={{
                      color: colors.muted,
                      fontWeight: "700",
                      marginTop: 4,
                    }}
                  >
                    Quantity: {quantity}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    Total
                  </Text>
                  <Text
                    style={{
                      color: colors.primary,
                      fontWeight: "900",
                      marginTop: 4,
                    }}
                  >
                    EGP {itemTotal ? itemTotal.toFixed(0) : "--"}
                  </Text>
                </View>
              </View>
            </Animated.View>
          );
        }}
        ListFooterComponent={
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 28,
              padding: 18,
              marginTop: 4,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              shadowColor: "#0F172A",
              shadowOpacity: 0.07,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 10 },
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: colors.ink,
                fontSize: 20,
                fontWeight: "900",
                marginBottom: 16,
              }}
            >
              Payment Summary
            </Text>

            <View style={styles.lightRow}>
              <Text style={styles.lightLabel}>Items</Text>
              <Text style={styles.lightValue}>{itemsCount}</Text>
            </View>

            <View style={styles.lightRow}>
              <Text style={styles.lightLabel}>Status</Text>
              <Text style={[styles.lightValue, { color: status.text }]}>
                {status.label}
              </Text>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: "#E2E8F0",
                marginVertical: 12,
              }}
            />

            <View style={[styles.lightRow, { marginBottom: 0 }]}>
              <Text
                style={{
                  color: colors.ink,
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                Total Paid
              </Text>

              <Text
                style={{
                  color: colors.primary,
                  fontSize: 22,
                  fontWeight: "900",
                }}
              >
                EGP {Number(order.total_amount).toFixed(0)}
              </Text>
            </View>
          </Animated.View>
        }
      />
    </View>
  );
}

const styles = {
  darkRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 14,
  },
  darkLabel: {
    color: "#94A3B8",
    fontWeight: "800" as const,
  },
  darkValue: {
    color: "#fff",
    fontWeight: "900" as const,
    maxWidth: "62%" as const,
    textAlign: "right" as const,
  },
  lightRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  lightLabel: {
    color: colors.muted,
    fontWeight: "800" as const,
  },
  lightValue: {
    color: colors.ink,
    fontWeight: "900" as const,
  },
};