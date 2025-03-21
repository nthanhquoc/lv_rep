import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { BackgroundComponent } from './BackgroundComponent';
import { CategoryComponent } from './CategoryComponent';
import { CustomerServiceComponent } from './CustomerServiceComponent';
import { ImageComponent } from './ImageComponent';
import { HeaderComponent } from './HeaderComponent';

export const LvComponent = () => {
  // Hàm render toàn bộ nội dung header
  const renderHeader = () => (
    <View>
      <HeaderComponent/>
      <BackgroundComponent />
      <CategoryComponent />
      <ImageComponent/>
      <CustomerServiceComponent />
    </View>
  );

  return (
    <FlatList
      data={[{ key: 'dummy' }]}  // Dữ liệu dummy để FlatList hoạt động
      renderItem={() => null}      // Không cần render item nào, toàn bộ nội dung nằm trong header
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  line: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
});
