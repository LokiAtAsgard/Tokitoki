
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { signInWithGoogle } from "./authHelper.js";
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

async function createProfile(user) {
  const userProfile = {
    username: user.displayName || user.email.split('@')[0],
    email: user.email,
    photoURL: user.photoURL || "default-icon.png",
    bio: "",
    status: "Hey there! I am using Tokitoki."
  };
  await setDoc(doc(db, "profiles", user.uid), userProfile);
}

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

document.getElementById('google').addEventListener("click", function () {
  signInWithGoogle(auth, provider)
    .then(async (user) => {
      await createProfile(user);
      window.location.href = "edit-profile.html";
    })
    .catch(handleError);
});
