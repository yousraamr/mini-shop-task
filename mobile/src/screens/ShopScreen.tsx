import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { apiRequest } from "../api/client";
import { useCart } from "../context/CartContext";
import { Category, Product } from "../types";

export default function ShopScreen() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    const query = new URLSearchParams();
    if (search) query.append("search", search);
    if (selectedCategory) query.append("category", selectedCategory);

    const [productsData, categoriesData] = await Promise.all([
      apiRequest(`/products?${query.toString()}`),
      apiRequest("/categories"),
    ]);

    setProducts(productsData.products);
    setCategories(categoriesData.categories);
  }

  async function initialLoad() {
    try {
      setLoading(true);
      await loadData();
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [search, selectedCategory]);

  useEffect(() => {
    initialLoad();
  }, [selectedCategory]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      initialLoad();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#f8fafc" }}>
        {[1, 2, 3, 4].map((item) => (
          <View
            key={item}
            style={{
              height: 120,
              backgroundColor: "#e5e7eb",
              borderRadius: 18,
              marginBottom: 14,
            }}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 16 }}>
      <TextInput
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        style={{
          backgroundColor: "#fff",
          padding: 14,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          marginBottom: 12,
        }}
      />

      <FlatList
        data={[{ id: "all", name: "All", slug: "" }, ...categories]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        style={{ maxHeight: 46, marginBottom: 12 }}
        renderItem={({ item }) => {
          const active = selectedCategory === item.slug;
          return (
            <Pressable
              onPress={() => setSelectedCategory(item.slug)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                backgroundColor: active ? "#2563eb" : "#fff",
                borderRadius: 999,
                marginRight: 8,
                borderWidth: 1,
                borderColor: active ? "#2563eb" : "#e5e7eb",
              }}
            >
              <Text style={{ color: active ? "#fff" : "#111827", fontWeight: "700" }}>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />

      {products.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>No products found</Text>
          <Text style={{ color: "#6b7280", marginTop: 6 }}>Try another search or category.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 18,
                marginBottom: 12,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Image
                source={{ uri: item.image_url }}
                style={{ height: 120, width: "100%", backgroundColor: "#e5e7eb" }}
              />
              <View style={{ padding: 12 }}>
                <Text numberOfLines={1} style={{ fontWeight: "800", color: "#111827" }}>
                  {item.name}
                </Text>
                <Text style={{ marginTop: 4, color: "#2563eb", fontWeight: "800" }}>
                  EGP {item.price}
                </Text>
                <Pressable
                  onPress={() => addToCart(item)}
                  style={{
                    backgroundColor: "#111827",
                    borderRadius: 12,
                    padding: 10,
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>
                    Add
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}