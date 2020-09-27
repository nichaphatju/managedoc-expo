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
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Animated,
  Keyboard
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {styles,IMG_SIZE,IMG_SM_SIZE,IMG_W_SIZE,IMG_W_SM_SIZE} from './styles';

import {AssignDoc} from '../ManageDoc/AssignDoc/AssignDoc';
import * as Font from 'expo-font'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'

// import {createAppContainer} from 'react-navigation';
// import {createStackNavigator} from 'react-navigation-stack';
// import auth from '@react-native-firebase/auth';
import firebase from 'firebase';

export default class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
        loading: true,
        keyboardHeight: new Animated.Value(0),
        imageHeight : new Animated.Value(IMG_SIZE)
    }
    // this.keyboardHeight = new Animated.Value(0);
    this.imageHeight = new Animated.Value(IMG_SIZE);
    this.imageWidth = new Animated.Value(IMG_W_SIZE);
  }

  animateKeyboardHeight = (toValue, duration) => {
    Animated.timing(
      this.imageHeight,
      {toValue, duration},
    ).start();
  };

  animateKeyboardWidth = (toValue, duration) => {
    Animated.timing(
      this.imageWidth,
      {toValue, duration},
    ).start();
  };

  async componentWillMount() {
    // this.setState({imageHeight : IMG_SIZE})
    // this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
    // this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    if (Platform.OS === "android") {
      this.keyboardShowListener = Keyboard.addListener("keyboardDidShow", ({endCoordinates}) => {
        this.animateKeyboardHeight(IMG_SM_SIZE, 0)
        this.animateKeyboardWidth(IMG_W_SM_SIZE,0);
      });
      this.keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
        this.animateKeyboardHeight(IMG_SIZE, 300)
        this.animateKeyboardWidth(IMG_W_SIZE,300);
      })
    }
    await Font.loadAsync({
        'THSarabunNew': require('../../assets/fonts/THSarabunNew.ttf'),
        'THSarabunNew Bold': require('../../assets/fonts/THSarabunNew_Bold.ttf')
    })
    this.setState({ loading: false })
  }

  componentWillUnmount() {
    // this.keyboardWillShowSub.remove();
    // this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    console.log('keyboardWillShow')
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
      }),
      Animated.timing(this.imageHeight, {
        duration: event.duration,
        toValue: IMG_SM_SIZE,
      }),
    ]).start();
  };

  keyboardWillHide = (event) => {
    console.log('keyboardWillHide')
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }),
      Animated.timing(this.imageHeight, {
        duration: event.duration,
        toValue: IMG_SIZE,
      }),
    ]).start();
  };

  _onLogin = () => {
    var that = this;
    // let id = this.props.id;
    if (this.state != null) {
      if(this.state.username !== undefined && this.state.password !== undefined){
        firebase.auth()
          .signInWithEmailAndPassword(this.state.username, this.state.password)
          .then(() => {
            var userInfo = firebase.auth().currentUser;
            var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
            console.log('User account created & signed in!');
            firebase.database().ref('users/' + displayName).on('value', function(data) {
              var currentName = data != null && data !== undefined && data.val() != null && data.val().name != null && data.val().name !== undefined && data.val().name != '' ? data.val().name : '';
              that.props.navigation.navigate('Home',{
                currentName: currentName,
              });
            });
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

            console.error(error);
          });
      }else{
        alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      }
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
        <SafeAreaView style={styles.container}>
        <KeyboardAwareView style={styles.keyboardAvoidContainer} behavior="height">
        <ScrollView>
         {/* <ScrollView style={{flex:1}}>
         <KeyboardAwareView style={{flex:1,padding: 10,}} enableOnAndroid extraHeight={Platform.OS === "android" ? 10 : undefined}> */}
          <View style={styles.container}>
            <View style={styles.header}>
              <Animated.Image source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/managedocument-cc7fd.appspot.com/o/applogo.png?alt=media&token=9e7e3d0f-c8d8-4f16-96c2-f21692a3b1cd',
                }}
                style={{ width:this.imageWidth, height: this.imageHeight }} />
              {/* <Image
                style={styles.imgLogo}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/managedocument-cc7fd.appspot.com/o/applogo.png?alt=media&token=9e7e3d0f-c8d8-4f16-96c2-f21692a3b1cd',
                }}
              /> */}
            </View>
            <View style={styles.subHeader}>
              <Text style={styles.logo}>ยินดีต้อนรับสู่ ระบบการบริหารงาน</Text>
              <Text style={styles.logo}>โรงเรียนปากท่อพิทยาคม</Text>
            </View>
            {/* <Animated.View style={{height: this.state.keyboardHeight}}/> */}
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
          </ScrollView>
        </KeyboardAwareView>
        </SafeAreaView>
        // </ScrollView>
      );
    }
  }
}
