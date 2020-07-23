import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  YellowBox
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {styles} from './styles';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AssignDoc from '../AssignDoc';
import AcceptDoc from '../../AcceptDoc/AcceptDoc';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import * as Font from 'expo-font'
import firebase from 'firebase';
import ItemList from '../../ItemList';
import {liststyles} from '../../liststyle';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export class SearchAssignDocScreen extends Component {
  
  constructor(props) {
    super(props)
    this.onChangeSearchFilter = this.onChangeSearchFilter.bind(this);

    this.state = {
        isLoading: false,
        searchString:'',
        loading: true,
        docs: [],
        currentUser: {},
        tmpDocs: []
    }
  }

  componentWillMount(){
    let that = this;
    // await Font.loadAsync({
    //     'THSarabunNew': require('../../../../assets/fonts/THSarabunNew.ttf'),
    //     'THSarabunNew Bold': require('../../../../assets/fonts/THSarabunNew_Bold.ttf')
    // })    
    // firebase.auth().listUsers(1000)
    //   .then(function(listUsersResult) {
    //     listUsersResult.users.forEach(function(userRecord) {
    //       console.log('user', userRecord.toJSON());
    //     });
    //     if (listUsersResult.pageToken) {
    //       // List next batch of users.
    //       listAllUsers(listUsersResult.pageToken);
    //     }
    //   })
    // .catch(function(error) {
    //   console.log('Error listing users:', error);
    // });
    firebase.database().ref('assignDoc/').on('value', function(data) {
      console.log(data)
      const newArr = [];
      if(data.val() != null && data.val() !== undefined){
        const arrReslt = Object.values(data.val());
        const fbObject = data.val();
          Object.keys(fbObject).map( (key,index)=>{
              // console.log(key);
              // console.log("||");
              // console.log(index);
              // console.log(user)
              fbObject[key]['Id'] = key;
              var userInfo = firebase.auth().currentUser;
              var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
              var dt = that.convertDateTime(fbObject[key].updatedDate);
              fbObject[key].updatedDate = dt;
              console.log('>>'+dt)
              if(displayName == fbObject[key].assignBy) newArr.push(fbObject[key]);
          });
      }
      that.setState({loading:false, docs: newArr, tmpDocs:newArr });
    });
    
  }

  convertDateTime(dtStr){
    var dt = new Date(dtStr),
    mnth = ("0" + (dt.getMonth() + 1)).slice(-2),
    day = ("0" + dt.getDate()).slice(-2),
    hr = ("0" + dt.getHours()).slice(-2),
    min = ("0" + dt.getMinutes()).slice(-2);
    return [day,mnth,dt.getFullYear()].join("/") + ' ' + hr +':'+min;
  }

  assignPage = () => {
    console.log('AssignDoc');
    this.props.navigation.navigate('AssignDoc');
  };

  onChangeSearchFilter = (e) =>{
    var searchText = e.nativeEvent.text;
    this.setState({loading:true,searchString:searchText});
    var allData = this.state.tmpDocs;
    console.log(allData.length)
    var docs = allData.filter((doc) => 
      searchText == '' || searchText == null || searchText === undefined 
      || doc.topic == searchText || doc.topic.toLowerCase().includes(searchText.toLowerCase())
      || doc.assignTo == searchText || doc.assignTo.toLowerCase().includes(searchText.toLowerCase())
    )
    console.log(docs)
    this.setState({loading:false,searchString:searchText,docs: docs});
  }

  render() {
    if (this.state.loading) {
      return <ActivityIndicator/>
    }else{
      return (
        <View style={styles.container}>
          <View style={styles.headerLayout}>
            <Text style={styles.headerText}>รายการ ส่งเอกสาร</Text>
          </View>
          <View style={styles.headerLine} />
          <View style={styles.subHeaderLayout}>
            <View style={styles.inputView}>
              <Icon
                style={styles.searchIcon}
                name="search"
                size={20}
                color="#FFF"
              />
              <TextInput
                style={styles.inputText}
                placeholder="ค้นหาเอกสาร"
                placeholderTextColor="#FFF"
                onChange={this.onChangeSearchFilter}
                underlineColorAndroid="transparent"
              />
            </View>
            <View>
              <Icon
                style={styles.addIcon}
                name="add-circle-outline"
                size={20}
                color="#FFF"
                onPress={() => this.assignPage()}
              />
            </View>
          </View>
          {/* <View style={styles.contentLayout}>
            <TouchableOpacity
              style={styles.itemContentView}>
              <TouchableOpacity
                style={styles.subItemTop}>
                <Icon
                  name="account-circle"
                  style={styles.itemIcon}
                />
                <TouchableOpacity
                  style={styles.rowStyle}
                  onPress={() => this.assignPage()}>
                  <Text style={styles.itemText}>{this.state.assignTo}</Text>
                  <Text style={styles.itemTextDetail}>{doc.updatedDate}</Text>
                </TouchableOpacity>
                <Icon
                  name="remove-red-eye"
                  style={styles.itemIcon} 
                />
                <Text style={styles.redDot}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subItemBottom}
                >
                <TouchableOpacity >
                  <Text style={styles.itemTextTopic}>{doc.topic}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </View> */}
          <View style={styles.contentLayout}>
            <FlatList
                  data={this.state.docs}
                  renderItem={({item}) => this.renderRow(item)}
                  keyExtractor={(item, index) => item.Id}
                  onRefresh={() => this.renderRefreshControl()}
                  refreshing={this.state.isLoading}
                  initialNumToRender={3}
                  contentContainerStyle={{
                      flexGrow: 0,
                  }}
              />
            </View>             
          {/* <View style={styles.contentLayout}>
            <ItemList docs={this.state.docs}/>
          </View> */}
          <View style={styles.bottomFooter} />
        </View>
      );
    }
  }

  getDotStyle(doc) {
    if(doc.status == null || doc.status == '' || doc.status === undefined) {
      return liststyles.redDot;
    } else if(doc.status == 'done') {
      return liststyles.greenDot;
    } else {
      return liststyles.yellowDot;
    }
  }


  renderRefreshControl() {
    this.setState({ isLoading: true })
    // this.props.getPosts();
  }
  
  renderRow = (doc) => {
    return (
      <View style={liststyles.contentLayout}>
        <TouchableOpacity
          style={liststyles.itemContentView}>
          <TouchableOpacity
            style={liststyles.subItemTop}>
            <Icon
              name="account-circle"
              style={liststyles.itemIcon}
            />
            <TouchableOpacity
              style={liststyles.rowStyle}>
              <Text style={liststyles.itemText}>{doc.assignTo}</Text>
              <Text style={liststyles.itemTextDetail}>{doc.updatedDate}</Text>
            </TouchableOpacity>
            <Icon
              name="remove-red-eye"
              style={liststyles.itemIcon} 
            />
            <Text style={doc.status == null || doc.status == '' || doc.status === undefined || doc.status == 'assign' ? liststyles.redDot : doc.status == 'done' ? liststyles.greenDot : liststyles.yellowDot}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={liststyles.subItemBottom}
            >
            <TouchableOpacity >
              <Text style={liststyles.itemTextTopic}>{doc.topic}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }
}

const SearchAssignNavigator = createStackNavigator(
  {
    SearchAssignDoc: {screen: SearchAssignDocScreen},
    AssignDoc: {
      screen: AssignDoc,
      navigationOptions: {
        headerShown: false,
      },
    },
    AcceptDoc: {screen: AcceptDoc},
  },
  {
    initialRouteName: 'SearchAssignDoc',
  },
);

const SearchAssignDoc = createAppContainer(SearchAssignNavigator);

export default SearchAssignDoc;
