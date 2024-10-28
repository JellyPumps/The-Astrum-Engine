const socket = io();

// Show main menu on load
document.getElementById('main-menu').style.display = 'block';
document.getElementById('lobby').style.display = 'none';

// Chatbox
const chatbox = document.getElementById('chatbox');
const chatMessages = document.getElementById('chat-messages');
const chatSendButton = document.getElementById('chat-send');
const chatInput = document.getElementById('chat-input');

chatbox.style.display = 'none';

let currentRoom = '';

// Create room
function createRoom() {
	const name = document.getElementById('name').value;
	const role = document.getElementById('role').value;
	if (name) { socket.emit('createRoom', { name, role }); }
	
}

// Handle room created event
socket.on('roomCreated', (roomCode) => {
	currentRoom = roomCode;
	
	document.getElementById('room-code-display').textContent = `Room Code: ${roomCode}`;
	document.getElementById('main-menu').style.display = 'none';
	document.getElementById('lobby').style.display = 'block';

	chatbox.style.display = 'block';
	chatInput.disabled = false;
});

// Join room function
function joinRoom() {
	const roomCode = document.getElementById('room-code').value;
	const name = document.getElementById('name').value;
	const role = document.getElementById('role').value;
	if (name && roomCode) {
		socket.emit('joinRoom', { roomCode, name, role });
		currentRoom = roomCode;

		document.getElementById('main-menu').style.display = 'none';
		document.getElementById('lobby').style.display = 'block';

		// Enable chat after joining
		chatbox.style.display = 'block';
		chatInput.disabled = false;
	}
}

function exitLobby() {
	socket.disconnect();
	document.getElementById('lobby').style.display = 'none';
	document.getElementById('main-menu').style.display = 'block';
	// Clear the player list on exit
	document.getElementById('player-list').innerHTML = '';

	// Disable chat and clear messages on exit
	chatbox.style.display = 'none';
	chatMessages.innerHTML = '';
	chatInput.disabled = true;

	// Refresh page to avoid issues
	location.reload();
}

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

// Display received chat messages
socket.on('chatMessage', (messageData) => {
	const messageItem = document.createElement('li');
	messageItem.textContent = messageData;
	chatMessages.appendChild(messageItem);  
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Update player list in the lobby
socket.on('playerList', (players) => {
	const playerList = document.getElementById('player-list');
	playerList.innerHTML = '';
	players.forEach(player => {
		const playerItem = document.createElement('li');
		playerItem.textContent = `${player.name} (${player.role})`;
		playerList.appendChild(playerItem);
	});
});

// Error handling
socket.on('error', (msg) => {
	alert(msg);
});