import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  deleteItemCart,
  getDataCart,
  updateCartItem,
  clearCart,
} from "../services/CartService";
import { createOrder } from "../services/OrderService";
import { createPayment } from "../services/PaymentService";
import { useCart } from "../components/CartContext";

export const CartComponent = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { fetchCartCount } = useCart();
  const navigation = useNavigation();

  const fetchCartData = async () => {
    try {
      const data = await getDataCart();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartData();
    }, [])
  );

  const increaseQuantity = async (item) => {
    try {
      const updatedItem = { ...item, quantity: item.quantity + 1 };
      await updateCartItem(item.id, updatedItem);
      setCartItems((prevItems) =>
        prevItems.map((it) => (it.id === item.id ? updatedItem : it))
      );
      fetchCartCount();
    } catch (error) {
      console.error("Error updating cart item:", error);
      Alert.alert("Lỗi", "Không thể cập nhật số lượng sản phẩm");
    }
  };

  const decreaseQuantity = async (item) => {
    try {
      if (item.quantity === 1) {
        await deleteItemCart(item.id);
        setCartItems((prevItems) => prevItems.filter((it) => it.id !== item.id));
      } else {
        const updatedItem = { ...item, quantity: item.quantity - 1 };
        await updateCartItem(item.id, updatedItem);
        setCartItems((prevItems) =>
          prevItems.map((it) => (it.id === item.id ? updatedItem : it))
        );
      }
      fetchCartCount();
    } catch (error) {
      console.error("Error updating cart item:", error);
      Alert.alert("Lỗi", "Không thể cập nhật số lượng sản phẩm");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0
    );
  };

  // Tạo đơn hàng và chuyển hướng thanh toán theo phương thức (VNPAY hoặc PAYPAL)
  const processPayment = async (paymentMethod) => {
    setIsProcessing(true);
    try {
      const orderData = {
        totalAmount: calculateTotal(),
        orderItems: cartItems.map((item) => ({
          quantity: item.quantity,
          product: item.product,
        })),
      };
  
      const order = await createOrder(orderData);
      // Gửi order.id và paymentMethod cho backend để tạo thanh toán
      const paymentResponse = await createPayment(order.id, paymentMethod);

      
      console.log("Payment response:", paymentResponse);
      const paymentUrl =
      typeof paymentResponse === "string"
        ? paymentResponse
        : paymentResponse.approvalUrl;

    if (paymentUrl) {
      if (paymentMethod === "VNPAY") {
        navigation.navigate("VnPayScreen", { url: paymentUrl });
      } else {
        navigation.navigate("PaymentScreen", { url: paymentUrl });
      }
    } else {
      Alert.alert("Lỗi", "Không thể lấy đường dẫn thanh toán");
    }
  } catch (error) {
    console.error("Error during checkout:", error);
    Alert.alert("Lỗi", "Không thể tạo đơn hàng hoặc thanh toán");
  } finally {
    setIsProcessing(false);
    setIsModalVisible(false);
  }
  };

  // Hiển thị modal lựa chọn phương thức thanh toán
  const checkout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Thông báo", "Giỏ hàng đang trống!");
      return;
    }
    setIsModalVisible(true);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.row}>
        {item.product.image && (
          <Image
            source={{ uri: item.product.image }}
            style={styles.productImage}
            contentFit="contain"
          />
        )}
        <View style={styles.details}>
          <Text style={styles.itemName}>{item.product.name}</Text>
          <View style={styles.priceQuantityRow}>
            <Text style={styles.itemPrice}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(item.product.price))}
            </Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                onPress={() => decreaseQuantity(item)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => increaseQuantity(item)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.totalContainer}>
        <TouchableOpacity
          style={[
            styles.paymentButton,
            (cartItems.length === 0 || isProcessing) && styles.disabledButton,
          ]}
          onPress={checkout}
          disabled={cartItems.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <Text style={styles.paymentButtonText}>Đang xử lý</Text>
          ) : (
            <Text style={styles.paymentButtonText}>Thanh toán</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.totalText}>
          Tổng tiền:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(calculateTotal())}
        </Text>
      </View>
      
      {/* Modal lựa chọn phương thức thanh toán */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => processPayment("VNPAY")}
              disabled={isProcessing}
            >
              <Text style={styles.modalButtonText}>VNPAY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => processPayment("PAYPAL")}
              disabled={isProcessing}
            >
              <Text style={styles.modalButtonText}>PayPal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}
              disabled={isProcessing}
            >
              <Text style={styles.modalButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  listContent: {
    paddingBottom: 16,
  },
  cartItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  priceQuantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPrice: {
    fontSize: 16,
    color: "#888",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityValue: {
    marginHorizontal: 12,
    fontSize: 18,
  },
  totalContainer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 12,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "600",
  },
  paymentButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  // Style cho Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#888",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default CartComponent;
