import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Picker,
  ScrollView
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
    this.histories = [
      {time: '09:00', title: 'Event 1', description: 'Event 1 Description'},
      {time: '10:45', title: 'Event 2', description: 'Event 2 Description'},
      {time: '12:00', title: 'Event 3', description: 'Event 3 Description'},
      {time: '14:00', title: 'Event 4', description: 'Event 4 Description'},
      {time: '16:30', title: 'Event 5', description: 'Event 5 Description'}
    ]
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
      history : []
    };
  }

  loadStatusOptions() {
    return this.state.statusOptions.map((option) => (
      <Picker.Item key={option.key} label={option.name} value={option.key} />
    ));
  }

  async componentDidMount() {
    
    var that = this;
    const newHistories = [];
    console.log('componentDidMount')
    console.log(this.props.navigation.state.params.docId);
    that.setState({docKey: this.props.navigation.state.params.docId});
    var assignDocRef = firebase.database().ref('assignDoc');
    assignDocRef.child(this.props.navigation.state.params.docId).on('value', function(data) {
      const arrReslt = Object.values(data.val());
      var timeline = {};
      var dt = that.convertDateTime(data.val()['updatedDate']);
      timeline.time = dt;
      timeline.title = data.val()['selectedType'];
      timeline.description = 'ส่งถึง '+data.val()['assignTo'];
      newHistories.push(timeline);

      console.log('arrReslt');
      console.log(arrReslt);
      console.log('VAL');
      console.log(data.val().topic)
      that.setState({recordData:data.val()})
    });
    assignDocRef.on('value', function(data) {
      console.log(data)
      const newArr = [];
      if(data.val() != null && data.val() !== undefined){
        const arrReslt = Object.values(data.val());
        const fbObject = data.val();
          Object.keys(fbObject).map( (key,index)=>{
              var timeline = {};
              fbObject[key]['Id'] = key;
              var thisDocName = fbObject[key]['docName'];
              console.log('thisDocName :: ',thisDocName)
              console.log('that.props.navigation.state.params.docId :: ',that.props.navigation.state.params.docId)
              if(thisDocName == that.props.navigation.state.params.docId){
                var dt = that.convertDateTime(fbObject[key]['updatedDate']);
                timeline.time = dt;
                timeline.title = fbObject[key]['selectedType'];
                timeline.description = 'ส่งถึง '+fbObject[key]['assignTo'];
                newArr.push(fbObject[key]);
                newHistories.push(timeline);
              }
          });
      }
      // that.setState({ histories:newArr });
      console.log('newHistories >> ',newHistories)
      that.histories = newHistories;
    });
    const ref = firebase.storage().ref('files/'+this.props.navigation.state.params.docId);
    ref.getDownloadURL().then(url => {
      console.log('url >> '+url)
      that.setState({pdfFileUrl:url})
    })
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
    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    var that = this;
    if(this.state.sendType != '' && this.state.sendTo == ''){
      alert('กรุณาเลือกผู้รับเอกสารต่อ');
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
        <ScrollView  style={{flex:1}}>  
        <View style={styles.contentLayout}>
            <View style={styles.row}>
              <Text style={styles.headLabelText}>ปรับปรุงสถานะเอกสาร</Text>
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