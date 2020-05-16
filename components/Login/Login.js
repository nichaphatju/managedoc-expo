import React, {Component, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
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

import {AssignDoc} from '../ManageDoc/AssignDoc/AssignDoc';
import * as Font from 'expo-font'

// import {createAppContainer} from 'react-navigation';
// import {createStackNavigator} from 'react-navigation-stack';
// import auth from '@react-native-firebase/auth';
import firebase from 'firebase';

export default class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
        loading: true,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
        'THSarabunNew': require('../../assets/fonts/THSarabunNew.ttf'),
        'THSarabunNew Bold': require('../../assets/fonts/THSarabunNew_Bold.ttf')
    })
    this.setState({ loading: false })
  }
  _onLogin = () => {
    // let id = this.props.id;
    if (this.state != null) {
      firebase.auth()
        .signInWithEmailAndPassword(this.state.username, this.state.password)
        .then(() => {
          console.log('User account created & signed in!');
          this.props.navigation.navigate('Home');
        })
        .catch((error) => {
          console.log('login username ' + this.state.username + 'error');
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          } else if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            this.renderAlertMsg('', 'invalid email address');
          } else {
            this.renderAlertMsg('', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
          }

          // console.error(error);
        });
    } else {
    }
  };

  renderAlertMsg = (title, content) => {
    Alert.alert(
      title,
      content,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  };

  render() {
    if (this.state.loading) {
      return <ActivityIndicator/>
    }else{
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.logo}>ยินดีต้อนรับสู่ ระบบการบริหารงาน</Text>
            <Text style={styles.logo}>โรงเรียนปากท่อพิทยาคม</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="ชื่อผู้ใช้"
                placeholderTextColor="#ff8514"
                onChangeText={(text) => this.setState({username: text})}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                secureTextEntry
                style={styles.inputText}
                placeholder="รหัสผ่าน"
                placeholderTextColor="#ff8514"
                onChangeText={(text) => this.setState({password: text})}
              />
            </View>
            <TouchableOpacity>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => this._onLogin()}>
              <Text style={styles.loginText}>เข้าสู่ระบบ</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgetPassText}>ลืมรหัสผ่าน?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomFooter} />
        </View>
      );
    }
  }
}
