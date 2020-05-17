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
  subHeaderLayout: {
    flex: 1,
    backgroundColor: '#FF9934',
    // justifyContent: 'center',
    flexDirection: 'row-reverse',
  },
  subHeaderText: {
    flex: 0.5,
    fontFamily: 'THSarabunNew Bold',
    color: '#FFF',
    fontSize: 28,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  contentLayout: {
    flex: 10,
    alignItems: 'center',
    paddingTop: 10,
    flexDirection: 'column',
  },
  labelText: {
    flex: 0.3,
    fontFamily: 'THSarabunNew Bold',
    color: '#000',
    fontSize: 28,
    // textAlignVertical: 'center',
  },
  inputText: {
    flex: 1,
    fontFamily: 'THSarabunNew Bold',
    color: '#000',
    fontSize: 28,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    // textAlignVertical: 'center',
  },
  row: {
    flex: 0.1,
    width: '80%',
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    textAlign: 'center',
  },
  bottomFooter: {
    flex: 0.2,
    backgroundColor: '#ff6600',
  },
  checkBoxRoot: {
    color: 'blue',
    // '&$checked': {
    //   color: 'blue',
    // },
  },
  checked: {},
  chkBoxText: {
    fontFamily: 'THSarabunNew Bold',
    fontSize: 28,
    marginTop: 5,
    marginLeft:20,
    textAlign: 'left',
  },
  checkBoxChoice: {
    marginTop: 5,
    fontFamily: 'THSarabunNew Bold',
    color: '#000',
    fontSize: 28,
  },
  chkBoxContainerCol: {
    flexDirection: 'column',
  },
  chkBoxContainerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export {styles};