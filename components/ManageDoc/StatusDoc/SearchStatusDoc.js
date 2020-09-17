import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native';

import {styles} from './styles';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StatusDoc from './StatusDoc/StatusDoc';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import * as Font from 'expo-font'
import firebase from 'firebase';
import StatusList from '../../ManageDoc/StatusList';
import {liststyles} from '../liststyle';

export class SearchStatusDocScreen extends Component {

  constructor(props) {
    super(props)
    this.onChangeSearchFilter = this.onChangeSearchFilter.bind(this);

    this.state = {
      isLoading: false,
      loading: true,
      docs: [],
      tmpDocs: [],
      currentUserName: ''
    }
  }

  componentWillMount(){
    let that = this;
    var userInfo = firebase.auth().currentUser;
    var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
    this.setState({currentUserName : displayName});
    console.log(this.state.currentUserName)
    firebase.database().ref('assignDoc/').on('value', function(data) {
      console.log(data)
      const newArr = [];
      if(data.val() != null && data.val() !== undefined){
        const arrReslt = Object.values(data.val());
        const fbObject = data.val();
          Object.keys(fbObject).map( (key,index)=>{
              // console.log(key);
              // console.log("||");9
              // console.log(index);
              // console.log(user)
              fbObject[key]['Id'] = key;
              fbObject[key].dateSort = new Date(fbObject[key].updatedDate);
              var dt = that.convertDateTime(fbObject[key].updatedDate);
              fbObject[key].updatedDate = dt;
              console.log('>>'+dt)
              if(displayName == fbObject[key].assignTo || displayName == fbObject[key].assignBy) newArr.push(fbObject[key]);
          });
          newArr.sort(function(a, b){return b['dateSort']-a['dateSort']});
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

  onChangeSearchFilter = (e) =>{
    console.log('searchString')
    console.log(e.nativeEvent.text)
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

  statusPage = (docId) => {
    console.log('statusPage');
    this.props.navigation.navigate('StatusDoc',{
      docId: docId,
    });
  };

  listenForDocs(tmpDocs) {
    tmpDocs.on('value', (dataSnapshot) => {
        var docs = [];
        dataSnapshot.forEach((child) => {
            docs.push({
                name: child.val().title,
                _key: child.key
            });
        });

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(docs)
        });
    });
  }

  renderRefreshControl() {
    this.setState({ isLoading: true })
    // this.props.getPosts();
  }


  renderRow = (doc) => {
    return (
      <View style={liststyles.contentLayout}>
        <TouchableOpacity
          style={liststyles.itemContentView}
          onPress={() => this.statusPage(doc.Id)}>
          <TouchableOpacity
            style={liststyles.subItemTop}
            onPress={() => this.statusPage(doc.Id)}>
            <Icon
              name="account-circle"
              style={liststyles.itemIcon}
              onPress={() => this.statusPage(doc.Id)}
            />
            <TouchableOpacity
              style={liststyles.rowStyle}
              onPress={() => this.statusPage(doc.Id)}>
              <Text style={liststyles.itemText}>{doc.assignTo}</Text>
              <Text style={liststyles.itemTextDetail}>{doc.updatedDate}</Text>
            </TouchableOpacity>
            {/* <Icon
              name="remove-red-eye"
              style={liststyles.itemIcon} 
            /> */}
            <Text >{this.state.currentUserName == doc.assignTo ? 'ปรับปรุงสถานะ ' : 'ดูสถานะ '}</Text> 
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

  render() {
    if (this.state.loading) {
      return <ActivityIndicator/>
    }else{
      return (
        <View style={styles.container}>
          <View style={styles.headerLayout}>
            <Text style={styles.headerText}>รายการ สถานะเอกสาร</Text>
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
            {/* <View>
              <Icon
                style={styles.addIcon}
                name="add-circle-outline"
                size={20}
                color="#FFF"
                onPress={() => this.assignPage()}
              />
            </View> */}
          </View>
          {/* <View style={styles.contentLayout}>
            <TouchableOpacity
              style={styles.itemContentView}
              onPress={() => this.statusPage()}>
              <TouchableOpacity
                style={styles.subItemTop}
                onPress={() => this.statusPage()}>
                <Icon
                  name="account-circle"
                  style={styles.itemIcon}
                  onPress={() => this.statusPage()}
                />
                <TouchableOpacity
                  style={styles.rowStyle}
                  onPress={() => this.statusPage()}>
                  <Text style={styles.itemText}>ชื่อครูผู้รับ1</Text>
                  <Text style={styles.itemTextDetail}>วันนี้ 11.30 น.</Text>
                </TouchableOpacity>
                <Icon
                  name="remove-red-eye"
                  style={styles.itemIcon}
                  onPress={() => this.statusPage()}
                />
                <Text style={styles.redDot}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subItemBottom}
                onPress={() => this.statusPage()}>
                <TouchableOpacity onPress={() => this.statusPage()}>
                  <Text style={styles.itemTextTopic}>ชื่อเรื่อง</Text>
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
          <View style={styles.bottomFooter} />
        </View>
      );
    }
  }
}

const SearchStatusNavigator = createStackNavigator(
  {
    SearchStatusDoc: {
        screen: SearchStatusDocScreen
      },
    // AssignDoc: {
    //   screen: AssignDoc,
    //   navigationOptions: {
    //     headerShown: false,
    //   },
    // },
    StatusDoc: {screen: StatusDoc,
      navigationOptions: {
        headerShown: false,
      },},
  },
  {
    initialRouteName: 'SearchStatusDoc',
  },
);

const SearchStatusDoc = createAppContainer(SearchStatusNavigator);

export default SearchStatusDoc;