import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LvComponent } from './components/LvComponent';
import { ProductComponent } from './components/ProductComponent';
import CartComponent from './components/CartComponent';
import PaymentScreen from './components/PaymentScreen';
import { CartProvider, useCart } from './components/CartContext';
import { NewsComponent } from './components/NewsComponent';
import { NewsStackScreen } from './components/NewsStack';
import VnPayScreen from './components/VnPayScreen';

function HomeScreen() {
  return <LvComponent />;
}

function ProductScreen() {
  return <ProductComponent />;
}

function NewsScreen() {
  return <NewsComponent />;
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

// Tạo Stack Navigator cho Cart
const CartStack = createStackNavigator();

function CartStackScreen() {
  return (
    <CartStack.Navigator>
      <CartStack.Screen name="CartMain" component={CartComponent} options={{ title: 'Giỏ hàng' }} />
      <CartStack.Screen name="PaymentScreen" component={PaymentScreen} options={{ title: 'Thanh toán' }} />
      <CartStack.Screen
  name="VnPayScreen"
  component={VnPayScreen}
  options={{ title: 'Thanh toán VnPay' }}
/>
    </CartStack.Navigator>
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
          } else if (route.name === 'News') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
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
        component={CartStackScreen}
        options={{
          tabBarBadge: cartCount > 0 ? cartCount : null,
          headerShown: false,
        }}
      />
      <Tab.Screen name="News" component={NewsStackScreen} options={{ headerShown: false }} />
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
