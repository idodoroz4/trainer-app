import { ReactionModes, WorkoutType } from '../utils/types';
import Workout, { IWorkout } from './Workout';

class ReactionWorkout extends Workout implements IWorkout {
  workoutTime: number | undefined;
  restTime: number | undefined;
  rounds: number | undefined;
  mode: ReactionModes | undefined;
  slowSpeed: string | undefined;
  fastSpeed: string | undefined;
  sounds: string[] | undefined;

  constructor(
    name?: string,
    workoutTime?: number,
    restTime?: number,
    rounds?: number,
    mode?: ReactionModes,
    slowSpeed?: string,
    fastSpeed?: string,
    sounds?: string[],
  ) {
    super(name, WorkoutType.Reaction);
    this.workoutTime = workoutTime;
    this.restTime = restTime;
    this.rounds = rounds;
    this.mode = mode;
    this.slowSpeed = slowSpeed;
    this.fastSpeed = fastSpeed;
    this.sounds = sounds;
  }

  fillFromJSON = (json: string) => {
    let workoutObj;
    try {
      workoutObj = JSON.parse(json);
    } catch {
      return;
    }

    this.name = workoutObj.name;
    this.type = workoutObj.type;
    this.workoutTime = workoutObj.workoutTime;
    this.restTime = workoutObj.restTime;
    this.rounds = workoutObj.rounds;
    this.mode = workoutObj.mode;
    this.slowSpeed = workoutObj.slowSpeed;
    this.fastSpeed = workoutObj.fastSpeed;
    this.sounds = workoutObj.sounds;
  };

  isValid = () =>
    !!this.name &&
    !!this.type &&
    !!this.workoutTime &&
    !!this.restTime &&
    !!this.rounds &&
    !!this.mode &&
    !!this.slowSpeed &&
    !!this.fastSpeed &&
    !!this.sounds;
}

export default ReactionWorkout;
