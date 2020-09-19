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
import * as Notifications from 'expo-notifications';
// import { Notifications as Notifications2 } from 'expo';
// import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const AppNavigator = createStackNavigator(
  {
    Login: {screen: Login,navigationOptions: {
      headerShown: false,
    }},
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

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: true,
//   }),
// });

export default class App extends React.Component {
  state = {loggedIn: false,notification : {}};

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user)
      if (user) {
        this.setState({loggedIn: true});
      } else {
        this.setState({loggedIn: false});
      }
    });
    // Notifications.addNotificationReceivedListener(this._handleNotification);
    
    // Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
    }

  // _handleNotification = notification => {
  //   this.setState({ notification: notification });
  //   };

  // _handleNotificationResponse = response => {
  //   console.log(response);
  //   };

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
