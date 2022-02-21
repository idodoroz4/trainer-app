import React from 'react';
import { Provider } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import store from './src/app/store';
import HomeScreen from './src/screens/HomeScreen';
import IntervalWorkoutScreen from './src/screens/Workouts/IntervalWorkoutScreen';
import CounterWorkoutScreen from './src/screens/Workouts/CounterWorkoutScreen';
import ReactionWorkoutScreen from './src/screens/Workouts/ReactionWorkoutScreen';
import ActionScreen from './src/screens/ActionScreen';
import SoundsPicker from './src/screens/SoundsPicker';
import LoadWorkoutScreen from './src/screens/WorkoutPicker';
import SettingPage from './src/screens/settings';
import FlashMessage from 'react-native-flash-message';
import TestPlayground from './src/screens/TestPlayground';

const Stack = createStackNavigator();
export default class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            headerMode="none"
            screenOptions={{ animationEnabled: false }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Interval"
              component={IntervalWorkoutScreen}
            />
            <Stack.Screen
              name="Counter"
              component={CounterWorkoutScreen}
            />
            <Stack.Screen
              name="Reaction"
              component={ReactionWorkoutScreen}
            />
            <Stack.Screen name="Action" component={ActionScreen} />
            <Stack.Screen name="Settings" component={SettingPage} />
            <Stack.Screen
              name="SoundsPicker"
              component={SoundsPicker}
            />
            <Stack.Screen
              name="WorkoutPicker"
              component={LoadWorkoutScreen}
            />
            <Stack.Screen
              name="TestPlayground"
              component={TestPlayground}
            />
          </Stack.Navigator>
          <FlashMessage
            position="bottom"
            ref="flashMessageComp"
            floating
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </NavigationContainer>
      </Provider>
    );
  }
}
