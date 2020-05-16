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

export class AcceptDoc extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerLayout}>
          <Text style={styles.headerText}>รับเอกสาร</Text>
        </View>
        <View style={styles.contentLayout}/>
        <View style={styles.bottomFooter} />
      </View>
    );
  }
}

export default AcceptDoc;
