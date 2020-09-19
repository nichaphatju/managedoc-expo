import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {styles} from './styles';
// import firebase from '../../../database/firebase';
// import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import SearchAssignDoc from './AssignDoc/SearchAssignDoc/SearchAssignDoc';
import SearchAcceptDoc from './AcceptDoc/SearchAcceptDoc/SearchAcceptDoc';
import SearchStatusDoc from './StatusDoc/SearchStatusDoc';
import ManageDoc from './ManageDoc';
import * as Font from 'expo-font'
import firebase from 'firebase';
import Constants from 'expo-constants';
// import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import {Notifications} from 'expo';

class HomeScreen extends Component {
  _isMounted = false;

  constructor(props) {
    super(props)

    this.state = {
        loading: true,
    }
  }

  async componentWillMount() {
    this._isMounted = true;
    await Font.loadAsync({
        'THSarabunNew': require('../../assets/fonts/THSarabunNew.ttf'),
        'THSarabunNew Bold': require('../../assets/fonts/THSarabunNew_Bold.ttf')
    })
    if (this._isMounted) {
      this.setState({ loading: false })
    }
    this.getPushNotificationPermissions();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _onLogout = () => {
    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    console.log(displayName)
    firebase.database().ref('users/' + displayName).update({
      deviceToken : ''
    });
    firebase.auth().signOut();
  };

  assignPage = () => {
    console.log('assignPage');
    this.props.navigation.navigate('SearchAssignDoc');
  };

  acceptPage = () => {
    console.log('acceptPage');
    this.props.navigation.navigate('SearchAcceptDoc');
  };

  statusPage = () => {
    console.log('statusPage');
    this.props.navigation.navigate('SearchStatusDoc');
  };

  getPushNotificationPermissions = async () => {
    console.log(' ### getPushNotificationPermissions ###')
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
    console.log(finalStatus)
    // Get the token that uniquely identifies this device
    var token = await Notifications.getExpoPushTokenAsync();
    console.log("Notification Token: ", token);
    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    console.log(displayName)
    firebase.database().ref('users/' + displayName).update({
      deviceToken : token,
      username : userInfo.email
    });
  }

  render() {
    const {navigate} = this.props.navigation;

    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    console.log(userInfo);
    this.state = {
      displayName: displayName,
      // uid: firebase.auth().currentUser.uid,
    };
    if (this.state.loading) {
      return <ActivityIndicator/>
    }else{
      return (
        <View style={styles.container}>
          <View style={styles.headerLayout}>
            <Text style={styles.headerText}>
              สวัสดี คุณ {this.state.displayName}
            </Text>
            <View style={styles.contentCenter}>
              <View style={styles.lineHeader} />
            </View>
            <Icon
              name="email"
              style={styles.headerText}
              color="white"
              onPress={() => this.acceptPage()}
            />
          </View>
          <View style={styles.headerLine} />
          <Text style={styles.menuHeaderText}>เลือกรายการที่คุณต้องการ</Text>
          <View style={styles.contentLayout}>
            <TouchableOpacity
              style={styles.menuContentView}
              onPress={() => navigate('SearchAssignDoc')}>
              <TouchableOpacity onPress={() => this.assignPage()}>
                <Text style={styles.menuText}>ส่งเอกสาร</Text>
              </TouchableOpacity>
              <Icon
                name="arrow-forward"
                style={styles.menuIcon}
                color="white"
                onPress={() => this.assignPage()}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuContentView}
              onPress={() => this.acceptPage()}>
              <TouchableOpacity onPress={() => this.acceptPage()}>
                <Text style={styles.menuText}>รับเอกสาร</Text>
              </TouchableOpacity>
              <Icon
                name="arrow-forward"
                style={styles.menuIcon}
                color="white"
                onPress={() => this.acceptPage()}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuContentView}
              onPress={() => this.statusPage()}>
              <TouchableOpacity onPress={() => this.statusPage()}>
                <Text style={styles.menuText}>สถานะเอกสาร</Text>
              </TouchableOpacity>
              <Icon
                name="arrow-forward"
                style={styles.menuIcon}
                color="white"
                onPress={() => this.statusPage()}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logOutBtn}
              onPress={() => this._onLogout()}>
              <Text style={styles.logOutText}>ออกจากระบบ</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerLayout}>
            <Text style={styles.footerText}>
              ระบบการบริหารงานโรงเรียนปากท่อพิทยาคม
            </Text>
          </View>
          <View style={styles.bottomFooter} />
        </View>
      );
    }
  }
}

const HomeNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SearchAssignDoc: {
      screen: SearchAssignDoc,
      navigationOptions: {
        headerShown: false,
      },
    },
    SearchAcceptDoc: {
      screen: SearchAcceptDoc,
      navigationOptions: {
        headerShown: false,
      },
    },
    SearchStatusDoc: {
      screen: SearchStatusDoc,
      navigationOptions: {
        headerShown: false,
      },
    },
    ManageDoc: {
      screen: ManageDoc,
      navigationOptions: {
        headerShown: false,
      },
    }
  },
  {
    initialRouteName: 'Home',
  },
);

const Home = createAppContainer(HomeNavigator);

export default Home;
