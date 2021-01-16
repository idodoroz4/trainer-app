import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import IntervalWorkoutScreen from './src/screens/Workouts/IntervalWorkoutScreen';
import CounterWorkoutScreen from './src/screens/Workouts/CounterWorkoutScreen';
import ReactionWorkoutScreen from './src/screens/Workouts/ReactionWorkoutScreen';
import ActionScreen from './src/screens/ActionScreen';
import CustomWorkout from './src/screens/Workouts/CustomWorkoutScreen';
import SoundsPicker from './src/screens/SoundsPicker';
import LoadWorkoutScreen from './src/screens/WorkoutPicker';
import SettingPage from './src/screens/settings';
import reducers from './src/redux/reducers';

const Stack = createStackNavigator();
export default class App extends React.PureComponent {
  render() {
    return (
      <Provider store={createStore(reducers)}>
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
            <Stack.Screen name="Custom" component={CustomWorkout} />
            <Stack.Screen name="Settings" component={SettingPage} />
            <Stack.Screen
              name="SoundsPicker"
              component={SoundsPicker}
            />
            <Stack.Screen
              name="WorkoutPicker"
              component={LoadWorkoutScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
