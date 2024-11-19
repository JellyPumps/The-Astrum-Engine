function createRoom() {
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    if (name) socket.emit('createRoom', { name, role });
}

function joinRoom() {
    const roomCode = document.getElementById('room-code').value;
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    if (name && roomCode) {
        socket.emit('joinRoom', { roomCode, name, role });
        currentRoom = roomCode;
    }
}

function goToCampaignCreation() {
    sceneManager.loadScene('campaignCreation');
}

// Events
document.addEventListener('roomCreated', (e) => {
    currentRoom = e.detail;
    roomJoined(e);
});

document.addEventListener('roomJoined', (e) => {
    roomJoined(e);
});

function roomJoined(e) {
    const roomCode = e.detail;
    console.log('Joined room:', roomCode);
    sceneManager.loadScene('lobby', { roomCode });
}
