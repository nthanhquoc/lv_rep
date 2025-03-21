import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { getvideoData } from '../services/VideoService';

export const ImageComponent = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const data = await getvideoData();
      setImages(data);
    };
    fetchImages();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {images.map((img) => (
        <View key={img.id} style={styles.imageContainer}>
          <Image source={{ uri: img.url }} style={styles.image} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  }
});
