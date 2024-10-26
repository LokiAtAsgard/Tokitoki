import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

// Ensure user is authenticated to access settings
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login if not signed in
        window.location.href = "index.html";
    }
});

// Elements
const editProfileBtn = document.getElementById("edit-profile-btn");
const logoutBtn = document.getElementById("logout-btn");

// Redirect to edit profile page
editProfileBtn.addEventListener("click", () => {
    window.location.href = "edit-profile.html";
});

// Log out and redirect to login page
logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("Logged out successfully.");
            window.location.href = "index.html"; // Redirect to login page
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
});
