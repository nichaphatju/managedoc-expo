import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './components/Login/Login';
import Home from './components/ManageDoc/Home';
import { createAppContainer } from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack';
import auth from "firebase/auth";
import firebase from 'firebase';
import firebaseConfig from './config/firebase';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const AppNavigator = createStackNavigator(
  {
    Login: {screen: Login},
    Home: {screen: Home}
  },
  {
    initialRouteName: 'Login',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  state = {loggedIn: false};

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user)
      if (user) {
        this.setState({loggedIn: true});
      } else {
        this.setState({loggedIn: false});
      }
    });
  }

  render() {
    console.log(this.state)
    if (!this.state.loggedIn) {
      return <AppContainer />;
    } else {
      return <Home navigation={this.props.navigation} />;
    }
  }
}
