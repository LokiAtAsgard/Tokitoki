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

let selectedUserId = null; // Variable to store the selected user's ID

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html"; // Redirect to login if user is not signed in
    }
});

// Settings button
document.getElementById("settings-button").addEventListener("click", () => {
    window.location.href = "settings.html";
});

// Load Chat Messages for Selected User
function loadChatMessages(userId) {
    if (!selectedUserId) return;

    const q = query(
        collection(db, "chats"),
        where("recipientId", "in", [userId, selectedUserId]),
        where("senderId", "in", [userId, selectedUserId]),
        orderBy("timestamp", "asc")
    );

    onSnapshot(q, (querySnapshot) => {
        chatLog.innerHTML = "";  // Clear chat log
        querySnapshot.forEach((doc) => {
            const message = doc.data();
            displayMessage(message, userId);
        });
    });
}

// Display Message in Chat Log
function displayMessage(message, userId) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    const iconElement = document.createElement("img");
    iconElement.classList.add("user-icon");
    iconElement.src = message.userIcon || "default-icon.png";

    const textElement = document.createElement("span");
    textElement.classList.add("text");
    textElement.textContent = message.text;

    // Align message to the left or right based on sender
    if (message.senderId === userId) {
        messageElement.classList.add("right"); // Right-aligned for the current user's messages
    } else {
        messageElement.classList.add("left"); // Left-aligned for the recipient's messages
        messageElement.appendChild(iconElement); // Display the icon for the other user
    }

    messageElement.appendChild(textElement);
    chatLog.appendChild(messageElement);

    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the latest message
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

// Search Functionality
searchButton.addEventListener("click", performUserSearch);

async function performUserSearch() {
    const searchQuery = userSearchInput.value.trim().toLowerCase();
    searchResults.innerHTML = ""; // Clear previous results

    if (searchQuery) {
        try {
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

                    // Display profile photo
                    const profileImg = document.createElement("img");
                    profileImg.src = profile.photoURL || "default-icon.png";
                    profileImg.alt = profile.username;

                    // Display username
                    const username = document.createElement("span");
                    username.classList.add("username");
                    username.textContent = profile.username;

                    resultItem.appendChild(profileImg);
                    resultItem.appendChild(username);
                    searchResults.appendChild(resultItem);

                    // Click event to initiate chat
                    resultItem.addEventListener("click", () => {
                        selectedUserId = doc.id; // Set the selected user's ID
                        chatLog.innerHTML = ""; // Clear chat log for new conversation
                        loadChatMessages(auth.currentUser.uid); // Load messages with the selected user
                    });
                });
            }
        } catch (error) {
            console.error("Error performing search:", error);
            searchResults.innerHTML = "<p>Error searching users. Please try again.</p>";
        }
    } else {
        searchResults.innerHTML = "<p>Please enter a search term.</p>";
    }
}
