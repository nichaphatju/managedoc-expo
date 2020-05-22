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
      userList: [
        {name: 'admin', position: 'Admin User',key: 'admin'},
        {name: 'employee', position: 'Employee User',key: 'user'},
        {name: 'dev', position: 'Developer User',key: 'dev'},
      ],
      docTypes: [
        {label: 'A', value: 'A'},
        {label: 'B', value: 'B'},
        {label: 'C', value: 'C'},
        {label: 'D', value: 'D'},
      ],
      formValue : {
        selectedUser: '',
        selectedType: 'A',
        attachment: {},
        topic: '',
        updatedDate: ''
      },
      activeTab: 'send',
      avatar: "",
      isUploading: false,
      progress: 0,
      avatarURL: "",
      files: [], //ใช้เก็บข้อมูล File ที่ Upload
      cancelButtonClicked: false,
      file: {}
    };
  }

  loadUsers() {
    return this.state.userList.map((user) => (
      <Picker.Item key={user.key} label={user.name} value={user.name} />
    ));
  }

  handleCheckboxgroupChange = (updatedUsecaseCBState) => {
    this.setState({
      checkboxes: updatedUsecaseCBState,
    });
  };

  handleCheckBoxChanged = (val) => {
    // var docTypes = this.state.docTypes;
    // docTypes.forEach((ele, i) => {
    //   if (i == index) {
    //     // ele.value = !ele.value;
    //     // if (ele.value) {
    //       this.setState({selectedType: ele.value});
    //     // }
    //     console.log(this.state.selectedType);
    //   } else {
    //     ele.value = '';
    //   }
    // });
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
    let result = await DocumentPicker.getDocumentAsync({});
    // alert(result.uri);
    console.log(result);
    if(result.type == 'success'){
      this.state.formValue.attachment = this.uriToBlob(result.uri);
      this.state.file = result;
      console.log(this.state.file)
    }
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
      
      xhr.send(null);
    });
  }

  uploadToFirebase = (blob) => {
    return new Promise((resolve, reject)=>{
      var storageRef = firebase.storage().ref();
      storageRef.child('files/photo.jpg').put(blob, {
        contentType: '*/*'
      }).then((snapshot)=>{
        blob.close();
        resolve(snapshot);
      }).catch((error)=>{
        reject(error);
      });
    });
  }

  submitForm = () =>{
    console.log('submitForm')
    this.state.formValue.updatedDate = new Date();
    var itemsRef = firebase.database().ref().child(`assignDoc`)
    let formValues = this.state.formValue;
    console.log(formValues)
    itemsRef.push(formValues)
    // this.uploadToFirebase(formValues.attachment);
  }

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
              selectedValue={this.state.formValue.selectedUser}
              onValueChange={(itemValue, itemIndex) =>
                this.state.formValue.selectedUser = itemValue
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
                  checked={this.state.formValue.selectedType === 'A'}
                  onPress={() => this.handleCheckBoxChanged('A')}
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
                  checked={this.state.formValue.selectedType === 'B'}
                  onPress={() => this.handleCheckBoxChanged('B')}
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
                  checked={this.state.formValue.selectedType === 'C'}
                  onPress={() => this.handleCheckBoxChanged('C')}
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
                  checked={this.state.formValue.selectedType === 'D'}
                  onPress={() => this.handleCheckBoxChanged('D')}
                  style={styles.checkBoxChoice}
                />
                <Text style={styles.chkBoxText}>
                  เพื่อโปรดพิจารณาอนุเคราะห์
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
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
              <Text style={styles.chkBoxText}>{this.state.file.name}</Text>
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
