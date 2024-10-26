// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, serverTimestamp, query } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const chatLog = document.getElementById("chat-log");

let currentUser = null;

// Authenticate user and load chat messages if logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadChatMessages();
    } else {
        window.location.href = "index.html";  // Redirect to login if not signed in
    }
});

// Load all group chat messages in real-time
function loadChatMessages() {
    const messagesRef = collection(db, "groupChat");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    onSnapshot(q, (snapshot) => {
        chatLog.innerHTML = "";
        snapshot.forEach((doc) => {
            const message = doc.data();
            displayMessage(message);
        });
    });
}

// Display a message in the chat log
function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Set message alignment and color based on senderId
    if (message.senderId === currentUser.uid) {
        messageElement.classList.add("right");  // Right align for the current user's messages
        messageElement.style.backgroundColor = "#007bff";  // Color for current user's messages
        messageElement.style.color = "white";
    } else {
        messageElement.classList.add("left");   // Left align for other users' messages
        messageElement.style.backgroundColor = "#e0e0e0";  // Color for other users' messages
        messageElement.style.color = "black";
    }

    // Display sender's name above the message text
    const usernameElement = document.createElement("p");
    usernameElement.classList.add("username");
    usernameElement.textContent = message.senderName || "Anonymous";
    messageElement.appendChild(usernameElement);

    // Display message content
    const textElement = document.createElement("p");
    textElement.textContent = message.text;
    messageElement.appendChild(textElement);

    // Append to chat log and auto-scroll to the latest message
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// Send a message to the group chat
messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (messageInput.value.trim()) {
        const message = {
            text: messageInput.value,
            timestamp: serverTimestamp(),
            senderId: currentUser.uid,
            senderName: currentUser.displayName || currentUser.email  // Attach sender's name
        };

        try {
            await addDoc(collection(db, "groupChat"), message);  // Add message to the "groupChat" collection
            messageInput.value = "";  // Clear input after sending
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
});

// Button listeners for editing username and logging out
document.getElementById("edit-username").addEventListener("click", () => {
    window.location.href = "edit-profile.html";
});

document.getElementById("logout-button").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error logging out:", error);
    });
});