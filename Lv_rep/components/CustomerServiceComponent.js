import { useEffect, useState } from "react";
import { getCustomerService } from "../services/CustomerService";
import { FlatList, View, StyleSheet, Text, Image, Dimensions } from "react-native";

export const CustomerServiceComponent = () => {
  const [service, setServices] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getCustomerService();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services: ", err);
      }
    };
    fetchService();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dịch Vụ Louis Vuitton</Text>
      <Text style={styles.paragraph}>
        Louis Vuitton cung cấp dịch vụ gói quà cho tất cả đơn hàng, được đóng gói 1 cách cẩn thận trong chiếc hộp biểu tượng của thương hiệu.
      </Text>

      <FlatList
        data={service}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width} 
        snapToAlignment="center"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.item, { width: width }]}>
            <Image
              source={{ uri: item.imageURL || item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.itemTitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "center",
    marginTop: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 15,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
    borderRadius: 5,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default CustomerServiceComponent;
