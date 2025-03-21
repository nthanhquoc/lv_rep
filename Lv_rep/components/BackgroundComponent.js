import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getBackgroundData } from '../services/BackgroundService';
import { useNavigation } from '@react-navigation/native';

export const BackgroundComponent = () => {
  const [bgData, setBgData] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      const data = await getBackgroundData();
      if (data && data.length > 0) {
        setBgData(data);
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentImage(data[randomIndex].image);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (bgData.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * bgData.length);
        setCurrentImage(bgData[randomIndex].image);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [bgData]);

  return (
    <View style={styles.imageContainer}>
      {currentImage && (
        <>
          <Image source={{ uri: currentImage }} style={styles.image} />
          <TouchableOpacity style={styles.button}
            onPress={()=>navigation.navigate('Product')}
          >
            <Text style={styles.buttonText}>Xem thêm</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
