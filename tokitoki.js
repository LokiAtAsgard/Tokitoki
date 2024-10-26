import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, onSnapshot, addDoc, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const selectedUserDisplay = document.querySelector(".selected-user"); // Display for the selected user

let selectedUserId = null; // Store the selected user's ID
let selectedUsername = null; // Store the selected user's name
let currentUser = null; // Store the current authenticated user

// Ensure user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        window.location.href = "index.html"; // Redirect to login if not signed in
    }
});

// Load chat messages for the selected user
function loadChatMessages(selectedUserId) {
    if (!currentUser || !selectedUserId) return;

    // Query to get messages between the current user and the selected user
    const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUser.uid),
        orderBy("timestamp", "asc")
    );

    // Real-time listener to load and display messages
    onSnapshot(q, (querySnapshot) => {
        chatLog.innerHTML = ""; // Clear chat log

        querySnapshot.forEach((doc) => {
            const message = doc.data();
            // Display only messages exchanged between the current user and selected user
            if ((message.senderId === currentUser.uid && message.recipientId === selectedUserId) ||
                (message.senderId === selectedUserId && message.recipientId === currentUser.uid)) {
                displayMessage(message);
            }
        });

        // Auto-scroll to the latest message
        chatLog.scrollTop = chatLog.scrollHeight;
    });
}

// Display individual messages in the chat log
function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    const textElement = document.createElement("span");
    textElement.classList.add("text");
    textElement.textContent = message.text;

    if (message.senderId === currentUser.uid) {
        messageElement.classList.add("right"); // Right-align current user's messages
    } else {
        messageElement.classList.add("left"); // Left-align other user's messages
    }

    messageElement.appendChild(textElement);
    chatLog.appendChild(messageElement);
}

// Event listener for sending messages
messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (messageInput.value.trim() === "" || !selectedUserId) return;

    const message = {
        text: messageInput.value,
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
        recipientId: selectedUserId,
        participants: [currentUser.uid, selectedUserId]
    };

    try {
        await addDoc(collection(db, "chats"), message);
        messageInput.value = ""; // Clear input field
    } catch (error) {
        console.error("Error sending message:", error);
    }
});

// Update UI when a user is selected for chat
function selectUserForChat(docId, username) {
    selectedUserId = docId;
    selectedUsername = username;
    chatLog.innerHTML = ""; // Clear previous messages

    // Show selected user at the top of the chat area
    selectedUserDisplay.textContent = `Chatting with ${selectedUsername}`;
    
    // Clear search results and hide search area
    searchResults.innerHTML = "";
    userSearchInput.value = "";
    
    loadChatMessages(selectedUserId); // Load chat messages for this user
}

// Search functionality with click event for each search result
searchButton.addEventListener("click", async () => {
    const searchQuery = userSearchInput.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (!searchQuery) {
        searchResults.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }

    const profilesRef = collection(db, "profiles");
    const q = query(
        profilesRef,
        where("username", ">=", searchQuery),
        where("username", "<=", searchQuery + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        searchResults.innerHTML = "<p>No users found</p>";
    } else {
        querySnapshot.forEach((doc) => {
            const profile = doc.data();
            const resultItem = document.createElement("div");
            resultItem.classList.add("search-result-item");
            resultItem.textContent = profile.username;

            // Click event to select a user for chat
            resultItem.addEventListener("click", () => selectUserForChat(doc.id, profile.username));

            searchResults.appendChild(resultItem);
        });
    }
});

// Event listener for settings button
document.getElementById("settings-button").addEventListener("click", () => {
    window.location.href = "settings.html";
});
