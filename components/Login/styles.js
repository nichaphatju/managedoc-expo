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
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 30,
  },
  logo: {
    fontFamily: 'THSarabunNew Bold',
    fontSize: 30,
    color: '#ff6600',
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
    paddingTop: 10,
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  body: {
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomFooter: {
    flex: 0.2,
    backgroundColor: '#ff6600',
  },
});

export {styles};
