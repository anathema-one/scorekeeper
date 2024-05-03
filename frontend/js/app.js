const ws = new WebSocket('wss://your-api-gateway-url'); // Replace with your actual WebSocket endpoint URL

// Handle the WebSocket connection opening
ws.onopen = function(event) {
    console.log("Connected to WebSocket:", event);
};

// Handle messages received from the server
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.action === 'update') {
        updateScoreboard(data.players);
    }
};

// Function to add a player
function addPlayer() {
    const playerName = document.getElementById('playerName').value;
    if (playerName.trim() !== '') {
        ws.send(JSON.stringify({ action: 'addPlayer', playerName: playerName }));
        document.getElementById('playerName').value = ''; // Clear input after sending
    } else {
        alert('Player name cannot be empty!');
    }
}

// Function to update the scoreboard on the frontend
function updateScoreboard(players) {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = ''; // Clear existing entries

    players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-entry';
        playerDiv.textContent = `${player.name}: ${player.score}`;

        // Create buttons for score manipulation
        const incrementButton = document.createElement('button');
        incrementButton.textContent = '+';
        incrementButton.onclick = function() { updateScore(player.name, 1); };

        const decrementButton = document.createElement('button');
        decrementButton.textContent = '-';
        decrementButton.onclick = function() { updateScore(player.name, -1); };

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() { removePlayer(player.name); };

        playerDiv.appendChild(incrementButton);
        playerDiv.appendChild(decrementButton);
        playerDiv.appendChild(removeButton);

        scoreboard.appendChild(playerDiv);
    });
}

// Function to remove a player
function removePlayer(playerName) {
    ws.send(JSON.stringify({ action: 'removePlayer', playerName: playerName }));
}

// Function to update a player's score
function updateScore(playerName, scoreChange) {
    ws.send(JSON.stringify({ action: 'updateScore', playerName: playerName, scoreChange: scoreChange }));
}

// Function to reset all scores (not individual player deletion)
function resetScores() {
    ws.send(JSON.stringify({ action: 'resetScores' }));
}
