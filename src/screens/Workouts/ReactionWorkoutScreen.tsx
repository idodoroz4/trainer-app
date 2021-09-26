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
import ButtonGroupComponent from '../../Components/ButtonGroupComponent';
import SelectSoundsComponent from '../../Components/SelectSounds';
import { ReactionModes, WorkoutType } from '../../utils/types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getValue, toMilliseconds } from '../../utils/utils';
import OverrideFileModal from '../../Components/Modals/OverrideFileModal';
import WorkoutNameInput from '../../Components/WorkoutNameInput';
import { isPathExists } from '../../utils/fsUtils';
import { WORKOUTS_PATH } from '../../utils/Constants';
import ReactionWorkout from '../../workouts/ReactionWorkout';
import SpeedRange from '../../Components/SpeedRangeComponent';
import { SettingsRules } from '../HomeScreen';
import { addToSavedWorkouts } from '../../redux/workoutsSlice';
import Divider from '../../Components/Divider';
import { View } from 'react-native';

const ReactionWorkoutScreen: React.FC<CounterProps> = ({
  navigation,
  route,
}) => {
  const loadWorkout: ReactionWorkout = route.params?.loadWorkout;

  const settings = useSelector(
    (state: any) => state.settings,
    shallowEqual,
  );

  const reactionSettings = settings.reaction;
  const generalSetting = settings.general;

  const {
    roundsMax,
    roundsMin,
    workoutCountToMax,
    workoutCountToMin,
    fastestSpeed,
    slowestSpeed,
  } = React.useContext(SettingsRules);

  const speedDelta = parseFloat(getValue(generalSetting.speedDelta));

  const dispatch = useDispatch();

  const {
    reactionActionsNum,
    reactionTimer,
    reactionCounterNum,
    reactionRestTime,
    reactionRounds,
    fastSpeed: fSpeed,
    slowSpeed: sSPeed,
    reactionDefaultSound,
  } = reactionSettings;

  const [countTo, setCountTo] = React.useState(
    parseInt(getValue(reactionCounterNum)),
  );
  const [actions, setActions] = React.useState(
    parseInt(getValue(reactionActionsNum)),
  );
  const [timerSecs, setTimerSecs] = React.useState(
    parseInt(getValue(reactionTimer)),
  );
  const [restSecs, setRestSecs] = React.useState(
    parseInt(getValue(reactionRestTime)),
  );
  const [rounds, setRounds] = React.useState(
    parseInt(getValue(reactionRounds)),
  );

  const [fastSpeed, setFastSpeed] = React.useState(
    parseFloat(getValue(fSpeed)).toFixed(2),
  );
  const [slowSpeed, setSlowSpeed] = React.useState(
    parseFloat(getValue(sSPeed)).toFixed(2),
  );

  const [mode, setMode] = React.useState(ReactionModes.Actions);

  const [sounds, setSounds] = React.useState<string[]>([
    getValue(reactionDefaultSound),
  ]);

  React.useEffect(() => {
    const newPickedSounds = route.params?.sounds;
    if (newPickedSounds) {
      setSounds(newPickedSounds);
    }
  }, [route.params?.sounds]);

  const getWorkoutTime = () => {
    switch (mode) {
      case ReactionModes.Counter:
        return countTo;
      case ReactionModes.Timer:
        return timerSecs;
      case ReactionModes.Actions:
        return actions;
      default:
        return null;
    }
  };

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
    const ws = new ReactionWorkout(
      workoutName,
      countTo,
      restSecs,
      rounds,
      mode,
      slowSpeed,
      fastSpeed,
      sounds,
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

  React.useEffect(() => {
    if (loadWorkout) {
      switch (loadWorkout.mode) {
        case ReactionModes.Actions:
          setActions(loadWorkout.workoutTime as number);
        case ReactionModes.Counter:
          setCountTo(loadWorkout.workoutTime as number);
        case ReactionModes.Timer:
          setTimerSecs(loadWorkout.workoutTime as number);
      }

      setRestSecs(loadWorkout.restTime as number);
      setRounds(loadWorkout.rounds as number);
      setMode(loadWorkout.mode as ReactionModes);
      setFastSpeed(loadWorkout.fastSpeed as string);
      setSlowSpeed(loadWorkout.slowSpeed as string);
      setSounds(loadWorkout.sounds as string[]);
    }
  }, [loadWorkout]);

  return (
    <Wrapper
      title="Reaction"
      saveAction={() => setIsNameInputVisiable(true)}
      loadAction={() =>
        navigation.navigate('WorkoutPicker', {
          workoutType: WorkoutType.Reaction,
          loadToScreen: 'Reaction',
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
      <ButtonGroupComponent
        title="Mode"
        onChange={(mode: ReactionModes) => {
          setMode(mode);
          setIsNameInputVisiable(false);
        }}
        labelArr={[
          ReactionModes.Actions,
          ReactionModes.Counter,
          ReactionModes.Timer,
        ]}
        value={mode}
      />
      <Divider />

      {mode === ReactionModes.Counter && (
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
      )}

      {mode === ReactionModes.Actions && (
        <NumberComponent
          title="Actions"
          number={actions}
          onUp={() =>
            onNumberUp(setActions, actions, workoutCountToMax)
          }
          onDown={() =>
            onNumberDown(setActions, actions, workoutCountToMin)
          }
          onChange={(newValue) =>
            onNumberChange(
              newValue,
              setActions,
              workoutCountToMin,
              workoutCountToMax,
            )
          }
        />
      )}
      {mode === ReactionModes.Timer && (
        <ClockComponent
          title="Timer"
          seconds={timerSecs}
          onSecondsChange={setTimerSecs}
        />
      )}
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
        title="Fast Speed"
        number={`${fastSpeed}`}
        onUp={() =>
          onNumberUpString(
            setFastSpeed,
            fastSpeed,
            parseFloat(slowSpeed),
            speedDelta,
            true,
          )
        }
        onDown={() =>
          onNumberDownString(
            setFastSpeed,
            fastSpeed,
            fastestSpeed,
            speedDelta,
            true,
          )
        }
        onChange={(newValue) =>
          onNumberChangeString(
            newValue as string,
            setFastSpeed,
            fastestSpeed,
            parseFloat(slowSpeed),
            true,
          )
        }
      />

      <NumberComponent
        title="Slow Speed"
        number={`${slowSpeed}`}
        onUp={() =>
          onNumberUpString(
            setSlowSpeed,
            slowSpeed,
            slowestSpeed,
            speedDelta,
            true,
          )
        }
        onDown={() =>
          onNumberDownString(
            setSlowSpeed,
            slowSpeed,
            parseFloat(fastSpeed),
            speedDelta,
            true,
          )
        }
        onChange={(newValue) =>
          onNumberChangeString(
            newValue as string,
            setSlowSpeed,
            parseFloat(fastSpeed),
            slowestSpeed,
            true,
          )
        }
      />

      {mode !== 'Counter' && (
        <View>
          <Divider />
          <SelectSoundsComponent
            navigateToSoundPicker={() =>
              navigation.navigate('SoundsPicker', { sounds })
            }
          />
        </View>
      )}

      <StartButton
        onClick={() => {
          navigation.navigate('Action', {
            restTime: restSecs,
            workoutTime: getWorkoutTime(), // actions,
            workoutType: WorkoutType.Reaction,
            slowSpeed: slowSpeed,
            fastSpeed: fastSpeed,
            rounds,
            mode,
            sounds,
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

export default ReactionWorkoutScreen;
