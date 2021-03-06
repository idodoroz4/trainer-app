import React from 'react';
import { View, StyleSheet } from 'react-native';
import WorkoutButton from './Buttons/WorkoutButton';
import { COLOR_SCHEME } from '../utils/Constants';

const WorkoutButtonFooter: React.FC<WorkoutButtonFooterProps> = ({
  isRunning = true,
  isFinish = false,
  onContinue,
  onPause,
  onStop,
}) => {
  return (
    <View style={styles.container}>
      {!isRunning && (
        <WorkoutButton
          onClick={onContinue}
          iconName="play-arrow"
          style={styles.continueStyle}
        />
      )}

      {isRunning && (
        <WorkoutButton
          onClick={onPause}
          iconName="pause"
          style={styles.pauseStyle}
        />
      )}
      {!isFinish && (
        <WorkoutButton
          onClick={onStop}
          iconName="stop"
          style={styles.stopStyle}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
  continueStyle: {
    backgroundColor: COLOR_SCHEME.green,
    padding: 30,
    margin: 20,
    borderRadius: 20,
    flex: 1,
  },
  pauseStyle: {
    backgroundColor: COLOR_SCHEME.lightDarkYellow,
    padding: 30,
    margin: 20,
    borderRadius: 20,
    flex: 1,
  },
  stopStyle: {
    backgroundColor: COLOR_SCHEME.red,
    padding: 30,
    borderRadius: 20,
    margin: 20,
    flex: 1,
  },
});

type WorkoutButtonFooterProps = {
  isRunning: Boolean;
  isFinish: Boolean;
  onContinue: () => void;
  onPause: () => void;
  onStop: () => void;
};

export default WorkoutButtonFooter;
