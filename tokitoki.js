// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, query, orderBy, onSnapshot, serverTimestamp, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

let selectedUserId = null; // Variable to store the selected user's ID

// Monitor Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadChatMessages(user.uid); // Load chat messages specific to user
        messageForm.addEventListener("submit", (event) => sendMessage(event, user));
    } else {
        alert("Please sign in to use the chat.");
        window.location.href = "index.html"; // Redirect to login if not signed in
    }
});

// Load Chat Messages
function loadChatMessages(userId) {
    const q = query(
        collection(db, "chats"),
        orderBy("timestamp", "asc")
    );

    onSnapshot(q, (querySnapshot) => {
        chatLog.innerHTML = "";  // Clear chat log
        querySnapshot.forEach((doc) => {
            const message = doc.data();
            if (message.senderId === userId || message.recipientId === userId) {
                displayMessage(message);
            }
        });
    });
}

// Display Message in Chat Log
function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    const iconElement = document.createElement("img");
    iconElement.classList.add("user-icon");
    iconElement.src = message.userIcon || "default-icon.png";

    const usernameElement = document.createElement("span");
    usernameElement.classList.add("username");
    usernameElement.textContent = message.username;

    const textElement = document.createElement("span");
    textElement.classList.add("text");
    textElement.textContent = message.text;

    messageElement.appendChild(iconElement);
    messageElement.appendChild(usernameElement);
    messageElement.appendChild(textElement);
    chatLog.appendChild(messageElement);

    chatLog.scrollTop = chatLog.scrollHeight;
}

// Send Message
async function sendMessage(event, user) {
    event.preventDefault();

    if (user && messageInput.value.trim() !== "" && selectedUserId) {
        const message = {
            text: messageInput.value,
            timestamp: serverTimestamp(),
            senderId: user.uid,
            recipientId: selectedUserId,
            username: user.displayName || "Anonymous",
            userIcon: user.photoURL || "default-icon.png"
        };

        try {
            await addDoc(collection(db, "chats"), message);
            messageInput.value = ""; // Clear input field
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }
}

// User Search Functionality
searchButton.addEventListener("click", async () => {
    const searchQuery = userSearchInput.value.trim();

    if (searchQuery) {
        const profilesRef = collection(db, "profiles");
        const q = query(profilesRef, where("username", ">=", searchQuery), where("username", "<=", searchQuery + "\uf8ff"));

        const querySnapshot = await getDocs(q);
        searchResults.innerHTML = ""; // Clear previous results

        querySnapshot.forEach((doc) => {
            const profile = doc.data();
            const resultItem = document.createElement("div");
            resultItem.classList.add("search-result");
            resultItem.textContent = profile.username;
            resultItem.addEventListener("click", () => initiateChatWithUser(doc.id, profile.username));
            searchResults.appendChild(resultItem);
        });
    } else {
        searchResults.innerHTML = ""; // Clear results if search is empty
    }
});

// Select a User to Chat With
function initiateChatWithUser(userId, username) {
    selectedUserId = userId; // Store the selected user's ID
    alert(`Initiating chat with ${username}`);
    chatLog.innerHTML = ""; // Clear chat log for new conversation
    loadChatMessages(auth.currentUser.uid); // Reload chat messages for current user
}
