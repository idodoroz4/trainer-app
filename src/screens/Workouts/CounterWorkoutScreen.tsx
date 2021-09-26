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
import { SettingsRules } from '../HomeScreen';
import { addToSavedWorkouts } from '../../redux/workoutsSlice';
import Divider from '../../Components/Divider';

const CounterWorkoutScreen: React.FC<CounterProps> = ({
  navigation,
  route,
}) => {
  const loadWorkout: CounterWorkout = route.params?.loadWorkout;

  const settings = useSelector(
    (state: any) => state.settings,
    shallowEqual,
  );

  const counterSettings = settings.counter;
  const generalSetting = settings.general;

  const {
    roundsMax,
    roundsMin,
    workoutCountToMax,
    workoutCountToMin,
    fastestSpeed,
    slowestSpeed,
  } = React.useContext(SettingsRules);

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
    parseFloat(`${getValue(counterSpeed)}`).toFixed(2),
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
      const loadWT = loadWorkout.workoutTime as number;
      const loadRT = loadWorkout.workoutTime as number;
      const loadR = loadWorkout.rounds as number;
      // const loadS = loadWorkout.speed as number;
      setCountTo(loadWorkout.workoutTime as number);
      setRestSecs(loadWorkout.restTime as number);
      setRounds(loadWorkout.rounds as number);
      setSpeed(
        !loadWorkout.speed
          ? '1.00'
          : `${parseFloat(`${loadWorkout.speed}`).toFixed(2)}`,
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
        onUp={() =>
          onNumberUp(setCountTo, countTo, workoutCountToMax)
        }
        onDown={() =>
          onNumberDown(setCountTo, countTo, workoutCountToMin)
        }
        onChange={(newValue) =>
          onNumberChange(
            newValue,
            setCountTo,
            workoutCountToMin,
            workoutCountToMax,
          )
        }
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
      <Divider />
      <NumberComponent
        title="Speed (sec)"
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
            speed: parseFloat(speed) * 1000,
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
