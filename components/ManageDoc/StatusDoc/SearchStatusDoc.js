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

    this.state = {
      isLoading: false,
      loading: true,
    }
  }

  componentWillMount(){
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
            newArr.push(fbObject[key]);
        });
      that.setState({loading:false, docs: newArr });
    });
  }

  onChangeSearchFilter = (searchString) =>{
    this.setState({loading:true,searchString:searchString});
    this.state.docs.filter((doc) => {
      doc.topic == searchString;
    })
    this.setState({loading:false,searchString:searchString,docs: this.state.docs});
  }

  statusPage = () => {
    console.log('statusPage');
    this.props.navigation.navigate('StatusDoc');
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
          onPress={() => this.statusPage()}>
          <TouchableOpacity
            style={liststyles.subItemTop}
            onPress={() => this.statusPage()}>
            <Icon
              name="account-circle"
              style={liststyles.itemIcon}
              onPress={() => this.statusPage()}
            />
            <TouchableOpacity
              style={liststyles.rowStyle}
              onPress={() => this.statusPage()}>
              <Text style={liststyles.itemText}>{doc.selectedUser}</Text>
              <Text style={liststyles.itemTextDetail}>วันนี้ 11.30 น.</Text>
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
                onChangeText={(searchString) => {
                  this.setState({searchString});
                }}
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
    SearchStatusDoc: {screen: SearchStatusDocScreen},
    // AssignDoc: {
    //   screen: AssignDoc,
    //   navigationOptions: {
    //     headerShown: false,
    //   },
    // },
    StatusDoc: {screen: StatusDoc},
  },
  {
    initialRouteName: 'SearchStatusDoc',
  },
);

const SearchStatusDoc = createAppContainer(SearchStatusNavigator);

export default SearchStatusDoc;