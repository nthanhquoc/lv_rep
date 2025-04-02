import React from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { clearCart } from "../services/CartService";
import { useCart } from "../components/CartContext"; 

const PaymentScreen = ({ route }) => {
  const { url } = route.params;
  const navigation = useNavigation();
  
  const { fetchCartCount } = useCart();

  const handleNavigationChange = async(navState) => {
    const { url: currentUrl } = navState;

    // Kiểm tra nếu URL chứa endpoint success
    if (currentUrl.includes("/api/payments/success")) {
      Alert.alert("Thành công", "Thanh toán thành công!");
      await clearCart();
      fetchCartCount();
      // Reset stack: về Home và CartMain
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: "Home" },
            {
              name: "Cart",
              state: {
                routes: [{ name: "CartMain" }],
              },
            },
          ],
        })
      );
    }

    // Kiểm tra nếu URL chứa endpoint cancel
    if (currentUrl.includes("/api/payments/cancel")) {
      Alert.alert("Thanh toán bị hủy", "Bạn đã hủy giao dịch thanh toán.");

      // Reset lại Cart về CartMain
      navigation.navigate("Cart", { screen: "CartMain" });
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            color="#007BFF"
            size="large"
            style={styles.loader}
          />
        )}
        onNavigationStateChange={handleNavigationChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default PaymentScreen;
