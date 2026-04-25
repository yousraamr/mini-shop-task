import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ShopScreen from "../screens/ShopScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const OrdersStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();

function OrdersNavigator() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="OrdersList" component={OrdersScreen} />
      <OrdersStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrdersStack.Navigator>
  );
}

function CartNavigator() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CartMain" component={CartScreen} />
      <CartStack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
      />
    </CartStack.Navigator>
  );
}

function TabIcon({
  focused,
  icon,
  label,
}: {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        paddingTop: 6,
      }}
    >
      <View
        style={{
          width: focused ? 44 : 38,
          height: focused ? 34 : 30,
          borderRadius: 999,
          backgroundColor: focused ? "#EFF6FF" : "transparent",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 3,
        }}
      >
        <Ionicons
          name={icon}
          size={focused ? 23 : 21}
          color={focused ? colors.primary : "#94A3B8"}
        />
      </View>

      <Text
        numberOfLines={1}
        style={{
          color: focused ? colors.primary : "#94A3B8",
          fontSize: 11,
          fontWeight: focused ? "900" : "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: Platform.OS === "ios" ? 24 : 16,
          height: 76,
          borderRadius: 30,
          borderTopWidth: 0,
          backgroundColor: "#FFFFFF",
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: 8,
          shadowColor: "#0F172A",
          shadowOpacity: 0.12,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          elevation: 12,
        },
        tabBarItemStyle: {
          height: 60,
          borderRadius: 24,
        },
        tabBarIcon: ({ focused }) => {
          const tabs: Record<
            string,
            { icon: keyof typeof Ionicons.glyphMap; label: string }
          > = {
            Shop: {
              icon: focused ? "storefront" : "storefront-outline",
              label: "Shop",
            },
            Cart: {
              icon: focused ? "bag" : "bag-outline",
              label: "Cart",
            },
            Orders: {
              icon: focused ? "receipt" : "receipt-outline",
              label: "Orders",
            },
            Profile: {
              icon: focused ? "person" : "person-outline",
              label: "Profile",
            },
          };

          const current = tabs[route.name];

          return (
            <TabIcon
              focused={focused}
              icon={current.icon}
              label={current.label}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Cart" component={CartNavigator} />
      <Tab.Screen name="Orders" component={OrdersNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#F8FAFC",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={Tabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}