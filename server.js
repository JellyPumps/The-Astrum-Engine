const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = [];

const rooms = {};

io.on('connection', (socket) => {
	console.log('A player connected:', socket.id);

	// Handle room creation
	socket.on('createRoom', (data) => {
		const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
		rooms[roomCode] = { players: [] };

		// Automatically add the room creator
		const player = { id: socket.id, name: data.name, role: data.role };
		rooms[roomCode].players.push(player);
		socket.join(roomCode);

		// Emit ther room code and update the player list
		socket.emit('roomCreated', roomCode);
		io.to(roomCode).emit('playerList', rooms[roomCode].players);
		console.log(`Room ${roomCode} created by ${player.name}`);
	});

	// Handle player joining a room
	socket.on('joinRoom', ({ roomCode, name, role }) => {
		// Check if room exists
		if (rooms[roomCode]) {
			const player = { id: socket.id, name, role};
			rooms[roomCode].players.push(player);
			socket.join(roomCode);

			// Update room player list
			io.to(roomCode).emit('playerList', rooms[roomCode].players);

			// Notify the client
			socket.emit('roomJoined', roomCode);
			console.log(`${name} joined room ${roomCode}`);
		}
		else { socket.emit('error', 'Room not found'); }
	});

	// Handle player disconnecting
	socket.on('disconnect', () => {
		// Find and remove player from rooms
		for (const roomCode in rooms) {
			rooms[roomCode] = rooms[roomCode].players.filter((player) => player.id !== socket.id);

			// Update room player list
			io.to(roomCode).emit('playerList', rooms[roomCode].players);
			console.log('A player disconnected:', socket.id);

			// If room is empty, delete it
			if (rooms[roomCode].length === 0) {
				delete rooms[roomCode];
				console.log(`Room ${roomCode} deleted due to inactivity.`);
			}
		}
	});

	// Handle chat
	socket.on('chatMessage', ({ msg, roomCode }) => {
		const player = rooms[roomCode]?.players.find(p => p.id === socket.id);

		if (player) {
			const timestamp = new Date().toLocaleDateString([], { hour: '2-digit', minute: '2-digit' });
			const messageData = player ? `| ${timestamp} | ${player.name} says: "${msg}"` : msg;
			io.to(roomCode).emit('chatMessage', messageData);
			console.log(messageData);
		}
	});
});

const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
	console.log(`Server running on http://127.0.0.1:${PORT}`);
})