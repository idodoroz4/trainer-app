import React from 'react';
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
import { IntervalSettings, WorkoutType } from '../../utils/types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getValue } from '../../utils/utils';
import WorkoutNameInput from '../../Components/WorkoutNameInput';
import OverrideFileModal from '../../Components/Modals/OverrideFileModal';
import { isPathExists } from '../../utils/fsUtils';
import { WORKOUTS_PATH } from '../../utils/Constants';
import IntervalWorkout from '../../workouts/IntervalWorkout';

const intervalMinSec = 1;
const intervalMinRounds = 1;
const intervalMaxRounds = 1000;

const IntervalWorkoutScreen: React.FC<IntervalWorkoutProps> = ({
  route,
  navigation,
}) => {
  const loadWorkout: IntervalWorkout = route.params?.loadWorkout;

  const intervalSettings = useSelector(
    (state: any) => state.trainerState.Settings.interval,
    shallowEqual,
  );

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

  const onRoundsDown = React.useCallback(
    () => onNumberDown(setRounds, rounds, intervalMinRounds),
    [rounds],
  );

  const onRoundsUp = React.useCallback(
    () => onNumberUp(setRounds, rounds, intervalMaxRounds),
    [rounds],
  );

  const [
    isNameInputVisiable,
    setIsNameInputVisiable,
  ] = React.useState(false);

  const [
    isOverrideModalVisiable,
    setIsOverrideModalVisiable,
  ] = React.useState(false);

  const [workoutName, setWorkoutName] = React.useState('');

  const onRoundsChange = React.useCallback(
    (newValue) =>
      onNumberChange(
        newValue,
        setRounds,
        intervalMinRounds,
        intervalMaxRounds,
      ),
    [rounds],
  );

  const saveWorkoutSettings = (workoutName: string) => {
    const ws = new IntervalWorkout(
      workoutName,
      intervalSecs,
      restSecs,
      rounds,
    );

    saveWorkout(JSON.stringify(ws), ws.name as string)
      .then(() => {
        dispatch({ type: 'ADD_TO_SAVED_WORKOUTS', payload: ws });
        console.log('saved:', ws.name);
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
        title="Interval Time"
        seconds={intervalSecs}
        onSecondsChange={setIntervalSecs}
      />
      <ClockComponent
        title="Rest Time"
        seconds={restSecs}
        onSecondsChange={setRestSecs}
      />
      <NumberComponent
        title="Rounds"
        number={rounds}
        onUp={onRoundsUp}
        onDown={onRoundsDown}
        onChange={onRoundsChange}
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
