import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { COLOR_SCHEME } from '../../utils/Constants';

const { width } = Dimensions.get('screen');
const defaultHeight = 90;

type CardProps = {
  title?: string;
  customHeight?: number;
};

const Card: React.FC<CardProps> = ({
  title,
  children,
  customHeight = defaultHeight,
}) => {
  return (
    <View style={[styles.mainView, { height: customHeight }]}>
      {title && <Text style={styles.titleText}>{title}</Text>}
      <View style={styles.componentView}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    backgroundColor: COLOR_SCHEME.black,
    padding: 15,
  },
  titleText: {
    flex: 3,
    height: '90%',
    flexDirection: 'row',
    textAlign: 'left',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 20,
  },
  componentView: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Card;
