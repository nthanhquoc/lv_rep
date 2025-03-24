import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { getProductData } from "../services/ProductService";
import { getData as getCategoryData } from "../services/Lvservice";
import { HeaderComponent } from "./HeaderComponent";
import { useRoute } from "@react-navigation/native";
import { addToCart, getDataCart, updateCartItem } from "../services/CartService";
import { useCart } from "../components/CartContext"; // Import thêm useCart

export const ProductComponent = () => {
  const route = useRoute();
  const initialCategory = route.params?.selectedCategory || 0;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Lấy hàm fetchCartCount từ context để cập nhật giỏ hàng sau khi thêm sản phẩm
  const { fetchCartCount } = useCart();

  useEffect(() => {
    if (route.params?.selectedCategory !== undefined) {
      setSelectedCategory(route.params.selectedCategory);
    }
  }, [route.params?.selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductData();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getCategoryData();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const categoriesWithAll = [{ id: 0, name: "All" }, ...categories];
  const filteredProducts =
    selectedCategory === 0
      ? products
      : products.filter(
          (item) => Number(item.categoryId) === Number(selectedCategory)
        );

  const handleImagePress = (item) => {
    setSelectedProduct(item);
    setModalVisible(true);
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (item) => {
    try {
      // Lấy dữ liệu giỏ hàng hiện tại
      const cart = await getDataCart();
      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const existingItem = cart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // Nếu đã có, tăng số lượng sản phẩm
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
        await updateCartItem(existingItem.id, updatedItem);
      } else {
        // Nếu chưa có, thêm mới với số lượng = 1
        await addToCart({ ...item, quantity: 1 });
      }
      Alert.alert("Thông báo", "Đã thêm sản phẩm vào giỏ hàng");
      // Cập nhật số lượng giỏ hàng ngay sau khi thêm sản phẩm
      fetchCartCount();
    } catch (error) {
      console.error("Error adding product to cart:", error);
      Alert.alert("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        onPress={() => handleImagePress(item)}
        style={styles.imageContainer}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          contentFit="contain"
        />
      </TouchableOpacity>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(Number(item.price))}
      </Text>
      <TouchableOpacity
        style={styles.addIconContainer}
        onPress={() => handleAddToCart(item)}
      >
        <MaterialIcons name="add" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === item.id && styles.categoryButtonTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <HeaderComponent />
      </View>
      <View style={styles.categoryContainer}>
        <FlatList
          data={categoriesWithAll}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryListContent}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
      />

      {selectedProduct && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeIconContainer}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={28} color="#000" />
              </TouchableOpacity>
              <Image
                source={{ uri: selectedProduct.image }}
                style={styles.modalImage}
                contentFit="contain"
              />
              <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
              <Text style={styles.modalPrice}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(selectedProduct.price))}
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  categoryListContent: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#2196F3",
  },
  categoryButtonText: {
    fontSize: 16,
    color: "#000",
  },
  categoryButtonTextActive: {
    color: "#fff",
  },
  listContainer: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 150,
    marginBottom: 10,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  addIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 20,
    backgroundColor: "rgba(240,240,240,0.8)",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  closeIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    color: "#888",
    marginBottom: 20,
  },
});

export default ProductComponent;
