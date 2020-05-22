import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import {styles} from './styles';
import {withNavigation} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StatusDoc from './StatusDoc/StatusDoc';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import * as Font from 'expo-font'
import firebase from 'firebase';

export class SearchStatusDocScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
        loading: true,
    }
  }

  async componentWillMount() {
    // await Font.loadAsync({
    //     'THSarabunNew': require('../../../../assets/fonts/THSarabunNew.ttf'),
    //     'THSarabunNew Bold': require('../../../../assets/fonts/THSarabunNew_Bold.ttf')
    // })
    this.setState({ loading: false })
  }

  statusPage = () => {
    console.log('statusPage');
    this.props.navigation.navigate('StatusDoc');
  };

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
          <View style={styles.contentLayout}>
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