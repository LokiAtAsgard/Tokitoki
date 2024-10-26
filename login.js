
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

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Helper function to handle errors
function handleError(error) {
  let message;
  switch (error.code) {
    case "auth/invalid-email": message = "Invalid email format"; break;
    case "auth/user-not-found": message = "No account found for this email."; break;
    case "auth/wrong-password": message = "Incorrect password"; break;
    case "auth/email-already-in-use": message = "Email already used"; break;
    default: message = error.message;
  }
  alert(message);
}

// Email and password login
function loginWithEmail(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("Login successful, redirecting...");
      window.location.href = "tokitoki.html";
    })
    .catch(handleError);
}

// Google sign-in login
function loginWithGoogle(event) {
  event.preventDefault();

  signInWithPopup(auth, provider)
    .then(() => {
      console.log("Google sign-in successful, redirecting...");
      window.location.href = "tokitoki.html";
    })
    .catch(handleError);
}

// Ensure elements are available and add event listeners
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById('submit');
  const googleBtn = document.getElementById('google');

  if (submitBtn) submitBtn.addEventListener("click", loginWithEmail);
  if (googleBtn) googleBtn.addEventListener("click", loginWithGoogle);
});
