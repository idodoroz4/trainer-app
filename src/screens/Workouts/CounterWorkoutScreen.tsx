import React from 'react';
import Wrapper from '../../Components/Wrapper';
import ClockComponent from '../../Components/ClockComponent';
import NumberComponent from '../../Components/NumberComponent';
import {
  onNumberUp,
  onNumberDown,
  onNumberChange,
  saveWorkout,
  onNumberDownString,
  onNumberUpString,
  onNumberChangeString,
} from './utils';
import StartButton from '../../Components/Buttons/StartButton';
import { WorkoutType } from '../../utils/types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getValue } from '../../utils/utils';
import OverrideFileModal from '../../Components/Modals/OverrideFileModal';
import WorkoutNameInput from '../../Components/WorkoutNameInput';
import { isPathExists } from '../../utils/fsUtils';
import { WORKOUTS_PATH } from '../../utils/Constants';
import CounterWorkout from '../../workouts/CounterWorkout';

const minRounds = 1;
const maxRounds = 1000;
const minCountTo = 1;
const maxCountTo = 100;
const fastestSpeed = 0.25;
const slowestSpeed = 60; // 1 Minute

const CounterWorkoutScreen: React.FC<CounterProps> = ({
  navigation,
  route,
}) => {
  const loadWorkout: CounterWorkout = route.params?.loadWorkout;

  const counterSettings = useSelector(
    (state: any) => state.trainerState.Settings.counter,
    shallowEqual,
  );

  const generalSetting = useSelector(
    (state: any) => state.trainerState.Settings.general,
    shallowEqual,
  );

  const { speedDelta } = generalSetting;
  const speedDel = parseFloat(getValue(speedDelta));

  const dispatch = useDispatch();

  const {
    counterNum,
    counterRestTime,
    counterRounds,
    counterSpeed,
  } = counterSettings;

  const [countTo, setCountTo] = React.useState(
    parseInt(getValue(counterNum)),
  );
  const [restSecs, setRestSecs] = React.useState(
    parseInt(getValue(counterRestTime)),
  );
  const [rounds, setRounds] = React.useState(
    parseInt(getValue(counterRounds)),
  );
  const [speed, setSpeed] = React.useState(
    `${getValue(counterSpeed)}`,
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

  React.useEffect(() => {
    if (loadWorkout) {
      setCountTo(loadWorkout.workoutTime as number);
      setRestSecs(loadWorkout.restTime as number);
      setRounds(loadWorkout.rounds as number);
      setSpeed(
        !loadWorkout.speed
          ? '1.00'
          : `${parseFloat(loadWorkout.speed).toFixed(2)}`,
      );
    }
  }, [loadWorkout]);

  const saveWorkoutSettings = (workoutName: string) => {
    const ws = new CounterWorkout(
      workoutName,
      countTo,
      restSecs,
      rounds,
      speed,
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

  console.log('speed:', speed);

  return (
    <Wrapper
      title="Counter"
      saveAction={() => setIsNameInputVisiable(true)}
      loadAction={() =>
        navigation.navigate('WorkoutPicker', {
          workoutType: WorkoutType.Counter,
          loadToScreen: 'Counter',
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
      <NumberComponent
        title="Count To"
        number={countTo}
        onUp={() => onNumberUp(setCountTo, countTo, maxCountTo)}
        onDown={() => onNumberDown(setCountTo, countTo, minCountTo)}
        onChange={(newValue) =>
          onNumberChange(newValue, setCountTo, minCountTo, maxCountTo)
        }
      />

      <ClockComponent
        title="Rest Time"
        seconds={restSecs}
        onSecondsChange={setRestSecs}
      />

      <NumberComponent
        title="Rounds"
        number={rounds}
        onUp={() => onNumberUp(setRounds, rounds, maxRounds)}
        onDown={() => onNumberDown(setRounds, rounds, minRounds)}
        onChange={(newValue) =>
          onNumberChange(newValue, setRounds, minRounds, maxRounds)
        }
      />

      <NumberComponent
        title="Speed"
        number={speed}
        onUp={() =>
          onNumberUpString(setSpeed, speed, slowestSpeed, speedDel)
        }
        onDown={() =>
          onNumberDownString(setSpeed, speed, fastestSpeed, speedDel)
        }
        onChange={(newValue) =>
          onNumberChangeString(
            newValue,
            setSpeed,
            fastestSpeed,
            slowestSpeed,
          )
        }
      />

      <StartButton
        onClick={() => {
          navigation.navigate('Action', {
            restTime: restSecs,
            workoutTime: countTo,
            workoutType: WorkoutType.Counter,
            speed,
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
  speed: number;
  rounds: number;
};

type CounterProps = {
  navigation: any; // NavigationScreenProp<NavigationState, NavigationParams>;
  route: any;
};

export default CounterWorkoutScreen;
