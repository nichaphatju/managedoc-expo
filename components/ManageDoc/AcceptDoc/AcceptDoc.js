import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Picker
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {styles} from './styles';
import firebase from 'firebase';
import {CheckBox} from "native-base";

export class AcceptDoc extends Component {

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

  loadUsers() {
    return this.state.userList.map((user) => (
      <Picker.Item key={user.key} label={user.name} value={user.name} />
    ));
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
          <Text style={styles.headerText}>รับเอกสาร</Text>
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
            <View style={styles.chkBoxContainerCol}>
              <View style={styles.chkBoxContainerRow}>
                <CheckBox 
                  color="#FF9900"
                  checked={this.state.formValue.selectedType === 'A'}
                  onPress={() => this.handleCheckBoxChanged('A')}
                  style={styles.checkBoxChoice}
                />
                <Text style={styles.chkBoxText}> ทราบ</Text>
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
                <Text style={styles.chkBoxText}> เห็นชอบ</Text>
              </View>
            </View>
          </View>
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
          <View style={styles.row}>
            <View style={styles.chkBoxContainerCol}>
              <View style={styles.chkBoxContainerRow}>
                <CheckBox 
                  color="#FF9900"
                  checked={this.state.formValue.selectedType === 'A'}
                  onPress={() => this.handleCheckBoxChanged('A')}
                  style={styles.checkBoxChoice}
                />
                <Text style={styles.chkBoxText}> แจ้ง</Text>
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
                <Text style={styles.chkBoxText}> มอบ</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ส่งต่อ :</Text>
            <Picker
              style={styles.inputText}
              selectedValue={this.state.formValue.selectedUser}
              // onValueChange={(itemValue, itemIndex) =>
              //   this.setState({selectedUser: itemValue})
              // }
              >
              {this.loadUsers()}
            </Picker>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ความคิดเห็น :</Text>
          </View>
          <View style={styles.row}>
            <TextInput
                style={styles.inputTextArea}
                // underlineColorAndroid="transparent"
              />
          </View>
        </View>
        <View style={styles.bottomFooter} />
      </View>
    );
  }
}

export default AcceptDoc;
