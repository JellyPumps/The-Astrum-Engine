/**
 * Handles rendering room code and player list updates.
 */
function renderLobby() {
    /** Make chatbox visible. */
    const cbElement = document.getElementById('cb');
    if (cbElement) {
    chatbox.style.display = 'block';
    chatInput.disabled = false;
    }

    /** Room code display */
    const roomCodeDisplay = document.getElementById('room-code-display');
    const sceneData = sceneManager.getSceneData();

    if (roomCodeDisplay && sceneData && sceneData.roomCode) {
        roomCodeDisplay.textContent = `Room Code: ${sceneData.roomCode}`;
    }

    /** Send signal that scene has loaded */
    document.dispatchEvent(new CustomEvent('lobbyLoaded'));
}

// Schedule the rendering function in the next animation frame.
window.requestAnimationFrame(renderLobby);

/** Player list updates */
document.addEventListener('playerList', (event) => {
    const players = event.detail;
    const playerList = document.getElementById('player-list');

    if (playerList) {
        playerList.innerHTML = '';
        players.forEach((player) => {
            const playerItem = document.createElement('li');
            playerItem.textContent = `${player.name} (${player.role})`;
            playerList.appendChild(playerItem);
        });
    }
});

/**
 * Exits the current lobby and loads the main menu scene.
 */
function exitLobby() {
    socket.emit('exitRoom');
    chatbox.style.display = 'none';
    sceneManager.loadScene('mainMenu');
}
  