import { WORKOUTS_PATH } from '../utils/Constants';
import { listFileNames, readFile } from '../utils/fsUtils';

export const getAllSavedWorkouts = async () => {
  const workoutFileNames = await listFileNames(WORKOUTS_PATH);
  const readWorkoutPromises: Promise<
    string | null
  >[] = workoutFileNames
    .map((workoutName) =>
      readFile(`${WORKOUTS_PATH}/${workoutName}`)
        .then((res) => res)
        .catch((e) => {
          console.log(workoutName, e);
          return null;
        }),
    )
    .filter((p) => p);

  return Promise.all(readWorkoutPromises)
    .then((res) => res)
    .catch((e) => {
      console.log(e);
      return null;
    });
};
