const socket = io();

// Global event handlers
socket.on('roomCreated', (roomCode) => {
	document.dispatchEvent(new CustomEvent('roomCreated', { detail: roomCode }));
});

socket.on('roomJoined', (roomCode) => {
	document.dispatchEvent(new CustomEvent('roomJoined', { detail: roomCode }));
});

socket.on('playerList', (players) => {
	document.dispatchEvent(new CustomEvent('playerList', { detail: players }));
});

socket.on('chatMessage', (messageData) => {
	document.dispatchEvent(new CustomEvent('chatMessage', { detail: messageData }));
});

// Error handling
socket.on('error', (msg) => {
	alert(msg);
});