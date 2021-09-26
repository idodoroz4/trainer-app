import React from 'react';
import Card from './Layout/Card';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLOR_SCHEME } from '../utils/Constants';
import Icon from 'react-native-vector-icons/FontAwesome';

type SelectSoundsComponentProps = {
  sounds?: string[];
  navigateToSoundPicker: () => void;
};

const SelectSoundsComponent: React.FC<SelectSoundsComponentProps> = ({
  navigateToSoundPicker,
}) => {
  return (
    <View style={styles.componentView}>
      <TouchableOpacity
        onPress={navigateToSoundPicker}
        style={styles.btnStyle}
      >
        <View style={styles.view}>
          <Text style={styles.btnText}>Choose Action Sounds</Text>
          <Icon
            name="volume-up"
            size={50}
            color={COLOR_SCHEME.white}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  componentView: {
    marginHorizontal: '10%',
    marginTop: '5%',
  },
  btnText: {
    fontSize: 25,
    color: COLOR_SCHEME.white,
  },
  btnStyle: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLOR_SCHEME.white,
    padding: 15,
  },
  view: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    //justifyContent: 'center',
  },
});

export default SelectSoundsComponent;
