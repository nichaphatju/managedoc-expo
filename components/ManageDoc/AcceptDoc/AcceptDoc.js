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
  SafeAreaView,
  Image
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { createAppContainer } from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack';

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
        {name: 'กรุณาเลือก', key: ''},
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
      fileType:'',
      recordData:{},
      annouceType: "",  // ทราบ,เห็นชอบ
      status: "",     // สถานะ
      sendType:"",    // แจ้ง,มอบ
      sendTo:"",
      docKey:"",
      comment:""
    };
  }

  loadUsers() {
    return this.state.userList.map((user) => (
      <Picker.Item key={user.key} label={user.name} value={user.name} />
    ));
  }

  loadStatusOptions() {
    return this.state.statusOptions.map((option) => (
      <Picker.Item key={option.key} label={option.name} value={option.key} />
    ));
  }

  async componentDidMount() {
    var that = this;
    console.log('componentDidMount')
    console.log(this.props.navigation.state.params.docId);
    that.setState({docKey: this.props.navigation.state.params.docId});
    var thisDocName = this.props.navigation.state.params.docId;
    var assignDocRef = firebase.database().ref('assignDoc');
    assignDocRef.child(this.props.navigation.state.params.docId).on('value', function(data) {
      const arrReslt = Object.values(data.val());
      console.log('arrReslt');
      console.log(arrReslt);
      console.log('VAL');
      console.log(data.val().topic)
      if(data.val().docName !== undefined) thisDocName = data.val().docName;
      const ref = firebase.storage().ref('files/'+thisDocName);
      ref.getMetadata().then(meta => {
        console.log(meta.contentType)
        ref.getDownloadURL().then(url => {
          console.log('url >> '+url)
          that.setState({pdfFileUrl:url,fileType:meta.contentType})
        })
      })
      that.setState({recordData:data.val()})
    });

  }

  back = () => {
    console.log('back');
    this.props.navigation.goBack();
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
            fbObject[key]['key'] = key;
            newArr.push(fbObject[key]);
        });
      console.log(newArr)
      that.setState({loading:false, userList: newArr, assignTo: newArr[0].name });
    });
  }

  submitForm = () =>{
    console.log('submitForm')
  }

  updateData = () =>{
    var that = this;
    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    var that = this;
    if(this.state.annouceType == '' && this.state.sendType == ''){
      alert('กรุณาเลือกก่อนกดบันทึก');
    }else if(this.state.sendType != '' && this.state.sendTo == ''){
      alert('กรุณาเลือกผู้รับเอกสารต่อ');
    }else if(this.state.annouceType != '' && this.state.status == ''){
      alert('กรุณาเลือกสถานะ');
    }else{
      console.log('recordData ',that.state.recordData)
      console.log('DOC KEY ::: '+that.state.docKey);
      var oldrecord = that.state.recordData;
      oldrecord.announceType = that.state.annouceType;
      oldrecord.status = that.state.status;
      var docName = that.state.docKey;
      if(oldrecord.docName != null && oldrecord.docName !== undefined && oldrecord.docName != '') docName = oldrecord.docName;
      firebase.database().ref('assignDoc/' + that.state.docKey).update({
        announceType : that.state.annouceType,
        status: that.state.status
        //comment: that.state.comment
      });
      if(that.state.sendType != '' && that.state.sendTo != ''){
        var itemsRef = firebase.database().ref().child(`assignDoc`);
        let newDocRecord = oldrecord;
        newDocRecord.topic = oldrecord.topic;
        newDocRecord.selectedType = that.state.sendType;
        newDocRecord.assignTo = that.state.sendTo;
        newDocRecord.updatedDate = new Date().toString();
        newDocRecord.assignBy = displayName;
        newDocRecord.docName = docName;
        newDocRecord.attachment = oldrecord.attachment;
        newDocRecord.isSendFrom = true;
        newDocRecord.status = 'assign';
        newDocRecord.comment = that.state.comment;
        console.log('newDocRecord ',newDocRecord)
        itemsRef.push(newDocRecord).then((snap) => {
          const key = snap.key 
          that.back();
        }).catch(err => {
          alert("เกิดข้อผิดพลาด")
          console.log(JSON.stringify(err));
        })
      }else{
        that.back();
      }
    }
    
    // var oldRecordData = that.state.recordData;
    // console.log('recordData :: ',oldRecordData)
    // console.log('Topic >>> ',that.state.recordData.key);
    // let assignDocRef = firebase.database().ref('/assignDoc');
    // assignDocRef.child(oldRecordData.key).update({
    //   announceType : that.state.annouceType,
    //   status: that.state.status,
    //   sendType : that.state.sendType,
    //   sendTo: that.state.sendTo,
    // }).then(() => {
    //   if(that.state.sendType != '' && that.state.sendTo != ''){
    //     console.log('oldRecordData >>> ',oldRecordData.topic);
    //     var itemsRef = firebase.database().ref().child(`assignDoc`);
    //     /* For send to another person */
    //     let newDocRecord = that.state.formValue;
    //     newDocRecord.topic = oldRecordData.topic;
    //     newDocRecord.selectedType = that.state.sendType;
    //     newDocRecord.assignBy = displayName;
    //     newDocRecord.assignTo = that.state.sendTo;
    //     newDocRecord.fileName = oldRecordData.key;
    //     // newDocRecord.attachment = that.state.recordData.attachment;
    //     newDocRecord.updatedDate = new Date().toString();
    //     console.log('New Doc Record ',newDocRecord)
    //     itemsRef.push(newDocRecord).then((snap) => {
    //       const key = snap.key 
    //       console.log('key ==> '+key)
    //       this.back();
    //     }).catch(err => {
    //       alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
    //       console.log(JSON.stringify(err));
    //     })
    //   }
    // }).catch(err => {
    //   console.log('ERROR when updating record.')
    //   console.error(err);
    // })

  }

  onChangeComment = (e) =>{
    var comment = e.nativeEvent.text;
    this.setState({comment:comment});
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
                onPress={this.updateData} >บันทึก</Text>
          </View>
        </View>
        <View style={styles.contentLayout}>
          <SafeAreaView style={styles.containerSA}>
            <View style={{flex:1,justifyContent:'center'}}>
                  {renderIf(this.state.pdfFileUrl != null && this.state.pdfFileUrl != undefined && this.state.pdfFileUrl != '' && this.state.fileType == 'application/pdf', 
                      <PDFReader
                        style={styles.pdf}
                        source={{
                          uri: this.state.pdfFileUrl,
                        }}
                        withScroll={true}
                    />
                  )}
                  {renderIf(this.state.pdfFileUrl != null && this.state.pdfFileUrl != undefined && this.state.pdfFileUrl != '' && (this.state.fileType == 'image/jpeg' || this.state.fileType == 'image/png'),                  
                      <Image
                        style={styles.photo}
                        source={{
                          uri: this.state.pdfFileUrl,
                        }}
                        withScroll={true}
                    />
                  )}
            </View>
          </SafeAreaView>
        </View>
        <ScrollView style={{flex:2.65,contentContainerStyle:'center'}}>
          <View style={{flex:1,justifyContent:'center'}}>
          <View style={styles.rowComment}>
            <Text style={styles.labelTextComment}>ความคิดเห็นจากผู้ส่ง :</Text>
          </View>
          <View style={styles.rowComment}>
            <Text style={styles.labelTextComment}>{this.state.recordData.comment != null && this.state.recordData.comment != '' ? this.state.recordData.comment : '-'}</Text>
          </View>
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
                onChange={this.onChangeComment}
                // underlineColorAndroid="transparent"
              />
          </View>
          </View>
          {/* </View> */}
          {/* </SafeAreaView> */}
          {/* </ScrollView> */}
        </ScrollView>
        <View style={styles.bottomFooter} />
      </View>
    );
  }
}

// const AcceptDocNavigator = createStackNavigator(
//   {
//     AcceptDoc: {
//       screen: AcceptDocScreen
//     },
//     // SearchAcceptDoc: {
//     //   screen: SearchAcceptDoc,
//     //   navigationOptions: {
//     //     headerShown: false,
//     //   },
//     // },
//   },
//   {
//     initialRouteName: 'AcceptDoc'
//   },
// );

// const AcceptDoc = createAppContainer(AcceptDocNavigator);

export default AcceptDoc;
