import React from 'react';
import { showMessage } from 'react-native-flash-message';

import Wrapper from '../../Components/Wrapper';
import ClockComponent from '../../Components/ClockComponent';
import NumberComponent from '../../Components/NumberComponent';
import {
  onNumberUp,
  onNumberDown,
  onNumberChange,
  saveWorkout,
} from './utils';
import StartButton from '../../Components/Buttons/StartButton';
import { WorkoutType } from '../../utils/types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getValue } from '../../utils/utils';
import WorkoutNameInput from '../../Components/WorkoutNameInput';
import OverrideFileModal from '../../Components/Modals/OverrideFileModal';
import { isPathExists } from '../../utils/fsUtils';
import { WORKOUTS_PATH } from '../../utils/Constants';
import IntervalWorkout from '../../workouts/IntervalWorkout';
import { SettingsRules } from '../HomeScreen';
import { addToSavedWorkouts } from '../../redux/workoutsSlice';
import Divider from '../../Components/Divider';

const IntervalWorkoutScreen: React.FC<IntervalWorkoutProps> = ({
  route,
  navigation,
}) => {
  const loadWorkout: IntervalWorkout = route.params?.loadWorkout;

  const settings = useSelector(
    (state: any) => state.settings,
    shallowEqual,
  );

  const intervalSettings = settings.interval;

  const { roundsMax, roundsMin } = React.useContext(SettingsRules);

  const dispatch = useDispatch();

  const {
    intervalTime,
    intervalRestTime,
    intervalRounds,
  } = intervalSettings;

  const [intervalSecs, setIntervalSecs] = React.useState(
    parseInt(getValue(intervalTime)),
  );
  const [restSecs, setRestSecs] = React.useState(
    parseInt(getValue(intervalRestTime)),
  );
  const [rounds, setRounds] = React.useState(
    parseInt(getValue(intervalRounds)),
  );

  React.useEffect(() => {
    if (loadWorkout) {
      setIntervalSecs(loadWorkout.workoutTime as number);
      setRestSecs(loadWorkout.restTime as number);
      setRounds(loadWorkout.rounds as number);
    }
  }, [loadWorkout]);

  const [
    isNameInputVisiable,
    setIsNameInputVisiable,
  ] = React.useState(false);

  const [
    isOverrideModalVisiable,
    setIsOverrideModalVisiable,
  ] = React.useState(false);

  const [workoutName, setWorkoutName] = React.useState('');

  const saveWorkoutSettings = (workoutName: string) => {
    const ws = new IntervalWorkout(
      workoutName,
      intervalSecs,
      restSecs,
      rounds,
    );

    console.log('JSON.stringify(ws)', JSON.stringify(ws));
    saveWorkout(JSON.stringify(ws), ws.name as string)
      .then(() => {
        dispatch(addToSavedWorkouts(JSON.parse(JSON.stringify(ws))));
        showMessage({
          message: `${ws.name} saved`,
        });
      })
      .catch((e) => console.log(e));
  };

  const isWorkoutExists = (workoutName: string) => {
    if (!workoutName) {
      return;
    }

    setWorkoutName(workoutName);
    isPathExists(`${WORKOUTS_PATH}/${workoutName}.json`)
      .then((result) =>
        result
          ? setIsOverrideModalVisiable(true)
          : saveWorkoutSettings(workoutName),
      )
      .catch((e) => console.log(e));
  };

  return (
    <Wrapper
      title="Interval"
      saveAction={() => setIsNameInputVisiable(true)}
      loadAction={() =>
        navigation.navigate('WorkoutPicker', {
          workoutType: WorkoutType.Interval,
          loadToScreen: 'Interval',
        })
      }
      hideLoadSaveBtns={false}
      navigation={navigation}
    >
      <OverrideFileModal
        isVisible={isOverrideModalVisiable}
        onClose={() => setIsOverrideModalVisiable(false)}
        onSave={() => {
          saveWorkoutSettings(workoutName);
          setIsOverrideModalVisiable(false);
        }}
      />
      {isNameInputVisiable && (
        <WorkoutNameInput onSubmit={isWorkoutExists} />
      )}
      <ClockComponent
        title="Workout"
        seconds={intervalSecs}
        onSecondsChange={setIntervalSecs}
      />
      <Divider />
      <ClockComponent
        title="Rest"
        seconds={restSecs}
        onSecondsChange={setRestSecs}
      />
      <Divider />
      <NumberComponent
        title="Rounds"
        number={rounds}
        onUp={() => onNumberUp(setRounds, rounds, roundsMax)}
        onDown={() => onNumberDown(setRounds, rounds, roundsMin)}
        onChange={(newValue) =>
          onNumberChange(newValue, setRounds, roundsMin, roundsMax)
        }
      />
      <StartButton
        onClick={() => {
          navigation.navigate('Action', {
            restTime: restSecs,
            workoutTime: intervalSecs,
            workoutType: WorkoutType.Interval,
            rounds,
          });
        }}
      />
    </Wrapper>
  );
};

type NavigationParams = {
  restTime: number;
  workoutTime: number;
  workoutType: string;
  rounds: number;
};

type IntervalWorkoutProps = {
  route: any;
  navigation: any; // NavigationScreenProp<NavigationState, NavigationParams>;
};

export default IntervalWorkoutScreen;
