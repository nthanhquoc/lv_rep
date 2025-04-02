import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewsComponent from './NewsComponent';
import NewsDetail from './NewsDetail';

const NewsStack = createStackNavigator();

export function NewsStackScreen() {
  return (
    <NewsStack.Navigator>
      <NewsStack.Screen 
        name="NewsList" 
        component={NewsComponent} 
        options={{ title: 'News' }} 
      />
      <NewsStack.Screen 
        name="NewsDetail" 
        component={NewsDetail} 
        options={{ title: 'News' }} 
      />
    </NewsStack.Navigator>
  );
}
