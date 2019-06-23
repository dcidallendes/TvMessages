import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import VerifyConnectionScreen from '../screens/VerifyConnectionScreen';


import MainTabNavigator from './MainTabNavigator';
import SignUpScreen from '../screens/SignUpScreen';
import DataManager from '../utils/DataManager';

const AppStack = createStackNavigator({ Home: HomeScreen });
const VerifyConnectionStack = createStackNavigator({ VerifyConnection: VerifyConnectionScreen });
const SignUpStack = createStackNavigator({ SignUp: SignUpScreen });

export default createAppContainer(createSwitchNavigator(
  {
    VerifyConnection: VerifyConnectionStack,
    SignUp: SignUpStack,
    App: AppStack,
  },
  {
    initialRouteName: 'SignUp'
  }
));
