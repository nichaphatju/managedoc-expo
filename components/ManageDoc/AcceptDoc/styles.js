import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions 
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
    flex: 0.45,
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
    flex: 0.25,
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
    marginRight: 10
  },
  contentLayout: {
    flex: 2.5,
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
  inputTextArea: {
    flex: 1,
    fontFamily: 'THSarabunNew Bold',
    color: '#000',
    fontSize: 28,
    height: 100,
    borderColor: 'gray', 
    borderWidth: 1
  },
  row: {
    flex: 0.1,
    width: '80%',
    marginHorizontal: 10,
    // marginVertical: 10,
    flexDirection: 'row',
    textAlign: 'center',
  },
  bottomFooter: {
    flex: 0.05,
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
  pdf: {
    width: Dimensions.get('window').width,
    height: 500,
    backgroundColor:'#000'
  },
  photo: {
    width: 300,
    height: 500,
  },
  containerSA : {
    flex: 1,
    // marginTop: Constants.statusBarHeight,
    marginHorizontal: 16
  },
});

export {styles};
