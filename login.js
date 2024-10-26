// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAudSrlFFYf-2hklnNujgIQnWq5oqVtgY",
  authDomain: "chat-app-df5eb.firebaseapp.com",
  projectId: "chat-app-df5eb",
  storageBucket: "chat-app-df5eb.appspot.com",
  messagingSenderId: "41928173902",
  appId: "1:41928173902:web:54ca9cc87f3fa8c3b0961f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Login button event listener
document.getElementById('submit').addEventListener("click", function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Logging in...");
      window.location.href = "tokitoki.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});

// Google login event listener
document.getElementById('google').addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      alert("Successfully signed in with Google");
      window.location.href = "tokitoki.html";
    })
    .catch((error) => {
      alert("Error during Google sign-in: " + error.message);
    });
});
