import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Helper function to create user profile
async function createProfile(user) {
  const userProfile = {
    username: user.displayName || user.email.split('@')[0],
    email: user.email,
    bio: "",
    status: "Hey there! I am using Tokitoki."
  };
  await setDoc(doc(db, "profiles", user.uid), userProfile);
}

// Register with email and password
document.getElementById('submit').addEventListener("click", function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      await createProfile(userCredential.user);
      window.location.href = "edit-profile.html";
    })
    .catch(handleError);
});

// Google Sign-In
document.getElementById('google').addEventListener("click", function (event) {
  event.preventDefault();

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      await createProfile(user);
      window.location.href = "edit-profile.html";
    })
    .catch(handleError);
});

// Error handler
function handleError(error) {
  console.error("Error:", error.message);
  alert(error.message);
}