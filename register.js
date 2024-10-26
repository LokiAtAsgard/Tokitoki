// register.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
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

// Helper function to create a user profile in Firestore
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
document.getElementById('submit').addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createProfile(userCredential.user);
    window.location.href = "edit-profile.html";
  } catch (error) {
    console.error("Error creating account:", error.message);
    alert(error.message);
  }
});

// Google Sign-In
document.getElementById('google').addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent default form submission
  console.log("Attempting Google Sign-In");

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google Sign-In successful for user:", user.displayName);

    // Check if profile exists, otherwise create one
    const profileRef = doc(db, "profiles", user.uid);
    await setDoc(profileRef, {
      username: user.displayName || user.email.split('@')[0],
      email: user.email,
      bio: "",
      status: "Hey there! I am using Tokitoki."
    }, { merge: true });  // Merge to avoid overwriting existing data
    window.location.href = "edit-profile.html";
  } catch (error) {
    console.error("Error with Google Sign-In:", error.message);
    alert("Google Sign-In failed: " + error.message);
  }
});
