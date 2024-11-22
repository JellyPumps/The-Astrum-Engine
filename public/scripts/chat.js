/** @type {!HTMLElement} */
const chatbox = document.getElementById('chatbox');
/** @type {!HTMLElement} */
const chatMessages = document.getElementById('chat-messages');
/** @type {!HTMLElement} */
const chatSendButton = document.getElementById('chat-send');
/** @type {!HTMLInputElement} */
const chatInput = document.getElementById('chat-input');

/** Ensure chatbox is hidden initially. */
chatbox.style.display = 'none';

/**
 * Sends a chat message when the send button is clicked.
 */
chatSendButton.addEventListener('click', () => {
	const message = chatInput.value.trim();
	if (message) {
		socket.emit('chatMessage', { roomCode: currentRoom, msg: message });
		chatInput.value = ''; // Clear input field after sending
	}
});

/**
 * Sends a chat message when the Enter key is pressed.
 * @param {!KeyboardEvent} event
 */
chatInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter' && chatInput.value.trim()) {
	chatSendButton.click();
	}
});

/**
 * Displays received chat messages.
 * @param {!CustomEvent} e
 */
document.addEventListener('chatMessage', (e) => {
	const messageData = e.detail;
	const messageItem = document.createElement('li');
	messageItem.textContent = messageData;
	chatMessages.appendChild(messageItem);
	chatMessages.scrollTop = chatMessages.scrollHeight;
});
