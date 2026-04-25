import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
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
import { Category, Product } from "../types";
import { EmptyState, SkeletonCard } from "../components/StateViews";
import { colors } from "../theme";

const { width } = Dimensions.get("window");
const CARD_GAP = 14;
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

function AnimatedAddButton({
  onPress,
}: {
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    scale.value = withSpring(0.88, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        style={{
          width: 44,
          height: 44,
          borderRadius: 16,
          backgroundColor: colors.ink,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

export default function ShopScreen() {
  const { token, user } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    const productsData = await apiRequest("/products", {}, token);

const loadedProducts = productsData.products || productsData || [];

setProducts(loadedProducts);

const extractedCategories = loadedProducts
  .filter((product: Product) => product.category_id && product.categories?.name)
  .map((product: Product) => ({
    id: product.category_id,
    name: product.categories?.name || "Category",
    slug: product.categories?.slug || product.category_id,
  }));

const uniqueCategories = extractedCategories.filter(
  (category: Category, index: number, self: Category[]) =>
    index === self.findIndex((c) => c.id === category.id)
);

setCategories(uniqueCategories);
  }

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        await loadData();
      } catch (error: any) {
        Alert.alert("Shop failed", error.message);
      } finally {
        setLoading(false);
      }
    }

    run();
  }, []);

  async function onRefresh() {
    try {
      setRefreshing(true);
      await loadData();
    } catch (error: any) {
      Alert.alert("Refresh failed", error.message);
    } finally {
      setRefreshing(false);
    }
  }

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const categoryTabs = useMemo(() => {
    return [{ id: "all", name: "All", slug: "all" }, ...categories];
  }, [categories]);

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
        <SkeletonCard height={42} />
        <SkeletonCard height={64} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <SkeletonCard height={260} />
            <SkeletonCard height={260} />
          </View>
          <View style={{ flex: 1 }}>
            <SkeletonCard height={260} />
            <SkeletonCard height={260} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={{ paddingTop: 58 }}>
            <Animated.View
              entering={FadeInUp.duration(450)}
              style={{ paddingHorizontal: 20 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: colors.muted,
                      fontWeight: "700",
                      fontSize: 15,
                    }}
                  >
                    Hello {user?.name?.split(" ")[0] || "there"} 👋
                  </Text>

                  <Text
                    style={{
                      fontSize: 34,
                      fontWeight: "900",
                      color: colors.ink,
                      marginTop: 4,
                      letterSpacing: -0.8,
                    }}
                  >
                    Discover
                  </Text>
                </View>

                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 18,
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={23}
                    color={colors.ink}
                  />
                </View>
              </View>

              <Text
                style={{
                  color: colors.muted,
                  fontSize: 16,
                  marginTop: 8,
                  lineHeight: 23,
                }}
              >
                Premium products picked for you.
              </Text>

              <View
                style={{
                  marginTop: 22,
                  backgroundColor: "#fff",
                  borderRadius: 24,
                  height: 62,
                  paddingHorizontal: 18,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  shadowColor: "#0F172A",
                  shadowOpacity: 0.06,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 3,
                }}
              >
                <Ionicons name="search-outline" size={23} color="#64748B" />

                <TextInput
                  placeholder="Search products..."
                  placeholderTextColor="#94A3B8"
                  value={search}
                  onChangeText={setSearch}
                  returnKeyType="search"
                  onSubmitEditing={Keyboard.dismiss}
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 16,
                    color: colors.ink,
                    fontWeight: "600",
                  }}
                />

                {search.length > 0 ? (
                  <Pressable onPress={() => setSearch("")}>
                    <Ionicons name="close-circle" size={22} color="#94A3B8" />
                  </Pressable>
                ) : (
                  <Ionicons name="options-outline" size={22} color="#94A3B8" />
                )}
              </View>
            </Animated.View>

            <FlatList
              horizontal
              data={categoryTabs}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 18,
              }}
              renderItem={({ item }) => {
                const active = selectedCategory === item.id;

                return (
                  <Pressable
                    onPress={() => setSelectedCategory(item.id)}
                    style={{
                      paddingHorizontal: 18,
                      height: 42,
                      borderRadius: 999,
                      marginRight: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: active ? colors.primary : "#fff",
                      borderWidth: 1,
                      borderColor: active ? colors.primary : "#E2E8F0",
                      shadowColor: active ? colors.primary : "#0F172A",
                      shadowOpacity: active ? 0.18 : 0.04,
                      shadowRadius: active ? 12 : 8,
                      shadowOffset: { width: 0, height: 5 },
                      elevation: active ? 3 : 1,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        color: active ? "#fff" : colors.ink,
                        fontWeight: "900",
                        fontSize: 14,
                      }}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
            />

            {visibleProducts.length > 0 && (
              <View
                style={{
                  paddingHorizontal: 20,
                  marginBottom: 14,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: colors.ink,
                      fontSize: 20,
                      fontWeight: "900",
                    }}
                  >
                    Popular Products
                  </Text>
                  <Text style={{ color: colors.muted, marginTop: 3 }}>
                    {visibleProducts.length} item
                    {visibleProducts.length > 1 ? "s" : ""} available
                  </Text>
                </View>

                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: "900",
                  }}
                >
                  View all
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={{ height: 430 }}>
            <EmptyState
              title="No products found"
              message="Try changing the search keyword or choose another category."
            />
          </View>
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
        columnWrapperStyle={{
          gap: CARD_GAP,
        }}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 55).duration(380)}
            style={{
              width: CARD_WIDTH,
              backgroundColor: "#fff",
              borderRadius: 28,
              padding: 12,
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
            <View>
              <Image
                source={{ uri: item.image_url }}
                style={{
                  width: "100%",
                  height: 145,
                  borderRadius: 22,
                  backgroundColor: "#E5E7EB",
                }}
                resizeMode="cover"
              />

              <Pressable
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: "rgba(255,255,255,0.92)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="heart-outline" size={19} color={colors.ink} />
              </Pressable>
            </View>

            <Text
              numberOfLines={1}
              style={{
                marginTop: 12,
                fontSize: 16,
                fontWeight: "900",
                color: colors.ink,
              }}
            >
              {item.name}
            </Text>

            <Text
              numberOfLines={1}
              style={{
                color: colors.muted,
                fontWeight: "700",
                marginTop: 3,
                fontSize: 12,
              }}
            >
              {item.categories?.name || "Mini Shop"}
            </Text>

            <View
              style={{
                marginTop: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: "900",
                    fontSize: 16,
                  }}
                >
                  EGP {Number(item.price).toFixed(0)}
                </Text>
              </View>

              <AnimatedAddButton onPress={() => addToCart(item)} />
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
}