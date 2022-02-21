import CounterWorkout from '../workouts/CounterWorkout';
import IntervalWorkout from '../workouts/IntervalWorkout';
import ReactionWorkout from '../workouts/ReactionWorkout';
import Workout from '../workouts/Workout';
import {
  WorkoutSettings,
  ReactionSettings,
  WorkoutType,
} from './types';

export const isEmpty = (val: Object) =>
  !val || Object.keys(val).length === 0;

export const getValue = (obj: any): any => obj?.value;

export const toMilliseconds = (num: number) => (num ? num * 1000 : 0);

export const createWorkout = (
  workoutObj: any,
): Workout | undefined => {
  const { type } = workoutObj;
  switch (type) {
    case WorkoutType.Interval:
      return new IntervalWorkout(
        workoutObj.name,
        workoutObj.workoutTime,
        workoutObj.restTime,
        workoutObj.rounds,
      );
    case WorkoutType.Counter:
      return new CounterWorkout(
        workoutObj.name,
        workoutObj.workoutTime,
        workoutObj.restTime,
        workoutObj.rounds,
        workoutObj.speed,
      );
    case WorkoutType.Reaction:
      return new ReactionWorkout(
        workoutObj.name,
        workoutObj.workoutTime,
        workoutObj.restTime,
        workoutObj.rounds,
        workoutObj.mode,
        workoutObj.slowSpeed,
        workoutObj.fastSpeed,
        workoutObj.sounds,
      );
  }
};

export const getNumberText = (num: number): string =>
  num < 10 ? `0${num}` : `${num}`;

export const toClockView = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${getNumberText(minutes)}:${getNumberText(secs)}`;
};
