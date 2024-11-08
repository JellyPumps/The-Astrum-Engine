const chatbox = document.getElementById('chatbox');
const chatMessages = document.getElementById('chat-messages');
const chatSendButton = document.getElementById('chat-send');
const chatInput = document.getElementById('chat-input');

chatbox.style.display = 'none';

// Send chat message on button click or Enter key press
chatSendButton.addEventListener('click', () => {
	const message = chatInput.value.trim();
	if (message) {
	  socket.emit('chatMessage', { roomCode: currentRoom, msg: message });
	  chatInput.value = ''; // Clear input field after sending
	}
});

chatInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter' && chatInput.value.trim()) {
		chatSendButton.click();
	}
});

// Display recieved chat messages
document.addEventListener('chatMessage', (e) => {
    const messageItem = document.createElement('li');
	messageItem.textContent = messageData;
	chatMessages.appendChild(messageItem);  
	chatMessages.scrollTop = chatMessages.scrollHeight;
});