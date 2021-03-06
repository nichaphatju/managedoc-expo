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
    flex: 1.5,
    backgroundColor: '#ff6600',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'THSarabunNew Bold',
    color: '#FFF',
    fontSize: 32,
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 25,
  },
  subHeaderLayout: {
    flex: 0.9,
    backgroundColor: '#FF9934',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  subHeaderText: {
    flex: 0.5,
    fontFamily: 'THSarabunNew Bold',
    color: '#FFF',
    fontSize: 28,
    textAlignVertical: 'center',
    textAlign: 'center',
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
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
  column: {
    flex: 1,
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
  chkBoxFileNameText: {
    flex: 5,
    fontFamily: 'THSarabunNew Bold',
    fontSize: 18,
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
  uploadIcon: {
    fontFamily: 'THSarabunNew Bold',
    color: 'black',
    fontSize: 30,
    textAlignVertical: 'center',
    textAlign: 'center',
    borderRadius: 30,
  },
  uploadBtn: {
    width: '80%',
    backgroundColor: '#ffcc99',
    borderRadius: 30,
    height: 50,
    marginBottom: 20,
    padding: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeIcon: {
    flex: 1,
    fontFamily: 'THSarabunNew Bold',
    color: '#FF9934',
    fontSize: 32,
    textAlignVertical: 'center',
    textAlign: 'center',
    borderRadius: 30,
  },
  keyboardAvoidContainer: {
    flex: 1,
    // backgroundColor: 'orange'
  }
});

export {styles};