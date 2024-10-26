// tokitoki.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, onSnapshot, orderBy, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// HTML Elements
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const chatLog = document.getElementById("chat-log");
const userSearchInput = document.getElementById("user-search");
const searchButton = document.getElementById("search-button");
const searchResults = document.getElementById("search-results");
const selectedUserDisplay = document.getElementById("selected-user");

let currentUserId = null;
let selectedUserId = null; 
let unsubscribeFromChat = null; 

// Authenticate user
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid;
    } else {
        window.location.href = "index.html";
    }
});

// Search for Users
searchButton.addEventListener("click", async () => {
    const searchQuery = userSearchInput.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (searchQuery) {
        const profilesRef = collection(db, "profiles");
        const q = query(
            profilesRef,
            where("username", ">=", searchQuery),
            where("username", "<=", searchQuery + "\uf8ff")
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const profile = doc.data();
            const resultItem = document.createElement("div");
            resultItem.classList.add("search-result-item");

            const profileImg = document.createElement("img");
            profileImg.src = profile.photoURL || "default-icon.png";
            profileImg.alt = profile.username;
            profileImg.classList.add("small-icon");

            const username = document.createElement("span");
            username.classList.add("username");
            username.textContent = profile.username;

            resultItem.appendChild(profileImg);
            resultItem.appendChild(username);
            searchResults.appendChild(resultItem);

            // Click event to load chat messages
            resultItem.addEventListener("click", () => {
                if (unsubscribeFromChat) unsubscribeFromChat(); // Clear previous listener
                selectedUserId = doc.id;
                selectedUserDisplay.innerHTML = `<img src="${profile.photoURL || 'default-icon.png'}" alt="${profile.username}" class="small-icon"> ${profile.username}`;
                chatLog.innerHTML = ""; // Clear previous chat
                loadChatMessages(); // Load chat for selected user
            });
        });

        if (querySnapshot.empty) {
            searchResults.innerHTML = "<p>No users found</p>";
        }

    } else {
        searchResults.innerHTML = "<p>Please enter a search query</p>";
    }
});

// Load Chat Messages in Real-Time
function loadChatMessages() {
    if (!selectedUserId) return;

    const q = query(
        collection(db, "chats"),
        where("senderId", "in", [currentUserId, selectedUserId]),
        where("recipientId", "in", [currentUserId, selectedUserId]),
        orderBy("timestamp", "asc")
    );

    // Real-time listener for chat messages between the selected user and the current user
    unsubscribeFromChat = onSnapshot(q, (snapshot) => {
        chatLog.innerHTML = ""; // Clear chat log before loading
        snapshot.forEach((doc) => {
            const message = doc.data();
            displayMessage(message);
        });
    });
}

// Display Message in Chat Log
function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Align message to the right if sent by the current user, left if received
    if (message.senderId === currentUserId) {
        messageElement.classList.add("right");
    } else {
        messageElement.classList.add("left");
    }

    messageElement.textContent = message.text;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the latest message
}

// Send Message
messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (messageInput.value.trim() && selectedUserId) {
        const message = {
            text: messageInput.value,
            timestamp: serverTimestamp(),
            senderId: currentUserId,
            recipientId: selectedUserId,
            userIcon: auth.currentUser.photoURL || "default-icon.png"
        };

        // Add message to the Firestore collection
        await addDoc(collection(db, "chats"), message);
        messageInput.value = ""; // Clear the message input after sending
    }
});
