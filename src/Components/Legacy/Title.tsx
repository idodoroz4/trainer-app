import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Title: React.FC<TitleProps> = ({ title, style }) => {
  return (
    <View>
      <Text style={[styles.title, style]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    flex: 4,
  },
});

type TitleProps = {
  title: string;
  style: object;
};

export default Title;
