import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'column',
    // paddingTop: 20,
  },
  headerLayout: {
    flex: 1.2,
    backgroundColor: '#ff6600',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'THSarabunNew Bold',
    color: '#FFF',
    fontSize: 32,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  contentLayout: {
    flex: 10,
    alignItems: 'center',
    paddingTop: 10,
  },
  bottomFooter: {
    flex: 0.2,
    backgroundColor: '#ff6600',
  },
});

export {styles};
