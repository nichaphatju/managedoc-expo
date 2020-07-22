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
// import {createAppContainer} from 'react-navigation';
// import {createStackNavigator} from 'react-navigation-stack';
import { createAppContainer,createBottomTabNavigator } from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack';

import {styles} from './styles';
// import database from '@react-native-firebase/database';
// import storage from '@react-native-firebase/storage';

// import Home from '../Home';
// import SearchAssignDoc from './SearchAssignDoc/SearchAssignDoc';
// import SearchAcceptDoc from '../AcceptDoc/SearchAcceptDoc/SearchAcceptDoc';
import BottomNavigation, {
  FullTab,
} from 'react-native-material-bottom-navigation';
// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
// import FileInput from 'react-simple-file-input';
// var FileInput = require('react-simple-file-input');
// var allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];
import firebase from 'firebase';
import { FileSystem } from 'expo-document-picker';
import * as DocumentPicker from 'expo-document-picker';
// import { FilePond, File, registerPlugin } from 'react-filepond';

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
    };
  }

  componentWillMount(){
    let that = this;
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
            newArr.push(fbObject[key]);
        });
      console.log(newArr)
      that.setState({loading:false, userList: newArr, assignTo: newArr[0].name });
    });
  }

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

  submitForm = () =>{
    console.log('submitForm')
    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    var itemsRef = firebase.database().ref().child(`assignDoc`);
    let formValues = this.state.formValue;
    formValues.selectedType = this.state.selectedType;
    formValues.assignTo = this.state.assignTo;
    formValues.updatedDate = new Date().toString();
    formValues.assignBy = displayName;
    console.log(formValues)
    itemsRef.push(formValues).then((snap) => {
      const key = snap.key 
      console.log('key ==> '+key)
      console.log('attachment ==> ',this.state.formValue.attachment)
      // var historyRef = firebase.database().ref().child(`histories`);
      var f = {uri : this.state.formValue.attachment.uri, name : key};
      this.uploadFile(f).then(
        function(res) {
          console.log('##uploadToFirebase##')
          console.log(JSON.stringify(res))
          console.log('Upload file '+ key +' successfully.');
        }
      ).catch(
        function(errors) {
            let message = 'Upload file error'; // Default error message
            console.log(message);
            console.log(JSON.stringify(errors))
        }
      );  
      this.assignPage();
    }).catch(err => {
      alert("เกิดข้อผิดพลาด")
      console.log(JSON.stringify(err));
    })
  }

  generateDocId(){

  }

  assignPage = () => {
    console.log('assignPage');
    this.props.navigation.navigate('ManageDoc');
  };

  render() {
    const {classes, checkboxValue, checkboxLabel, checked} = this.props;
    const {checkboxes} = this.state;

    return (
      <View style={styles.container}>
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
              <Text style={styles.chkBoxFileNameText}>{this.state.file.name}</Text>
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
      </View>
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
