import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Picker,
  Dimensions,
  ScrollView,
  SafeAreaView
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
import PDFReader from 'rn-pdf-reader-js'
import * as FileSystem from 'expo-file-system';
import renderIf from '../renderIf';

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
      file: {},
      pdfFileUrl:"",
      recordData:{},
      annouceType: "",  // ทราบ,เห็นชอบ
      status: "",     // สถานะ
      sendType:"",    // แจ้ง,มอบ
      sendTo:""
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

  async componentDidMount() {
    var that = this;
    console.log('componentDidMount')
    console.log(this.props.navigation.state.params.docId)
    firebase.database().ref('assignDoc/'+this.props.navigation.state.params.docId).on('value', function(data) {
      that.setState({recordData:data})
    });
    const ref = firebase.storage().ref('files/'+this.props.navigation.state.params.docId);
    ref.getDownloadURL().then(url => {
      console.log('url >> '+url)
      that.setState({pdfFileUrl:url})
    })
  }

  assignPage = () => {
    console.log('assignPage');
    this.props.navigation.navigate('ManageDoc');
  };

  componentWillMount() {
    console.log('componentWillMount')
    console.log(this.props.navigation.state.params.docId)
    let that = this;
    firebase.database().ref('users/').on('value', function(data) {
      console.log(data)
      const fbObject = data.val();
        const newArr = [];
        newArr.push({ key: '' , name : 'กรุณาเลือก'})
        Object.keys(fbObject).map( (key,index)=>{
            // fbObject[key]['username'] = key;
            newArr.push(fbObject[key]);
        });
      console.log(newArr)
      that.setState({loading:false, userList: newArr, assignTo: newArr[0].name });
    });
  }

  submitForm = () =>{
    console.log('submitForm')
    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    var that = this;
    if(this.state.sendType != '' && this.state.sendTo == ''){
      alert('กรุณาเลือกผู้รับเอกสารต่อ');
    }else{
      console.log('recordData ',that.state.recordData)
      var oldrecord = that.state.recordData;
      oldrecord.announceType = that.state.annouceType;
      oldrecord.status = that.state.status;
      var docName = that.state.recordData.key;
      if(that.state.recordData.docName != null && that.state.recordData.docName !== undefined && that.state.recordData.docName != '') docName = that.state.recordData.docName;
      firebase.database().ref('assignDoc/' + that.state.recordData.key).update({
        announceType : that.state.annouceType,
        status: that.state.status
      });
      if(this.state.sendType != '' && this.state.sendTo != ''){
        var itemsRef = firebase.database().ref().child(`assignDoc`);
        let formValues = that.state.recordData[that.state.recordData.key];
        formValues.selectedType = this.state.sendType;
        formValues.assignTo = this.state.sendTo;
        formValues.updatedDate = new Date().toString();
        formValues.assignBy = displayName;
        formValues.docName = that.state.recordData.key;
        formValues.isSendFrom = true;
        formValues.status = 'assign';
        console.log(formValues)
        itemsRef.push(formValues).then((snap) => {
          const key = snap.key 
          this.assignPage();
        }).catch(err => {
          alert("เกิดข้อผิดพลาด")
          console.log(JSON.stringify(err));
        })
      }
    }

  }

  handleAnnouceCheckBoxChanged = (val) => {
    console.log(val)
    this.setState({annouceType: val});
  };

  handleSendCheckBoxChanged = (val) => {
    console.log(val)
    this.setState({sendType: val});
  };

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
        <SafeAreaView style={styles.containerSA}>
          <View style={{flex:1,justifyContent:'center'}}>
                {renderIf(this.state.pdfFileUrl != null && this.state.pdfFileUrl != undefined && this.state.pdfFileUrl != '', 
                    <PDFReader
                      style={styles.pdf}
                      source={{
                        uri: this.state.pdfFileUrl,
                      }}
                      withScroll={true}
                  />
                )}
          </View>
          </SafeAreaView>
          <View style={{flex:1,justifyContent:'center'}}>
          <View style={styles.row}>
            <View style={styles.chkBoxContainerCol}>
              <View style={styles.chkBoxContainerRow}>
                <CheckBox 
                  color="#FF9900"
                  checked={this.state.annouceType === 'ทราบ'}
                  onPress={() => this.handleAnnouceCheckBoxChanged('ทราบ')}
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
                  checked={this.state.annouceType === 'เห็นชอบ'}
                  onPress={() => this.handleAnnouceCheckBoxChanged('เห็นชอบ')}
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
              selectedValue={this.state.status}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({status: itemValue})
              }
              >
              {this.loadStatusOptions()}
            </Picker>
          </View>
          <View style={styles.row}>
            <View style={styles.chkBoxContainerCol}>
              <View style={styles.chkBoxContainerRow}>
                <CheckBox 
                  color="#FF9900"
                  checked={this.state.sendType === 'แจ้ง'}
                  onPress={() => this.handleSendCheckBoxChanged('แจ้ง')}
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
                  checked={this.state.sendType === 'มอบ'}
                  onPress={() => this.handleSendCheckBoxChanged('มอบ')}
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
              selectedValue={this.state.sendTo}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({sendTo: itemValue})
              }
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
          {/* </View> */}
          {/* </SafeAreaView> */}
          {/* </ScrollView> */}
        </View>
        <View style={styles.bottomFooter} />
      </View>
    );
  }
}

export default AcceptDoc;
