import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { getNewsById } from '../services/NewsService';

export const NewsDetail = ({ route }) => {
  const { newsId } = route.params;
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const data = await getNewsById(newsId);
        setNews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy thông tin tin tức</Text>
      </View>
    );
  }
  
  const dateValue = news.dateCreate ? news.dateCreate : news.dateCrate;
  const formattedDate = new Date(dateValue).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: news.image }} style={styles.image} />
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.content}>{news.definition}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#fff'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  date: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 15
  },
  content: {
    fontSize: 16,
    color: '#333'
  }
});

export default NewsDetail;
