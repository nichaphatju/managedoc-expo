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

export const IMG_W_SIZE = 100;
export const IMG_W_SM_SIZE = 45;
export const IMG_SIZE = 150;
export const IMG_SM_SIZE = 65;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 30,
  },
  logo: {
    fontFamily: 'THSarabunNew Bold',
    fontSize: 28,
    color: '#ff6600',
  },
  imgLogo: {
    // width: 110,
    // height: 140,
  },
  imgLogoSM: {
    // width: 55,
    // height: 70,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#ff6600',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    fontFamily: 'THSarabunNew Bold',
    fontSize: 20,
    height: 50,
    color: '#ff8514',
  },
  forgot: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderWidth: 7,
    borderColor: '#ff6600',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    fontFamily: 'THSarabunNew Bold',
    fontSize: 26,
    fontWeight: '600',
    color: '#ff8514',
  },
  forgetPassText: {
    fontFamily: 'THSarabunNew Bold',
    color: '#000',
    fontSize: 16,
  },
  header: {
    paddingTop: 30,
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0.7,
    paddingBottom: 20
  },
  subHeader: {
    // paddingTop: 15,
    flex: 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4.5,
  },
  body: {
    flex: 3.7 ,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomFooter: {
    flex: 0.1,
    backgroundColor: '#ff6600',
  },
  keyboardAvoidContainer: {
    flex: 1,
    // backgroundColor: 'orange'
  }
});

export {styles};
