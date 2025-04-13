// auth.js

document.addEventListener("DOMContentLoaded", () => {
    const waitForFirebase = setInterval(() => {
      if (typeof firebase !== "undefined" && firebase.auth && firebase.database) {
        clearInterval(waitForFirebase);
  
        const auth = firebase.auth();
        const db = firebase.database();
  
        // ✅ Only redirect if user is logged in AND on login page
        auth.onAuthStateChanged(user => {
          if (user) {
            console.log("Already signed in:", user.email);
            window.location.href = "game.html"; // ✅ redirect to your real app page
          }
        });
  
        // 🔐 Login
        window.signIn = function () {
          const email = document.getElementById("email").value.trim();
          const password = document.getElementById("password").value;
  
          auth.signInWithEmailAndPassword(email, password)
            .then(() => {
              alert("Welcome back!");
              window.location.href = "game.html";
            })
            .catch(error => {
              console.error("Sign-in error:", error);
              document.getElementById("errorMessage").textContent = "❌ " + error.message;
            });
        };
  
        // 📝 Signup
        window.signUp = function () {
          const email = document.getElementById("email").value.trim();
          const password = document.getElementById("password").value;
          const style = document.getElementById("starterStyle").value;
  
          auth.createUserWithEmailAndPassword(email, password)
            .then(userCred => {
              const uid = userCred.user.uid;
              return db.ref("users/" + uid).set({
                email,
                starterStyle: style,
                strength: 30,
                speed: 30,
                voice: 30,
                skin: 30,
                rank: "Mizunoto",
                gold: 100
              });
            })
            .then(() => {
              alert("Account created! Redirecting...");
              window.location.href = "game.html";
            })
            .catch(err => {
              console.error("Sign-up error:", err);
              document.getElementById("errorMessage").textContent = "❌ " + err.message;
            });
        };
      }
    }, 100);
  });
  