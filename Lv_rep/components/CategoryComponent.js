import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getData } from "../services/Lvservice";
import { useNavigation } from "@react-navigation/native";

export const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getData();
      if (data) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => navigation.navigate("Product", { selectedCategory: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Khám phá các nhà sáng tạo độc đáo của LOUIS VUITTON
      </Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    marginTop: 10,
  },
  item: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 150,
  },
  name: {
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
