import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useFocusEffect } from "@react-navigation/native";
import { deleteItemCart, getDataCart, updateCartItem } from "../services/CartService";
import { useCart } from "../components/CartContext";

export const CartComponent = () => {
  const [cartItems, setCartItems] = useState([]);
  const { fetchCartCount } = useCart();

  const fetchCartData = async () => {
    try {
      const data = await getDataCart();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Sử dụng useFocusEffect để tự động cập nhật dữ liệu khi màn hình được focus
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
        setCartItems((prevItems) =>
          prevItems.filter((it) => it.id !== item.id)
        );
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
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.row}>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            contentFit="contain"
          />
        )}
        <View style={styles.details}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.priceQuantityRow}>
            <Text style={styles.itemPrice}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(item.price))}
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
          style={styles.paymentButton}
          onPress={() => {
            // Sự kiện thanh toán sẽ được xử lý ở đây
          }}
        >
          <Text style={styles.paymentButtonText}>Thanh toán</Text>
        </TouchableOpacity>
        <Text style={styles.totalText}>
          Tổng tiền:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(calculateTotal())}
        </Text>
      </View>
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
  paymentButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default CartComponent;
