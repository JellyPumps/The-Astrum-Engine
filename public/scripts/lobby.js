window.requestAnimationFrame(() => {
    // Room code
    const roomCodeDisplay = document.getElementById('room-code-display');
    if (roomCodeDisplay && sceneManager.getSceneData().roomCode) {
        roomCodeDisplay.textContent = `Room Code: ${sceneManager.getSceneData().roomCode}`;
    }

    // Player list
    document.addEventListener('playerList', (e) => {
        const players = e.detail;
        const playerList = document.getElementById('player-list');
        playerList.innerHTML = '';

        players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.textContent = `${player.name} (${player.role})`;
            playerList.appendChild(playerItem);
        });
    });
});

function exitLobby() {
    socket.emit('exitRoom');
    sceneManager.loadScene('mainMenu');
}
