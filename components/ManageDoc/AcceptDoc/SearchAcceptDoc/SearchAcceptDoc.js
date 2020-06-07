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

export class SearchAcceptDocScreen extends Component {
  acceptPage = () => {
    console.log('AcceptDoc');
    this.props.navigation.navigate('AcceptDoc');
  };

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
              onChangeText={(searchString) => {
                this.setState({searchString});
              }}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        <View style={styles.contentLayout}>
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