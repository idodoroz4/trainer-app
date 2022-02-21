import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import HomeScreenBtn from '../Components/Buttons/HomeScreenBtn';
import Wrapper from '../Components/Wrapper';
import { getKey, storeObject } from '../storage/storage';
import { createWorkout, isEmpty } from '../utils/utils';
import {
  settings,
  settingsConstraints,
} from '../utils/default-settings';
import { setup } from '../utils/setup';
import { getAllSavedWorkouts } from '../storage/workouts';
import { WorkoutSimpleObject } from '../utils/types';
import { setSettings } from '../redux/settingsSlice';
import { setSavedWorkouts } from '../redux/workoutsSlice';

export const SettingsRules = React.createContext(settingsConstraints);

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { navigate } = navigation;

  const trainerSettings = useSelector(
    (state: { [key: string]: any }) => state.settings,
    shallowEqual,
  );

  const savedWorkouts = useSelector(
    (state: any) => state.workouts,
    shallowEqual,
  );

  setup();

  useEffect(() => {
    if (isEmpty(trainerSettings)) {
      getKey('Settings', true)
        .then((value) => {
          if (isEmpty(value)) {
            storeObject('Settings', settings); // Save default settings
            dispatch(setSettings(settings));
          } else {
            dispatch(setSettings(value));
          }
        })
        .catch((e) => console.log(e));
    }
  }, [trainerSettings]);

  useEffect(() => {
    if (savedWorkouts.length === 0) {
      getAllSavedWorkouts()
        .then((workouts: (string | null)[] | null) => {
          if (workouts) {
            const validWorkouts: WorkoutSimpleObject[] = [];
            workouts.forEach((w) => {
              if (w) {
                try {
                  const workout = createWorkout(JSON.parse(w));
                  if (workout) {
                    validWorkouts.push(
                      JSON.parse(JSON.stringify(workout)),
                    );
                  }
                } catch {
                  console.log(`parsing workout: ${w} failed`);
                }
              }
            });
            dispatch(setSavedWorkouts(validWorkouts));
          }
        })
        .catch(() => null);
    }
  }, [savedWorkouts]);

  return (
    <SettingsRules.Provider value={settingsConstraints}>
      <Wrapper title="Train Me" navigation={navigation}>
        <View style={styles.btnContainer}>
          <HomeScreenBtn
            text="Interval"
            action={() => navigate('Interval')}
          />
          <HomeScreenBtn
            text="Counter"
            action={() => navigate('Counter')}
          />
        </View>
        <View style={styles.btnContainer}>
          <HomeScreenBtn
            text="Reaction"
            action={() => navigate('Reaction')}
          />
          {/* <HomeScreenBtn
            text="test"
            action={() => navigate('TestPlayground')}
          /> */}
        </View>
      </Wrapper>
    </SettingsRules.Provider>
  );
};

// color platte : https://coolors.co/011627-fdfffc-2ec4b6-e71d36-ff9f1c

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

type HomeScreenProps = {
  navigation: any;
};

export default HomeScreen;
