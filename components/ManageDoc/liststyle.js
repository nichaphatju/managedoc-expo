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
  
  const liststyles = StyleSheet.create({
    contentLayout: {
      flex: 10,
      alignItems: 'center',
      paddingTop: 10,
    },
    itemContentView: {
      flex: 0.2,
      width: '90%',
      backgroundColor: '#F2F2F2',
      borderRadius: 0,
      height: 90,
      marginBottom: 10,
      padding: 20,
      borderLeftWidth: 5,
      borderLeftColor: '#ff9900',
      paddingVertical: 0,
      paddingHorizontal: 0,
      flexDirection: 'column',
    },
    subItemTop: {
      flex: 1.2,
      width: '100%',
      backgroundColor: '#F2F2F2',
      borderRadius: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    subItemBottom: {
      flex: 0.7,
      backgroundColor: '#E3E7EA',
      borderRadius: 0,
      // justifyContent: 'center',
      // paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    rowStyle: {
      flex: 1,
    },
    itemText: {
      fontFamily: 'THSarabunNew Bold',
      color: '#ff6600',
      fontSize: 26,
      // textAlignVertical: 'center',
      // textAlign: 'center',
    },
    itemTextDetail: {
      fontFamily: 'THSarabunNew Bold',
      color: '#ff6600',
      fontSize: 20,
      // textAlignVertical: 'center',
      // textAlign: 'center',
    },
    itemTextTopic: {
      fontFamily: 'THSarabunNew Bold',
      color: '#000',
      fontSize: 26,
      textAlignVertical: 'center',
      textAlign: 'center',
    },
    itemIcon: {
      flex: 0.2,
      fontFamily: 'THSarabunNew Bold',
      color: '#ff6600',
      fontSize: 30,
      textAlignVertical: 'center',
      textAlign: 'center',
      borderRadius: 30,
    },
    redDot: {
      height: 10,
      width: 10,
      backgroundColor: 'red',
      borderRadius: 50,
      display: 'flex',
    },
    greenDot: {
      height: 10,
      width: 10,
      backgroundColor: '#51DD17',
      borderRadius: 50,
      display: 'flex',
    },
    yellowDot: {
      height: 10,
      width: 10,
      backgroundColor: 'yellow',
      borderRadius: 50,
      display: 'flex',
    },
  });
  
export {liststyles};  