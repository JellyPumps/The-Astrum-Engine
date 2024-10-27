const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = [];

io.on('connection', (socket) => {
	console.log('A player connected:', socket.id);

	// Handle player joing with a name and role
	socket.on('join', (data) => {
		const player = { id: socket.id, name: data.name, role: data.role };
		players.push(player);

		io.emit('playerList', players);
	});

	// Handle player disconnecting
	socket.on('disconnect', () => {
		players = players.filter((player) => player.id !== socket.id);
		io.emit('playerList', players);
		console.log('A player disconnected:', socket.id);
	});

	// Handle chat
	socket.on('chatMessage', (msg) => {
		console.log('Received message:', msg);
		io.emit('chatMessage', { msg, playerId: socket.id }, players);
	});
});

const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
	console.log(`Server running on http://127.0.0.1:${PORT}`);
})