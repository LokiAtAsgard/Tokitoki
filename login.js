
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

// Email and password login
function loginWithEmail(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "tokitoki.html";
    })
    .catch(handleError);
}

// Google Sign-In
function loginWithGoogle(event) {
  event.preventDefault();

  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "tokitoki.html";
    })
    .catch(handleError);
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('submit').addEventListener("click", loginWithEmail);
  document.getElementById('google').addEventListener("click", loginWithGoogle);
});

// Error handler
function handleError(error) {
  console.error("Error:", error.message);
  alert(error.message);
}