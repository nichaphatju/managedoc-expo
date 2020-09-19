import React, {Component, useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Picker
} from 'react-native';
import {CheckBox} from "native-base"
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { createAppContainer,createBottomTabNavigator } from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';

import {styles} from './styles';

// import Home from '../Home';
// import SearchAssignDoc from './SearchAssignDoc/SearchAssignDoc';
// import SearchAcceptDoc from '../AcceptDoc/SearchAcceptDoc/SearchAcceptDoc';
import BottomNavigation, {
  FullTab,
} from 'react-native-material-bottom-navigation';
import firebase from 'firebase';
import { FileSystem } from 'expo-document-picker';
import * as DocumentPicker from 'expo-document-picker';
// import { FilePond, File, registerPlugin } from 'react-filepond';
import renderIf from '../renderIf';

import Constants from 'expo-constants';
// import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import {Notifications} from 'expo';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });
export class AssignDoc extends Component {
  tabs = [
    {
      key: 'home',
      label: 'หน้าแรก',
      barColor: '#FF9934',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'home',
    },
    {
      key: 'send',
      label: 'ส่งเอกสาร',
      barColor: '#FF9934',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'send',
    },
    {
      key: 'accept',
      label: 'รับเอกสาร',
      barColor: '#FF9934',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'assignment',
    },
    {
      key: 'status',
      label: 'สถานะ',
      barColor: '#FF9934',
      pressColor: 'rgba(255, 255, 255, 0.16)',
      icon: 'assignment-turned-in',
    },
  ];

  constructor(props) {
    super(props);
    // Use this.setState({userTypes: data}) when data comes from
    // database()
    //   .ref('/users')
    //   .once('value')
    //   .then((snapshot) => {
    //     console.log('User data: ', snapshot.val());
    //   });
    this.cancelButtonClicked = this.cancelButtonClicked.bind(this);
    this.resetCancelButtonClicked = this.resetCancelButtonClicked.bind(this);
    this.showProgressBar = this.showProgressBar.bind(this);
    this.updateProgressBar = this.updateProgressBar.bind(this);
    this.handleFileSelected = this.handleFileSelected.bind(this);

    this.state = {
      userList: [],
      formValue : {
        assignTo: '',
        selectedType: 'เพื่อโปรดทราบ',
        attachment: {},
        topic: '',
        updatedDate: new Date(),
        status: 'assign'
      },
      selectedType:'เพื่อโปรดทราบ',
      assignTo: '',
      activeTab: 'send',
      avatar: "",
      isUploading: false,
      progress: 0,
      avatarURL: "",
      files: [], //ใช้เก็บข้อมูล File ที่ Upload
      cancelButtonClicked: false,
      file: {},
      uploadValue: 0, //ใช้เพื่อดู Process การ Upload
      filesMetadata:[], //ใช้เพื่อรับข้อมูล Metadata จาก Firebase
      rows:  [], //ใช้วาด DataTable
      fileName:'',
      // expoPushToken = useState(''),
      // setExpoPushToken = useState(false),
      // notificationListener = useRef(),
      // responseListener = useRef()
    };
  }

  componentWillMount(){
    let that = this;
    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    var displayEmail = userInfo.email;
    console.log(displayName)
    var isDirector = false;
    firebase.database().ref('users/'+ displayName).on('value', function(data) {
      isDirector = data.val().isDirector == 'true' || data.val().isDirector;
      console.log(data.val().isDirector)
      console.log('isDirector '+isDirector)
      firebase.database().ref('users/').on('value', function(data) {
        console.log(data)
        const fbObject = data.val();
          const newArr = [];
          Object.keys(fbObject).map( (key,index)=>{
              console.log(key);
              console.log("||");
              console.log(index);
              console.log(fbObject[key])
              // fbObject[key]['username'] = key;
              if(fbObject[key].username !== undefined && fbObject[key].username != null && (!isDirector || (isDirector && fbObject[key]['acceptFromDirector'] == 'true' || fbObject[key]['acceptFromDirector']))) newArr.push(fbObject[key]);
          });
        console.log(newArr)
        var defaultVal = newArr && newArr.length > 0 ? newArr[0].name : '';
        that.setState({loading:false, userList: newArr, assignTo: defaultVal });
      });
    });
  }

