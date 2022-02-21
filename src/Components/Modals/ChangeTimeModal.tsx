import React from 'react';
import Modal from 'react-native-modal';
import { COLOR_SCHEME } from '../../utils/Constants';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import NumberScroller from '../NumberScroller';

const data = [...Array(60).keys()].map((k) =>
  k < 10 ? `0${k}` : `${k}`,
);

const ChangeTimeModal: React.FC<ChangeTimeModalProps> = (props) => {
  const { title, seconds, onSave, onClose, isVisible } = props;
  const [newSeconds, setNewSeconds] = React.useState(seconds % 60);
  const [newMinutes, setNewMinutes] = React.useState(
    Math.floor(seconds / 60),
  );
  const [modalVisible, setModalVisible] = React.useState(isVisible);

  React.useEffect(() => {
    setModalVisible(isVisible);
    if (!isVisible) {
      setNewSeconds(seconds % 60);
      setNewMinutes(Math.floor(seconds / 60));
    }
  }, [isVisible]);

  return (
    <Modal
      isVisible={modalVisible}
      animationOut="fadeOutDown"
      animationIn="fadeInUp"
      backdropTransitionOutTiming={0}
    >
      <View style={styles.content}>
        <Text style={styles.contentTitle}>{title}</Text>
        <View style={styles.timePicker}>
          <NumberScroller
            startValue={newMinutes}
            setValue={setNewMinutes}
          />
          <Text style={styles.twoDots}>:</Text>
          <NumberScroller
            startValue={newSeconds}
            setValue={setNewSeconds}
          />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => onSave(newSeconds + newMinutes * 60)}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onClose()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: COLOR_SCHEME.black,
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 30,
    marginBottom: 12,
    color: COLOR_SCHEME.white,
  },
  timePicker: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  twoDots: {
    fontSize: 50,
    marginTop: 50,
    color: COLOR_SCHEME.white,
  },
  buttonText: {
    fontSize: 25,
    marginBottom: 12,
    color: COLOR_SCHEME.white,
  },
  button: {
    paddingTop: 25,
    padding: 20,
  },
  buttons: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    width: '100%',
  },
});

type ChangeTimeModalProps = {
  seconds: number;
  title: string;
  onSave: (n: number) => void;
  onClose: () => void;
  isVisible?: boolean;
};

export default ChangeTimeModal;
