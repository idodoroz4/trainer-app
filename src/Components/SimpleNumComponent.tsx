import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLOR_SCHEME } from '../utils/Constants';

type SimpleNumComponentProps = {
  number: number | string;
  onDown: () => void;
  onUp: () => void;
  onChange: (val: number | string) => void;
  btnSize?: number;
  fontSize?: number;
};

const SimpleNumComponent: React.FC<SimpleNumComponentProps> = ({
  number,
  onDown,
  onUp,
  onChange,
  btnSize = 30,
  fontSize = 40,
}) => {
  const [val, setVal] = React.useState(number);

  React.useEffect(() => {
    if (val !== number) {
      setVal(number);
    }
  }, [number]);

  const submitChange = () => {
    onChange(val);
    if (val !== number) {
      setVal(number);
    }
  };

  return (
    <View style={styles.componentView}>
      <View style={styles.buttonView}>
        <TouchableOpacity onPress={onDown} style={styles.btnStyle}>
          <Icon name="minus-circle" size={btnSize} color="#AAA" />
        </TouchableOpacity>
      </View>
      <View style={styles.subjectView}>
        <TextInput
          style={{ ...styles.NumberText, fontSize }}
          keyboardType="phone-pad"
          onFocus={() => setVal('')}
          onChangeText={(v) => setVal(v)}
          onBlur={submitChange}
          value={val ? `${val}` : ''}
        />
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity onPress={onUp} style={styles.btnStyle}>
          <Icon name="plus-circle" size={btnSize} color="#AAA" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  componentView: {
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonView: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectView: {
    flex: 1,
    flexGrow: 2,
    alignItems: 'center',
  },
  NumberText: {
    fontSize: 50,
    color: COLOR_SCHEME.white,
    paddingVertical: 0,
  },
  btnStyle: {
    padding: 10,
  },
});

export default SimpleNumComponent;
