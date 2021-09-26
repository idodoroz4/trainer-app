import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { COLOR_SCHEME } from '../utils/Constants';
import Card from './Layout/Card';

const ButtonGroupComponent: React.FC<ButtonGroupComponentProps> = ({
  title,
  onChange,
  labelArr,
  value,
}) => {
  if (labelArr.length < 1) {
    return <></>;
  }

  return (
    <Card>
      <ButtonGroup
        onPress={(idx) => onChange(labelArr[idx])}
        selectedIndex={labelArr.indexOf(value)}
        buttons={labelArr}
        containerStyle={styles.componentView}
        buttonStyle={styles.ButtonStyle}
        textStyle={styles.ButtonText}
        selectedButtonStyle={styles.SelectedButtonStyle}
        innerBorderStyle={{ width: 0, color: COLOR_SCHEME.white }}
      />
    </Card>
  );
};
const styles = StyleSheet.create({
  componentView: {
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: COLOR_SCHEME.black,
  },
  ButtonStyle: {
    backgroundColor: COLOR_SCHEME.orange,
    borderRadius: 8,
    margin: 5,
  },
  ButtonText: {
    color: COLOR_SCHEME.black,
    fontSize: 20,
  },
  SelectedButtonStyle: {
    backgroundColor: COLOR_SCHEME.darkOrange,
  },
});

type ButtonGroupComponentProps = {
  title: string;
  onChange: (value: any) => void;
  labelArr: string[];
  value: any;
};

export default ButtonGroupComponent;
