import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import AnimatedButton from "../components/AnimatedButton";
import { EmptyState } from "../components/StateViews";
import { colors } from "../theme";

function QuantityButton({
  icon,
  onPress,
}: {
  icon: "add" | "remove";
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    scale.value = withSpring(0.85, {}, () => {
      scale.value = withSpring(1);
    });

    onPress();
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        style={{
          width: 36,
          height: 36,
          borderRadius: 14,
          backgroundColor: "#F1F5F9",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "#E2E8F0",
        }}
      >
        <Ionicons name={icon} size={18} color={colors.ink} />
      </Pressable>
    </Animated.View>
  );
}

export default function CartScreen({ navigation }: any) {
  const { token } = useAuth();
  const { items, increase, decrease, clearCart, subtotal } = useCart();
  const [loading, setLoading] = useState(false);

  const deliveryFee = items.length > 0 ? 25 : 0;
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  async function checkout() {
    try {
      setLoading(true);

      const data = await apiRequest(
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

      navigation.navigate("OrderConfirmation", {
        orderId: data.order?.id,
        total,
      });
    } catch (error: any) {
      Alert.alert("Checkout failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
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
            My Cart
          </Text>

          <Text style={{ color: colors.muted, marginTop: 6, fontSize: 16 }}>
            Your selected products will appear here.
          </Text>
        </View>

        <EmptyState
          title="Your cart is empty"
          message="Start shopping and add products to your cart."
          actionText="Go Shopping"
          onAction={() => navigation.getParent()?.navigate("Shop")}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 58,
          paddingHorizontal: 20,
          paddingBottom: 170,
          flexGrow: 1,
        }}
        ListHeaderComponent={
          <Animated.View entering={FadeInUp.duration(450)}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 22,
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
                  My Cart
                </Text>

                <Text
                  style={{
                    color: colors.muted,
                    marginTop: 6,
                    fontSize: 16,
                  }}
                >
                  {items.length} item{items.length > 1 ? "s" : ""} ready for
                  checkout
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  Alert.alert("Clear cart", "Remove all items from your cart?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Clear",
                      style: "destructive",
                      onPress: clearCart,
                    },
                  ])
                }
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 17,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <Ionicons name="trash-outline" size={21} color={colors.danger} />
              </Pressable>
            </View>
          </Animated.View>
        }
        ListFooterComponent={
          <Animated.View
            entering={FadeInDown.delay(120).duration(420)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 30,
              padding: 18,
              marginTop: 8,
              marginBottom: 30,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              shadowColor: "#0F172A",
              shadowOpacity: 0.1,
              shadowRadius: 22,
              shadowOffset: { width: 0, height: 12 },
              elevation: 6,
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
              Order Summary
            </Text>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  EGP {Number(subtotal).toFixed(0)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>EGP {deliveryFee}</Text>
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#E2E8F0",
                  marginVertical: 12,
                }}
              />

              <View style={[styles.summaryRow, { marginBottom: 0 }]}>
                <Text
                  style={{
                    color: colors.ink,
                    fontSize: 18,
                    fontWeight: "900",
                  }}
                >
                  Total
                </Text>

                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 22,
                    fontWeight: "900",
                  }}
                >
                  EGP {Number(total).toFixed(0)}
                </Text>
              </View>
            </View>

            <AnimatedButton
              title="Checkout"
              onPress={checkout}
              loading={loading}
              disabled={items.length === 0}
              style={{ marginTop: 14 }}
            />
          </Animated.View>
        }
        renderItem={({ item, index }) => {
          const itemTotal = Number(item.product.price) * item.quantity;

          return (
            <Animated.View
              entering={FadeInDown.delay(index * 70).duration(380)}
              style={{
                backgroundColor: "#fff",
                borderRadius: 28,
                padding: 14,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                shadowColor: "#0F172A",
                shadowOpacity: 0.06,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 10 },
                elevation: 3,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{ uri: item.product.image_url }}
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 22,
                    backgroundColor: "#E5E7EB",
                  }}
                  resizeMode="cover"
                />

                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 17,
                          fontWeight: "900",
                          color: colors.ink,
                        }}
                      >
                        {item.product.name}
                      </Text>

                      <Text
                        numberOfLines={1}
                        style={{
                          color: colors.muted,
                          fontWeight: "700",
                          marginTop: 4,
                          fontSize: 12,
                        }}
                      >
                        {item.product.categories?.name || "Mini Shop"}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => {
                        Alert.alert(
                          "Remove item",
                          `Remove ${item.product.name} from your cart?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Remove",
                              style: "destructive",
                              onPress: () => {
                                for (let i = 0; i < item.quantity; i++) {
                                  decrease(item.product.id);
                                }
                              },
                            },
                          ]
                        );
                      }}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 12,
                        backgroundColor: "#FEF2F2",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="close-outline"
                        size={20}
                        color={colors.danger}
                      />
                    </Pressable>
                  </View>

                  <Text
                    style={{
                      color: colors.primary,
                      fontWeight: "900",
                      marginTop: 10,
                      fontSize: 16,
                    }}
                  >
                    EGP {Number(item.product.price).toFixed(0)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTopWidth: 1,
                  borderTopColor: "#E2E8F0",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <QuantityButton
                    icon="remove"
                    onPress={() => decrease(item.product.id)}
                  />

                  <Text
                    style={{
                      marginHorizontal: 16,
                      fontSize: 17,
                      fontWeight: "900",
                      color: colors.ink,
                    }}
                  >
                    {item.quantity}
                  </Text>

                  <QuantityButton
                    icon="add"
                    onPress={() => increase(item.product.id)}
                  />
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    Item total
                  </Text>

                  <Text
                    style={{
                      color: colors.ink,
                      fontWeight: "900",
                      marginTop: 3,
                    }}
                  >
                    EGP {itemTotal.toFixed(0)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = {
  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    padding: 14,
  },
  summaryRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  summaryLabel: {
    color: colors.muted,
    fontWeight: "700" as const,
  },
  summaryValue: {
    color: colors.ink,
    fontWeight: "900" as const,
  },
};