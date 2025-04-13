const firebaseConfig = {
  apiKey: "AIzaSyAj40-FgrPIw6rsFD11N2nONClKsKQCE-o",
  authDomain: "slayers-path.firebaseapp.com",
  projectId: "slayers-path",
  storageBucket: "slayers-path.appspot.com",
  messagingSenderId: "626619457761",
  appId: "1:626619457761:web:ccca7726488316198f97a0",
  measurementId: "G-2010CEH6TM"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
