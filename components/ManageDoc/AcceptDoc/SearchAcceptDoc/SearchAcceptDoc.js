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
  FlatList
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
import AcceptDoc from '../../AcceptDoc/AcceptDoc';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import firebase from 'firebase';
import AcceptList from '../../AcceptList';
import {liststyles} from '../../liststyle';

export class SearchAcceptDocScreen extends Component {

  constructor(props) {
    super(props)
    this.onChangeSearchFilter = this.onChangeSearchFilter.bind(this);

    this.state = {
        isLoading: false,
        searchString:'',
        loading: true,
        docs: [],
        tmpDocs: []
    }
  }

  acceptPage = (docId) => {
    console.log('AcceptDoc');
    console.log(docId)
    this.props.navigation.navigate('AcceptDoc',{
      docId: docId,
    });
  };

  componentWillMount(){
    // console.log('componentWillMount')
    let that = this;
    firebase.database().ref('assignDoc/').on('value', function(data) {
      console.log(data)
      const arrReslt = Object.values(data.val());
      const fbObject = data.val();
        const newArr = [];
        Object.keys(fbObject).map( (key,index)=>{
            console.log(key);
            console.log("||");
            console.log(index);
            fbObject[key]['Id'] = key;
            var userInfo = firebase.auth().currentUser;
            var displayName = userInfo.email.substring(0, userInfo.email.indexOf('@'));
            var dt = that.convertDateTime(fbObject[key].updatedDate);
            fbObject[key].updatedDate = dt;
            if(displayName == fbObject[key].assignTo) newArr.push(fbObject[key]);
        });
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
    var docs = allData.filter((doc) => {
      searchText == '' || searchText == null || searchText === undefined || doc.topic == searchText;
    })
    console.log(docs)
    this.setState({loading:false,searchString:searchText,docs: docs});
  }

  onSearchKeyPress(e){
    this.setState({
      searchString: e.target.value
    });
  }

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
          onPress={() => this.acceptPage(doc.Id)}>
          <TouchableOpacity
            style={liststyles.subItemTop}
            onPress={() => this.acceptPage(doc.Id)}>
            <Icon
              name="account-circle"
              style={liststyles.itemIcon}
              onPress={() => this.acceptPage(doc.Id)}
            />
            <TouchableOpacity
              style={liststyles.rowStyle}
              onPress={() => this.acceptPage(doc.Id)}>
              <Text style={liststyles.itemText}>{doc.assignTo}</Text>
              <Text style={liststyles.itemTextDetail}>{doc.updatedDate}</Text>
            </TouchableOpacity>
            <Icon
              name="remove-red-eye"
              style={liststyles.itemIcon} 
            />
            <Text style={liststyles.redDot}/>
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
    return (
      <View style={styles.container}>
        <View style={styles.headerLayout}>
          <Text style={styles.headerText}>รายการ รับเอกสาร</Text>
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
        </View>
        {/* <View style={styles.contentLayout}>
          <TouchableOpacity
            style={styles.itemContentView}
            onPress={() => this.acceptPage()}>
            <TouchableOpacity
              style={styles.subItemTop}
              onPress={() => this.acceptPage()}>
              <Icon
                name="account-circle"
                style={styles.itemIcon}
                onPress={() => this.acceptPage()}
              />
              <TouchableOpacity
                style={styles.rowStyle}
                onPress={() => this.acceptPage()}>
                <Text style={styles.itemText}>ชื่อครูผู้รับ1</Text>
                <Text style={styles.itemTextDetail}>วันนี้ 11.30 น.</Text>
              </TouchableOpacity>
              <Icon
                name="remove-red-eye"
                style={styles.itemIcon}
                onPress={() => this.acceptPage()}
              />
              <Text style={styles.redDot}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.subItemBottom}
              onPress={() => this.acceptPage()}>
              <TouchableOpacity onPress={() => this.acceptPage()}>
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

const SearchAcceptNavigator = createStackNavigator(
  {
    SearchAcceptDoc: {screen: SearchAcceptDocScreen},
    AcceptDoc: {
      screen: AcceptDoc,
      navigationOptions: {
      headerShown: false,
    },},
  },
  {
    initialRouteName: 'SearchAcceptDoc',
  },
);

const SearchAcceptDoc = createAppContainer(SearchAcceptNavigator);

export default SearchAcceptDoc;