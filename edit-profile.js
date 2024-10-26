
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
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

// Go back to the chat
document.getElementById("back-to-chat-btn").addEventListener("click", () => {
    window.location.href = "tokitoki.html";
});

// Check for authenticated user and load the current username
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "profiles", user.uid));
        if (userDoc.exists()) {
            document.getElementById("username").value = userDoc.data().username || "";
        }
    } else {
        window.location.href = "index.html"; // Redirect to login if not signed in
    }
});

// Handle username update
document.getElementById("username-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const newUsername = document.getElementById("username").value.trim();
    if (newUsername) {
        try {
            const user = auth.currentUser;
            await updateDoc(doc(db, "profiles", user.uid), { username: newUsername });
            await updateProfile(user, { displayName: newUsername });
            alert("Username updated successfully!");
        } catch (error) {
            console.error("Error updating username:", error);
            alert("Failed to update username.");
        }
    }
});

// Logout function
document.getElementById("logout-button").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User signed out.");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
});
