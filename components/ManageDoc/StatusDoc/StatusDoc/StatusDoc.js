import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Picker
} from 'react-native';

import {styles} from './styles';
import firebase from 'firebase';
import {CheckBox} from "native-base";

export class StatusDoc extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userList: [
        {name: 'admin', position: 'Admin User',key: 'admin'},
        {name: 'employee', position: 'Employee User',key: 'user'},
        {name: 'dev', position: 'Developer User',key: 'dev'},
      ],
      statusOptions: [
        {name: 'ดำเนินการเสร็จสิ้น', key: 'done'},
        {name: 'กำลังดำเนินการ', key: 'on process'}
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
        attachment: {}
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

  loadStatusOptions() {
    return this.state.statusOptions.map((user) => (
      <Picker.Item key={user.key} label={user.name} value={user.key} />
    ));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerLayout}>
          <Text style={styles.headerText}>สถานะเอกสาร</Text>
        </View>
        <View style={styles.subHeaderLayout}>
          <View>
            <Text 
                style={styles.subHeaderText}
                onPress={this.submitForm} >บันทึก</Text>
          </View>
        </View>
        <View style={styles.contentLayout}>

          <View style={styles.row}>
            <Text style={styles.labelText}>สถานะ :</Text>
            <Picker
              style={styles.inputText}
              selectedValue={this.state.formValue.selectedUser}
              // onValueChange={(itemValue, itemIndex) =>
              //   this.setState({selectedUser: itemValue})
              // }
              >
              {this.loadStatusOptions()}
            </Picker>
          </View>
        </View>
        <View style={styles.bottomFooter} />
      </View>
    );
  }
}

export default StatusDoc;