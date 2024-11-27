const socket = io();

let currentRoom = '';
let lobbyLoaded = false;

// Global event handlers
socket.on('roomCreated', (roomCode) => {
	document.dispatchEvent(new CustomEvent('roomCreated', { detail: roomCode }));
});

socket.on('roomJoined', (roomCode) => {
	document.dispatchEvent(new CustomEvent('roomJoined', { detail: roomCode }));
});

socket.on('playerList', (players) => {
	if (lobbyLoaded) {
		updatePlayerList(players);
	} else {
		document.addEventListener('lobbyLoaded', () => {
			updatePlayerList(players);
			lobbyLoaded = true;
		});
	}
});

socket.on('chatMessage', (messageData) => {
	document.dispatchEvent(new CustomEvent('chatMessage', { detail: messageData }));
});

socket.on('privateMessage', (messageData) => {
	document.dispatchEvent(new CustomEvent('privateMessage', { detail: messageData }));
})

function updatePlayerList(players) {
	document.dispatchEvent(new CustomEvent('playerList', { detail: players }));
}

// Error handling
socket.on('error', (msg) => {
	alert(msg);
});