import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"; 
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBAudSrlFFYf-2hklnNujgIQnWq5oqVtgY",
    authDomain: "chat-app-df5eb.firebaseapp.com",
    projectId: "chat-app-df5eb",
    storageBucket: "chat-app-df5eb.appspot.com",
    messagingSenderId: "41928173902",
    appId: "1:41928173902:web:54ca9cc87f3fa8c3b0961f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Function to create a profile in Firestore
async function createProfile(user) {
    const userProfile = {
        username: user.displayName || user.email.split('@')[0], // Default username from email
        email: user.email,
        photoURL: user.photoURL || "default-icon.png", // Default profile picture
        bio: "", // Placeholder for bio, can be edited later
        status: "Hey there! I am using Tokitoki."
    };

    // Save profile information under "profiles" collection with user ID as document ID
    await setDoc(doc(db, "profiles", user.uid), userProfile);
}

// Sign in with Google and create profile if successful
window.signInWithGoogle = function () {
  signInWithPopup(auth, provider)
      .then(async (result) => {
          const user = result.user;
          await createProfile(user); // Create profile on sign-in
          alert("Signed in successfully with Google");
          window.location.href = "edit-profile.html"; // Redirect to profile creation page
      })
      .catch((error) => {
          alert("Error during Google sign-in: " + error.message);
      });
};

document.getElementById('submit').addEventListener("click", function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
          const user = userCredential.user;
          await createProfile(user); // Create profile for new user
          alert("Creating Account...");
          window.location.href = "edit-profile.html"; // Redirect to profile creation page
      })
      .catch((error) => {
          alert("Error: " + error.message);
      });
});
