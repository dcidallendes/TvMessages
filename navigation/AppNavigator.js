import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import LoadingScreen from '../screens/LoadingScreen';

import MainTabNavigator from './MainTabNavigator';

const AppStack = createStackNavigator({ Home: HomeScreen });
const LoadingResourcesStack = createStackNavigator({ Loading: LoadingScreen });

export default createAppContainer(createSwitchNavigator(
  {
    Loading: LoadingResourcesStack,
    App: AppStack,
  },
  {
    initialRouteName: 'Loading',
  }
));
