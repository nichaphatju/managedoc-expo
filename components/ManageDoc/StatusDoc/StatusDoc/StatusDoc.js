import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Picker,
  ScrollView,
  Image
} from 'react-native';

import {styles} from './styles';
import firebase from 'firebase';
import {CheckBox} from "native-base";
import PDFReader from 'rn-pdf-reader-js'
import renderIf from '../../renderIf';
import Timeline from 'react-native-timeline-flatlist'

export class StatusDoc extends Component {

  constructor(props) {
    super(props);
    this.histories = []
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
        attachment: {},
        status:'done'
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
      docKey:"",
      status : 'done',
      histories : [],
      history : [],
      currentUserName: '',
      editable : true,
      fileType:'',
    };
  }

  loadStatusOptions() {
    return this.state.statusOptions.map((option) => (
      <Picker.Item key={option.key} label={option.name} value={option.key} />
    ));
  }

  async componentDidMount() {
    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    var that = this;
    that.setState({currentUserName : displayName});
    const newHistories = [];
    // console.log(this.props.navigation.state.params.docId);
    that.setState({docKey: this.props.navigation.state.params.docId});
    var assignDocRef = firebase.database().ref('assignDoc');
    assignDocRef.child(this.props.navigation.state.params.docId).on('value', function(data) {
      var timeline = {};
      var valObj = data.val();
      var dt = that.convertDateTime(valObj['updatedDate']);
      timeline.time = dt;
      timeline.title = valObj['selectedType'];
      timeline.description = 'ส่งถึง '+valObj['assignTo'];
      timeline.lineColor = '#D3D3D3';
      timeline.circleColor = that.getDotTimelineColor(valObj['status']);
      newHistories.push(timeline);

      // console.log('arrReslt');
      // console.log(arrReslt);
      // console.log('VAL');
      // console.log(valObj.topic)
      // console.log('[status] >> '+valObj['status'])
      var currentStatus = valObj['status'];
      if(currentStatus == 'assign') currentStatus = '';
      var editable = displayName == valObj['assignTo'];
      console.log(' that.state.currentUserName '+displayName);
      console.log(' assign to '+valObj['assignTo']);
      that.setState({recordData : valObj, status:currentStatus, editable : editable})
    });
    assignDocRef.on('value', function(data) {
      // console.log(data)
      const newArr = [];
      if(data.val() != null && data.val() !== undefined){
        const fbObject = data.val();
          Object.keys(fbObject).map( (key,index)=>{
              var timeline = {};
              fbObject[key]['Id'] = key;
              var obj = fbObject[key];
              var thisDocName = obj['docName'];
              // console.log('thisDocName :: ',thisDocName)
              // console.log('that.props.navigation.state.params.docId :: ',that.props.navigation.state.params.docId)
              if(thisDocName == that.props.navigation.state.params.docId){
                var dt = that.convertDateTime(obj['updatedDate']);
                timeline.time = dt;
                timeline.title = obj['selectedType'];
                timeline.description = 'ส่งถึง '+obj['assignTo'];
                timeline.lineColor = '#D3D3D3';
                timeline.circleColor = that.getDotTimelineColor(obj['status']);
                newArr.push(obj);
                newHistories.push(timeline);
              }
          });
      }
      // that.setState({ histories:newArr });
      // console.log('newHistories >> ',newHistories)
      that.histories = newHistories;
    });
    const ref = firebase.storage().ref('files/'+this.props.navigation.state.params.docId);
    ref.getMetadata().then(meta => {
      console.log(meta.contentType)
      ref.getDownloadURL().then(url => {
        console.log('url >> '+url)
        that.setState({pdfFileUrl:url,fileType:meta.contentType})
      })
    });
  }

  getDotTimelineColor(status){
    return status == null || status == '' || status === undefined || status == 'assign' ? 'red' : status == 'done' ? '#51DD17' : 'yellow';
  }

  convertDateTime(dtStr){
    var dt = new Date(dtStr),
    mnth = ("0" + (dt.getMonth() + 1)).slice(-2),
    day = ("0" + dt.getDate()).slice(-2),
    hr = ("0" + dt.getHours()).slice(-2),
    min = ("0" + dt.getMinutes()).slice(-2);
    return [day,mnth,dt.getFullYear()].join("/") + ' ' + hr +':'+min;
  }

  updateData = () =>{
    var that = this;
    console.log(this.state.currentUserName)
    if(this.state.sendType != '' && this.state.sendTo == ''){
      alert('กรุณาเลือกผู้รับเอกสารต่อ');
    }else if(this.state.currentUserName != that.state.recordData.assignTo){
      alert('ไม่สามารถบันทึกได้ เนื่องจากเอกสารนี้ถูกส่งถึง '+that.state.recordData.assignTo)
    }else{
      console.log('recordData ',that.state.recordData)
      console.log('DOC KEY ::: '+that.state.docKey);
      var oldrecord = that.state.recordData;
      oldrecord.status = that.state.status;
      firebase.database().ref('assignDoc/' + that.state.docKey).update({
        status: that.state.status
      });
      this.back();
    }

  }

  back = () => {
    console.log('back');
    this.props.navigation.goBack();
  };

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
                onPress={this.updateData} >บันทึก</Text>
          </View>
        </View>
        <View style={{flex:3,justifyContent:'center'}}>
                {renderIf(this.state.pdfFileUrl != null && this.state.pdfFileUrl != undefined && this.state.pdfFileUrl != '' && this.state.fileType == 'application/pdf',                     <PDFReader
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
        <ScrollView  style={{flex:1}}>  
        <View style={styles.contentLayout}>
            <View style={styles.row}>
              <Text style={styles.headLabelText}>ปรับปรุงสถานะเอกสาร</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>สถานะ :</Text>
              <Picker
                enabled={this.state.editable}
                style={styles.inputText}
                selectedValue={this.state.status}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({status: itemValue})
                }
                >
                {this.loadStatusOptions()}
              </Picker>
            </View>
        </View>
        <Timeline
          data={this.histories}
        />
        </ScrollView>
        <View style={styles.bottomFooter} />
      </View>
    );
  }
}

export default StatusDoc;