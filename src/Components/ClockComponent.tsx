import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ClockViewer from './ClockTimer/Clock';
import Card from './Layout/Card';
import ChangeTimeModal from './Modals/ChangeTimeModal';

const ClockComponent: React.FC<ClockComponentProps> = ({
  title,
  seconds,
  onSecondsChange,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Card title={title}>
      <ChangeTimeModal
        seconds={seconds}
        onClose={() => setShowModal(false)}
        onSave={(newSeconds) => {
          onSecondsChange(newSeconds);
          setShowModal(false);
        }}
        isVisible={showModal}
        title="Pick Time"
      />
      <View style={styles.componentView}>
        <TouchableOpacity
          style={styles.subjectView}
          onPress={() => setShowModal(true)}
        >
          <ClockViewer seconds={seconds} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  componentView: {
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
  },
  buttonView: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
  },
  subjectView: {
    flex: 1,
    flexGrow: 3,
    alignItems: 'center',
  },
});

type ClockComponentProps = {
  title: string;
  seconds: number;
  onSecondsChange: (n: number) => void;
};

export default ClockComponent;
