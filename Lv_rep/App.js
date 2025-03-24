import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LvComponent } from './components/LvComponent';
import { ProductComponent } from './components/ProductComponent';
import CartComponent from './components/CartComponent';
import { CartProvider, useCart } from './components/CartContext';

function HomeScreen() {
  return <LvComponent />;
}

function ProductScreen() {
  return <ProductComponent />;
}

function CartScreen() {
  return <CartComponent />;
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function AppNavigator() {
  // Lấy số lượng giỏ hàng từ context
  const { cartCount } = useCart();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Product') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Product" component={ProductScreen} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          // Nếu cartCount > 0 thì hiển thị badge, ngược lại không hiển thị
          tabBarBadge: cartCount > 0 ? cartCount : null,
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}
