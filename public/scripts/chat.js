/** @type {!HTMLElement} */
const chatbox = document.getElementById('chatbox');
/** @type {!HTMLElement} */
const chatMessages = document.getElementById('chat-messages');
/** @type {!HTMLElement} */
const chatSendButton = document.getElementById('chat-send');
/** @type {!HTMLInputElement} */
const chatInput = document.getElementById('chat-input');
/** @type {!HTMLSelectElement} */
const recipientSelect = document.getElementById('recipient-select'); // Add a dropdown for selecting a recipient

/** Ensure chatbox is hidden initially. */
chatbox.style.display = 'none';

/**
 * Sends a chat message when the send button is clicked.
 */
chatSendButton.addEventListener('click', () => {
	const message = chatInput.value.trim();
	const recipientId = recipientSelect.value; // Get selected recipient ID

	if (message) {
		socket.emit('chatMessage', { roomCode: currentRoom, msg: message, recipientId });
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

/**
 * Displays received private chat messages.
 * @param {!CustomEvent} e
 */
document.addEventListener('privateMessage', (e) => {
	const messageData = e.detail;
	const messageItem = document.createElement('li');
	messageItem.textContent = `Private: ${messageData}`; // Indicate that it's a private message
	chatMessages.appendChild(messageItem);
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

/**
 * Populates player selector
 * @param {!CustomEvent} e
 */
document.addEventListener('playerList', (e) => {
	const players = e.detail;
	const recipientSelect = document.getElementById('recipient-select');
    recipientSelect.innerHTML = '<option value="">Public</option>'; // Reset the select element


    // Populate the select element with players
    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.id; // Set the value to the player's ID
        option.textContent = player.name; // Display the player's name
        recipientSelect.appendChild(option);

    });
});