  // registerForPushNotificationsAsync = async () => {
  //   if (Constants.isDevice) {
  //     const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     const token = await Notifications.getExpoPushTokenAsync();
  //     console.log(token);
  //     this.setState({ expoPushToken: token });
  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }
  
  //   if (Platform.OS === 'android') {
  //     Notifications.createChannelAndroidAsync('default', {
  //       name: 'default',
  //       sound: true,
  //       priority: 'max',
  //       vibrate: [0, 250, 250, 250],
  //     });
  //   }
  // };


  loadUsers() {
    return this.state.userList.map((user) => (
      <Picker.Item key={user.username} label={user.name} value={user.name} />
    ));
  }

  handleCheckboxgroupChange = (updatedUsecaseCBState) => {
    this.setState({
      checkboxes: updatedUsecaseCBState,
    });
  };

  handleCheckBoxChanged = (val) => {
    console.log(val)
    this.setState({selectedType: val});
  };

  renderIcon = (icon) => ({isActive}) => (
    <Icon size={24} color="white" name={icon} />
  );
 
  renderTab = ({ tab, isActive }) => (
    <FullTab 
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
  )

  cancelButtonClicked(){
    return this.state.cancelButtonClicked;
  }
 
  resetCancelButtonClicked(){
    this.setState({ cancelButtonClicked: false });
  }
 
  showInvalidFileTypeMessage(file){
    window.alert("Tried to upload invalid filetype " + file.type);
  }
 
  showProgressBar(){
    this.setState({ progressBarVisible: true});
  }
 
  updateProgressBar(event){
    this.setState({
      progressPercent: (event.loaded / event.total) * 100
    });
  }
 
  handleFileSelected(event, file){
    this.setState({file: file, fileContents: event.target.result});
  }

  removeDocument = () => {
    this.state.formValue.attachment = {};
    this.setState({fileName : ''});
  }

  _pickDocument = async () => {
    console.log('_pickDocument');
    let result = await DocumentPicker.getDocumentAsync({});
    // const { type, uri } = await DocumentPicker.getDocumentAsync({
    //   copyToCacheDirectory: false,
    //   type: '*/*',
    // });
    // alert(result.uri);
    // console.log(result);
    if (result.type === 'cancel') {
      return;
    }
    // console.log(type)
    console.log('pickerResponse', result);
    if(result.type == 'success'){
      // const copyAsync = await FileSystem.copyAsync({from: result.uri, to: fileUri})

      // const read = await FileSystem.readAsStringAsync(fileUri)
      // const json = JSON.parse(read)
      // console.log({json})

      this.setState({fileName : result.name});
      this.state.formValue.attachment = result;
      console.log(this.state.formValue.attachment)
      // const response = await fetch(result.uri);
      // this.state.formValue.attachment = await response.blob();
      // const blob = await response.blob();
      // const blob = new Blob([result],{type: 'application/pdf'})
      // console.log('BLOB ==> ')
      // console.log(blob)
      // const fetchResponse = await fetch(uri);
      // console.log('fetchResponse', fetchResponse);
      // const blob = await fetchResponse.blob();
      // console.log('blob', blob);
      // await fetch(uri)
      //           .then(response => response.blob())  //--> fetch the fileUri to blob
      //           .then(blob => {
      //               // console.log(blob)		
                    // this.uploadFile(result).then(
                    //       function(res) {
                    //         console.log('##uploadToFirebase##')
                    //         console.log(res)
                    //         console.log('Upload file '+ result.name +' successfully.');
                    //       }
                    //     ).catch(
                    //       function(errors) {
                    //           let message = 'Upload file error'; // Default error message
                    //           console.log(message);
                    //           console.log(errors)
                    //       }
                    //     );   				
      //               // var reader = new FileReader();
      //               // reader.readAsDataURL(blob);		//--> The readAsDataURL method is used to read the contents of the specified Blob or File. 
      //               // reader.onloadend = () => {
      //               //     var base64 = reader.result;
      //               //     this.setState({
      //               //         fileUrl: uri,
      //               //         fileName: result.name,
      //               //         fileData: base64,                //--> put the set state on the onloadend method
      //               //     });
      //               //     console.log(base64);
      //               // };
      //           })
      //           .catch(error => console.error(error))   
      // this.state.file = result;
      // console.log(this.state.file)
    }else{
      console.log('++ upload error ++');
      console.log(result)
    }
  }

  uploadFile = async(f) => {
    const response = await fetch(f.uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("files/"+f.name);
    return ref.put(blob);
  }

  uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
      };
      
      xhr.onerror = function() {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };
      // this helps us get a blob
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      
      // xhr.send(null);

      xhr.send();
    });
  }

  uploadToFirebase = (blob,name) => {
    return new Promise((resolve, reject)=>{
      console.log('--upload '+name+' ToFirebase--')
      console.log(blob)
      var storageRef = firebase.storage().ref();
      storageRef.child('files/'+name).put(blob, {
        contentType: '*/*'
      }).then((snapshot)=>{
        blob.close();
        //Get metadata
        storageRef.child('files/'+name).getMetadata().then((metadata) => {
            // Metadata now contains the metadata for 'filepond/${file.name}'
            let metadataFile = { 
                name: metadata.name, 
                size: metadata.size, 
                contentType: metadata.contentType, 
                fullPath: metadata.fullPath, 
                downloadURLs: metadata.downloadURLs[0], 
            }
            console.log('metadata ',metadata)
            //Process save metadata
            const databaseRef = firebase.database().ref('/filepond');
            databaseRef.push({  metadataFile });

        }).catch(function(error) {
          console.log(JSON.stringify(error))
          // this.setState({
          //     message:`Upload error : ${error.message}`
          // })
        });
        resolve(snapshot);
      }).catch((error)=>{
        reject(error);
      });
    });
  }

  sendPushNotification=async(expoPushToken)=> {
    console.log(expoPushToken)
    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'คุณได้รับเอกสารจาก '+displayName,
      body: 'กรุณาตรวจสอบเอกสาร',
      data: { data: 'โปรดตรวจสอบเอกสารในเมนูรับเอกสาร' },
      badge: 1
    };
    console.log(message)
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }).then(res => {
      console.log(JSON.stringify(res));
    }).catch(err => {
      console.error(err)
    })
  }
  

  submitForm = () =>{
    // this.sendPushNotification()
    console.log('submitForm')
    var that = this;
    // firebase.database().ref('users/'+this.state.assignTo).on('value', function(data) {
    //   console.log('push noti tooo ',data);
    //   console.log(data.val().deviceToken)
    //   var targetDeviceToken = data.val().deviceToken;
    //   that.sendPushNotification(targetDeviceToken);
    // })
    var userInfo = firebase.auth().currentUser;
    var displayEmail = userInfo.email;
    var displayName = displayEmail.substring(0, displayEmail.indexOf('@'));
    var itemsRef = firebase.database().ref().child(`assignDoc`);
    let formValues = this.state.formValue;
    formValues.selectedType = this.state.selectedType;
    formValues.assignTo = this.state.assignTo;
    formValues.updatedDate = new Date().toString();
    formValues.assignBy = displayName;
    console.log(formValues)
    if(formValues.attachment.uri === undefined || formValues.attachment.uri == null || formValues.attachment.uri ==''){
      alert('กรุณาแนบเอกสารก่อนบันทึก');
    }else if(formValues.topic === undefined || formValues.topic == null || formValues.topic ==''){
      alert('กรุณาระบุเรื่อง');
    }else{
      console.log('pass validate')
      firebase.database().ref('users/'+formValues.assignTo).on('value', function(data) {
        console.log('push noti tooo ',data);
        console.log(data.val().deviceToken)
        var targetDeviceToken = data.val().deviceToken;
        that.sendPushNotification(targetDeviceToken)
        var notiRef = firebase.database().ref().child(`notifications`);
        notiRef.push({
          from : displayName,
          to : that.state.assignTo,
          status : 'unread'
        })
      });
      itemsRef.push(formValues).then((snap) => {
        const key = snap.key 
        console.log('key ==> '+key)
        console.log('attachment ==> ',that.state.formValue.attachment)
        // var historyRef = firebase.database().ref().child(`histories`);
        var f = {uri : that.state.formValue.attachment.uri, name : key};
        that.uploadFile(f).then(
          function(res) {
            console.log('##uploadToFirebase##')
            console.log('Upload file '+ key +' successfully.');
            that.assignPage();
          }
        ).catch(err => {
              let message = 'Upload file error'; // Default error message
              alert('Upload file error. Pleas try again later..')
              console.log(message);
              console.log(JSON.stringify(err))
          }
        );  
      }).catch(err => {
        alert("เกิดข้อผิดพลาด")
        console.log(JSON.stringify(err));
      })
    }
  }

  generateDocId(){

  }

  assignPage = () => {
    console.log('assignPage');
    this.props.navigation.goBack();
  };

  render() {
    const {classes, checkboxValue, checkboxLabel, checked} = this.props;
    const {checkboxes} = this.state;

    return (
      <SafeAreaView style={styles.container}>
      <KeyboardAwareView style={styles.keyboardAvoidContainer} behavior="height">
        <ScrollView>
      {/* <View  style={styles.container}> */}
        <View style={styles.headerLayout}>
          <Text style={styles.headerText}>ส่งเอกสาร</Text>
        </View>
        <View style={styles.subHeaderLayout}>
          <View>
            <Text 
                style={styles.subHeaderText}
                onPress={this.submitForm} >ส่งเอกสาร</Text>
          </View>
        </View>
        <View style={styles.contentLayout}>
          <View style={styles.row}>
            <Text style={styles.labelText}>ส่งถึง :</Text>
            <Picker
              style={styles.inputText}
              selectedValue={this.state.assignTo}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ assignTo: itemValue })
                // this.state.selectedUser = itemValue.username
              }
              >
              {this.loadUsers()}
            </Picker>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>เรื่อง :</Text>
            <TextInput
              onChangeText={(text) => this.state.formValue.topic = text}
              style={styles.inputText}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.chkBoxContainerCol}>
              <View style={styles.chkBoxContainerRow}>
                <CheckBox 
                  color="#FF9900"
                  checked={this.state.selectedType == 'เพื่อโปรดทราบ'}
                  onPress={() => this.handleCheckBoxChanged('เพื่อโปรดทราบ')}
                  style={styles.checkBoxChoice}
                />
                <Text style={styles.chkBoxText}> เพื่อโปรดทราบ</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.chkBoxContainerCol}>
              <View style={styles.chkBoxContainerRow}>
                <CheckBox
                  color="#FF9900"
                  checked={this.state.selectedType == 'เพื่อโปรดพิจารณา'}
                  onPress={() => this.handleCheckBoxChanged('เพื่อโปรดพิจารณา')}
                  style={styles.checkBoxChoice}
                />
                <Text style={styles.chkBoxText}> เพื่อโปรดพิจารณา</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.chkBoxContainerCol}>
              <View style={styles.chkBoxContainerRow}>
                <CheckBox
                  color="#FF9900"
                  checked={this.state.selectedType == 'เพื่อโปรดพิจารณาอนุมัติ'}
                  onPress={() => this.handleCheckBoxChanged('เพื่อโปรดพิจารณาอนุมัติ')}
                  style={styles.checkBoxChoice}
                />
                <Text style={styles.chkBoxText}> เพื่อโปรดพิจารณาอนุมัติ</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.chkBoxContainerCol}>
              <View style={styles.chkBoxContainerRow}>
                <CheckBox
                  color="#FF9900"
                  checked={this.state.selectedType == 'เพื่อโปรดพิจารณาอนุเคราะห์'}
                  onPress={() => this.handleCheckBoxChanged('เพื่อโปรดพิจารณาอนุเคราะห์')}
                  style={styles.checkBoxChoice}
                />
                <Text style={styles.chkBoxText}>
                  เพื่อโปรดพิจารณาอนุเคราะห์
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            {/* <FilePond allowMultiple={true}
                        maxFiles={3}
                        ref= {ref => this.pond = ref}
                        server={{ process: this.handleProcessing.bind(this) }}
                        oninit={() => this.handleInit()}>
                    
                    {this.state.files.map(file => (
                        <File key={file} source={file} />
                    ))}
                    
            </FilePond> */}
          <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => this._pickDocument()}>
              <Icon
                name="attachment"
                style={styles.uploadIcon}
                onPress={() => this._pickDocument()} />
              <TouchableOpacity onPress={() => this._pickDocument()}>
                <Text style={styles.chkBoxText}>แนบเอกสาร</Text>
              </TouchableOpacity>
          </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.column}>
                <Text style={styles.chkBoxFileNameText}>{this.state.fileName}</Text>
                {renderIf(this.state.fileName != '' && this.state.fileName !== undefined, 
                  <Icon
                    name="delete"
                    style={styles.removeIcon}
                    onPress={() => this.removeDocument()} />
                  )}
            </TouchableOpacity>
          </View>
        </View>
        {/* <BottomNavigation
          activeTab={this.state.activeTab}
          onTabPress={this.pressTab}
          renderTab={this.renderTab}
          tabs={this.tabs}
        /> */}
        <View style={styles.bottomFooter} />
      {/* </View > */}
      </ScrollView>
      </KeyboardAwareView>
      </SafeAreaView>
    );
  }
}

// const AssignDocNavigator = createStackNavigator(
//   {
//     AssignDoc: {
//       screen: AssignDocScreen,
//       navigationOptions: {
//         headerShown: false,
//       },
//     },
//     SearchAssignDoc: {
//       screen: SearchAssignDoc,
//       navigationOptions: {
//         headerShown: false,
//       },
//     },
//     SearchAcceptDoc: {
//       screen: SearchAcceptDoc,
//       navigationOptions: {
//         headerShown: false,
//       },
//     },
//   },
//   {
//     initialRouteName: 'AssignDoc',
//   },
// );

// const AssignDoc = createAppContainer(AssignDocNavigator);

export default AssignDoc;
