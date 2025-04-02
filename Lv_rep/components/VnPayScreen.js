import React, { useCallback, useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { handlePaymentReturn } from "../services/PaymentService";
import { clearCart } from "../services/CartService";
import { useCart } from "../components/CartContext";

const VnPayScreen = ({ route }) => {
  const { url } = route.params;
  const navigation = useNavigation();
  const { fetchCartCount } = useCart();

  useEffect(() => {
    console.log("VnPayScreen received params:", route.params);
  }, [route.params]);

  const onNavigationStateChange = useCallback(
    async (navState) => {
      console.log("Current URL:", navState.url);
      if (navState.url.includes("vnp_ResponseCode")) {
        const urlParts = navState.url.split("?");
        if (urlParts.length > 1) {
          const queryString = urlParts[1];
          const urlParams = new URLSearchParams(queryString);
          const responseCode = urlParams.get("vnp_ResponseCode");
  
          // Log responseCode nhận được
          console.log("Response Code:", responseCode);
  
          try {
            // Gọi backend xử lý kết quả thanh toán
            const result = await handlePaymentReturn(responseCode);
            console.log("Payment result:", result);
            
            // Kiểm tra nếu chuỗi trả về chứa từ "thành công" (không phân biệt chữ hoa chữ thường)
            if (result && result.toLowerCase().includes("thành công")) {
              Alert.alert("Thanh toán thành công");
              await clearCart();
              fetchCartCount();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: "Home" },
                    {
                      name: "Cart",
                      state: { routes: [{ name: "CartMain" }] },
                    },
                  ],
                })
              );
            } else {
              Alert.alert("Thanh toán thất bại", "Vui lòng thử lại.");
              navigation.navigate("Cart", { screen: "CartMain" });
            }
          } catch (error) {
            Alert.alert("Có lỗi xảy ra trong quá trình thanh toán");
            console.log("Error in payment process:", error);
          }
        }
      }
    },
    [navigation, fetchCartCount]
  );
  

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: url }}
        onNavigationStateChange={onNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          />
        )}
      />
    </View>
  );
};

export default VnPayScreen;
