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
  Picker,
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
      selectedUser: '',
      docTypes: [
        {label: 'A', value: 'A'},
        {label: 'B', value: 'B'},
        {label: 'C', value: 'C'},
        {label: 'D', value: 'D'},
      ],
      selectedType: 'A',
      activeTab: 'send',
      avatar: "",
      isUploading: false,
      progress: 0,
      avatarURL: "",
      files: [], //ใช้เก็บข้อมูล File ที่ Upload
      cancelButtonClicked: false
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

  // fileIsIncorrectFiletype = (file) => {
  //   if (allowedFileTypes.indexOf(file.type) === -1) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
   

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
            <Text style={styles.subHeaderText}>ส่งเอกสาร</Text>
          </View>
        </View>
        <View style={styles.contentLayout}>
          <View style={styles.row}>
            <Text style={styles.labelText}>ส่งถึง :</Text>
            <Picker
              style={styles.inputText}
              selectedValue={this.state.selectedUser}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({selectedUser: itemValue})
              }>
              {this.loadUsers()}
            </Picker>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>เรื่อง :</Text>
            <TextInput
              style={styles.inputText}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.chkBoxContainerCol}>
              <View style={styles.chkBoxContainerRow}>
                <CheckBox 
                  color="#FF9900"
                  checked={this.state.selectedType === 'A'}
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
                  checked={this.state.selectedType === 'B'}
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
                  checked={this.state.selectedType === 'C'}
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
                  checked={this.state.selectedType === 'D'}
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
          {/* <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer'}}> */}
            {/* <Text style={styles.chkBoxText}>Select your awesome avatar</Text> */}
            {/* <FileInput
              readAs='binary'
              style={ { display: 'none' } }
 
              onLoadStart={this.showProgressBar}
              onLoad={this.handleFileSelected}
              onProgress={this.updateProgressBar}
 
              // cancelIf={this.fileIsIncorrectFiletype()}
              abortIf={this.cancelButtonClicked}
 
              onCancel={this.showInvalidFileTypeMessage}
              onAbort={this.resetCancelButtonClicked}
             /> */}
          {/* </label> */}
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
