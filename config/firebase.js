import firebase from 'firebase'

const firebaseConfig = {
    apiKey: 'AIzaSyA862xM6VcLK66LZX_9u08famBpYiyjOVI',
    authDomain: 'managedocument-cc7fd.firebaseapp.com',
    databaseURL: 'https://managedocument-cc7fd.firebaseio.com',
    projectId: 'managedocument-cc7fd',
    storageBucket: 'managedocument-cc7fd.appspot.com',
    // messagingSenderId: 'XXXX',
    // appId: 'XXXX'
}

// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig)

export default Firebase