import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import Login from './components/Login/Login';
import Home from './components/ManageDoc/Home';
import { createAppContainer } from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack';
import auth from "firebase/auth";
import firebase from 'firebase';
import firebaseConfig from './config/firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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

const styles = StyleSheet.create({
  container: { height: "70%" }, //changed here
  // contentContainer: { flex: 1, padding: 20, justifyContent: "center" },
  // input: { backgroundColor: "#eee" },
  // button: { backgroundColor: "purple", padding: 20 },
  // buttonText: { color: "#fff", fontWeight: "bold" },
  // flexGrow:1,
  // height:'100%'
});

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
      return <AppContainer />
  //     <KeyboardAvoidingView
  //     behavior="height" //changed here
  //     style={styles.container}
  // >
  //   <AppContainer />
  //   </KeyboardAvoidingView>;
    } else {
      return <Home navigation={this.props.navigation} />
  //     <KeyboardAvoidingView
  //     behavior="height" //changed here
  //     style={styles.container}
  // ><Home navigation={this.props.navigation} /></KeyboardAvoidingView>;
    }
  }
}
