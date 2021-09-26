import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLOR_SCHEME } from '../utils/Constants';

type DividerProps = {
  height?: number;
  width?: string | number;
  color?: string;
  marginLeft?: string | number;
};

const Divider: React.FC<DividerProps> = (props) => {
  const {
    height = 1,
    width = '90%',
    marginLeft = '5%',
    color = COLOR_SCHEME.white,
  } = props;
  return (
    <View
      style={[
        styles.view,
        {
          width,
          borderBottomColor: color,
          borderBottomWidth: height,
          marginLeft,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default Divider;
