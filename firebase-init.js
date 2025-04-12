// Import and configure Firebase (using compat for simplicity)
const firebaseConfig = {
    apiKey: "AIzaSyAj40-FgrPIw6rsFD11N2nONClKsKQCE-o",
    authDomain: "slayers-path.firebaseapp.com",
    projectId: "slayers-path",
    storageBucket: "slayers-path.appspot.com",
    messagingSenderId: "626619457761",
    appId: "1:626619457761:web:ccca7726488316198f97a0",
    measurementId: "G-2010CEH6TM"
  };
  const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "your-project.firebaseapp.com",
    // ...rest of config
  };
  
  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged((user) => {
    if (!user && window.location.pathname.includes("index.html")) {
      window.location.href = "login.html";
    }
  });
    
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Optional: Analytics (you can skip this)
  firebase.analytics();
  
  // Initialize Firebase Auth
  const auth = firebase.auth();
  
  // Sign Up function
  function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const style = document.getElementById("starterStyle").value;
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
  
        // Save starter style to database
        firebase.database().ref("users/" + uid).set({
          email: email,
          breathing: style,
          exp: 0,
          rank: "Mizunoto"
        });
  
        alert(`Welcome to the Corps! Your style: ${style}`);
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  }
  
  
  // Sign In function
  function signIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Signed in:", userCredential.user);
      })
      .catch((error) => {
        console.error("Signin error:", error.message);
      });
  }
  
  // Log Out
  function signOut() {
    return auth.signOut().then(() => {
      console.log("User signed out.");
    });
  }
  
  // Optional: Check current user
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("Logged in as:", user.email);
      // Call functions here like loadStats(user.uid);
    } else {
      console.log("No user logged in");
    }
  });
  auth.onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("login-section").style.display = "none";
      document.getElementById("game-content").style.display = "block";
      console.log("User signed in:", user.email);
      // Optionally load user data here
    } else {
      document.getElementById("login-section").style.display = "block";
      document.getElementById("game-content").style.display = "none";
    }
  });
    