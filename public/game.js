// ==================== GAME STATE ====================
const gameState = {
    socket: null,
    screen: 'landing',
    roomCode: null,
    player: null,
    players: [],
    currentQuestion: null,
    timeLeft: 15,
    questionAnswered: false,
    usedQuestions: new Set(),
    usedDares: new Set()
};

// ==================== SOCKET.IO CONNECTION ====================
function initializeSocket() {
    // Connect to Socket.IO server - adjust URL for Vercel
    const isProduction = window.location.hostname !== 'localhost';
    const serverUrl = isProduction ? window.location.origin : 'http://localhost:3000';
    gameState.socket = io(serverUrl, {
        path: isProduction ? '/socket.io' : '/socket.io'
    });
    
    gameState.socket.on('connect', () => {
        console.log('Connected to server');
    });

    gameState.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        showReconnectingScreen();
    });

    gameState.socket.on('playersUpdate', (players) => {
        gameState.players = players;
        updatePlayersDisplay();
    });

    gameState.socket.on('gameStarted', (data) => {
        updateGameHeader();
        showScreen('game');
    });

    gameState.socket.on('questionLoaded', (data) => {
        gameState.currentQuestion = data.question;
        gameState.timeLeft = data.timeLeft;
        gameState.questionAnswered = false;
        gameState.usedQuestions.add(data.question.id);
        updateGameStats();
        displayQuestion();
        startTimer();
    });

    gameState.socket.on('timerUpdate', (data) => {
        gameState.timeLeft = data.timeLeft;
        updateTimerDisplay();
    });

    gameState.socket.on('questionResult', (result) => {
        showResult(result);
    });

    gameState.socket.on('gameStateUpdate', (data) => {
        updateGameDisplay(data.gameState);
    });

    gameState.socket.on('roundEnd', (data) => {
        displayRoundWinner(data);
    });

    gameState.socket.on('nextRound', (data) => {
        updateGameHeader();
        showScreen('game');
    });
}

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenName).classList.add('active');
    gameState.screen = screenName;
}

function showLanding() {
    if (gameState.socket) {
        gameState.socket.emit('leaveRoom');
    }
    resetGameState();
    showScreen('landing');
}

function showCreateGame() {
    showScreen('createGame');
}

function showJoinGame() {
    showScreen('joinGame');
}

function showHowToPlay() {
    showScreen('howToPlay');
}

function showReconnectingScreen() {
    // Could implement a reconnecting screen here
    console.log('Attempting to reconnect...');
}

// ==================== ROOM MANAGEMENT ====================
function createGame() {
    const hostName = document.getElementById('hostName').value.trim();
    if (!hostName) {
        alert('Please enter your name');
        return;
    }

    // Check if socket is connected
    if (!gameState.socket || !gameState.socket.connected) {
        alert('Connecting to server... Please try again in a moment.');
        return;
    }

    gameState.socket.emit('createRoom', hostName, (response) => {
        if (response.success) {
            gameState.roomCode = response.roomCode;
            gameState.player = { name: hostName, isHost: true };
            document.getElementById('roomCodeDisplay').textContent = response.roomCode;
            showScreen('waiting');
        } else {
            alert('Failed to create room');
        }
    });
}

function joinGame() {
    const roomCode = document.getElementById('roomCode').value.trim();
    const playerName = document.getElementById('playerName').value.trim();
    
    if (!roomCode || !playerName) {
        alert('Please enter both room code and your name');
        return;
    }

    // Check if socket is connected
    if (!gameState.socket || !gameState.socket.connected) {
        alert('Connecting to server... Please try again in a moment.');
        return;
    }

    gameState.socket.emit('joinRoom', { roomCode, playerName }, (response) => {
        if (response.success) {
            gameState.roomCode = roomCode;
            gameState.player = { name: playerName, isHost: false };
            showScreen('waiting');
        } else {
            alert(response.message || 'Failed to join room');
        }
    });
}

function leaveRoom() {
    if (gameState.socket) {
        gameState.socket.emit('leaveRoom');
    }
    resetGameState();
    showScreen('landing');
}

function updatePlayersDisplay() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';

    gameState.players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-item';
        playerDiv.innerHTML = `
            <span class="player-name">${player.name}</span>
            <span class="player-role">${player.isHost ? 'Host' : 'Player'}</span>
        `;
        playersList.appendChild(playerDiv);
    });

    // Enable start button if host and 2 players
    const startButton = document.getElementById('startButton');
    if (gameState.player && gameState.player.isHost && gameState.players.length === 2) {
        startButton.disabled = false;
    } else {
        startButton.disabled = true;
    }
}

// ==================== GAME MANAGEMENT ====================
function startGame() {
    if (!gameState.player.isHost) return;
    
    gameState.socket.emit('startGame');
}

function updateGameHeader() {
    if (gameState.players.length >= 2) {
        const p1 = gameState.players.find(p => p.playerNumber === 1);
        const p2 = gameState.players.find(p => p.playerNumber === 2);
        
        if (p1) {
            document.getElementById('p1NameHeader').textContent = p1.name;
        }
        if (p2) {
            document.getElementById('p2NameHeader').textContent = p2.name;
        }
    }
}

function updateGameDisplay(gameStateData) {
    // Update scores
    document.getElementById('p1ScoreDisplay').textContent = gameStateData.p1Score;
    document.getElementById('p2ScoreDisplay').textContent = gameStateData.p2Score;
    
    // Update round
    document.getElementById('currentRound').textContent = gameStateData.currentRound;
    
    // Update timer
    gameState.timeLeft = gameStateData.timeLeft;
    updateTimerDisplay();
    
    gameState.questionAnswered = gameStateData.questionAnswered;
}

// ==================== QUESTION MANAGEMENT ====================
function displayQuestion() {
    if (!gameState.currentQuestion) return;

    const q = gameState.currentQuestion;
    document.getElementById('categoryBadge').textContent = 
        q.category === 'film' ? 'Film Trivia' : 'Song Lyrics';
    document.getElementById('questionText').textContent = q.question;

    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = option;
        btn.onclick = () => submitAnswer(index);
        optionsGrid.appendChild(btn);
    });

    document.getElementById('resultOverlay').classList.remove('active');
    updateTimerDisplay();
}

function startTimer() {
    // Timer is now managed by server, just update display
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = gameState.timeLeft;
    
    if (gameState.timeLeft <= 5) {
        timerDisplay.classList.add('warning');
    } else {
        timerDisplay.classList.remove('warning');
    }
}

function submitAnswer(optionIndex) {
    if (gameState.questionAnswered) return;

    // Disable all option buttons
    document.querySelectorAll('.option').forEach(btn => btn.disabled = true);

    gameState.socket.emit('submitAnswer', optionIndex);
    gameState.questionAnswered = true;
}

function showResult(result) {
    document.getElementById('resultMessage').textContent = 
        result.scorerName ? `${result.scorerName} gets the point!` : 'No points this round';
    
    if (gameState.currentQuestion) {
        document.getElementById('correctAnswerDisplay').innerHTML = 
            `<strong>Correct Answer:</strong> ${gameState.currentQuestion.options[result.correctIndex]}`;
    }
    
    document.getElementById('scoreUpdateDisplay').innerHTML = 
        `<strong>${document.getElementById('p1NameHeader').textContent}:</strong> ${result.p1Score} | <strong>${document.getElementById('p2NameHeader').textContent}:</strong> ${result.p2Score}`;

    // Highlight correct and wrong answers
    document.querySelectorAll('.option').forEach((btn, idx) => {
        if (idx === result.correctIndex) {
            btn.classList.add('correct');
        } else if (idx === result.p1Answer || idx === result.p2Answer) {
            if (idx !== result.correctIndex) {
                btn.classList.add('wrong');
            }
        }
        btn.disabled = true;
    });

    // Update scores in header
    document.getElementById('p1ScoreDisplay').textContent = result.p1Score;
    document.getElementById('p2ScoreDisplay').textContent = result.p2Score;

    document.getElementById('resultOverlay').classList.add('active');
    document.getElementById('readyButton').disabled = false;
    document.getElementById('waitingMessage').style.display = 'none';
}

function playerReady() {
    document.getElementById('readyButton').disabled = true;
    document.getElementById('waitingMessage').style.display = 'block';
    
    gameState.socket.emit('playerReady');
}

// ==================== ROUND MANAGEMENT ====================
function displayRoundWinner(data) {
    document.getElementById('roundWinnerName').textContent = data.winner;
    document.getElementById('roundsTracker').textContent = `Rounds: ${data.p1Rounds} - ${data.p2Rounds}`;
    document.getElementById('dareText').textContent = data.dare;
    
    // Track used dare
    if (data.dareIndex !== undefined) {
        gameState.usedDares.add(data.dareIndex);
    }

    if (data.p1Rounds >= 3 || data.p2Rounds >= 3) {
        setTimeout(() => {
            displayGameOver({
                winner: data.p1Rounds >= 3 ? 
                    gameState.players.find(p => p.playerNumber === 1).name : 
                    gameState.players.find(p => p.playerNumber === 2).name,
                p1Rounds: data.p1Rounds,
                p2Rounds: data.p2Rounds
            });
        }, 3000);
    } else {
        showScreen('roundWinner');
    }
}

function nextRound() {
    if (gameState.player.isHost) {
        gameState.socket.emit('nextRound');
    }
    // Reset client-side tracking
    gameState.usedQuestions.clear();
    gameState.usedDares.clear();
    updateGameStats();
}

function displayGameOver(data) {
    document.getElementById('championName').textContent = data.winner;
    document.getElementById('finalP1Name').textContent = 
        gameState.players.find(p => p.playerNumber === 1).name;
    document.getElementById('finalP1Rounds').textContent = data.p1Rounds;
    document.getElementById('finalP2Name').textContent = 
        gameState.players.find(p => p.playerNumber === 2).name;
    document.getElementById('finalP2Rounds').textContent = data.p2Rounds;

    showScreen('gameOver');
}

// ==================== UTILITY FUNCTIONS ====================
function resetGameState() {
    gameState.roomCode = null;
    gameState.player = null;
    gameState.players = [];
    gameState.currentQuestion = null;
    gameState.timeLeft = 15;
    gameState.questionAnswered = false;
    gameState.usedQuestions.clear();
    gameState.usedDares.clear();
    updateGameStats();
}

function updateGameStats() {
    document.getElementById('questionsUsed').textContent = gameState.usedQuestions.size;
    document.getElementById('daresUsed').textContent = gameState.usedDares.size;
    document.getElementById('availableQuestions').textContent = 25 - gameState.usedQuestions.size;
    document.getElementById('availableDares').textContent = 30 - gameState.usedDares.size;
}

// ==================== THEME MANAGEMENT ====================
function toggleThemeDropdown() {
    const dropdown = document.getElementById('themeDropdown');
    dropdown.classList.toggle('active');
}

function setTheme(themeName) {
    // Remove existing theme
    document.documentElement.removeAttribute('data-theme');
    
    // Set new theme
    if (themeName !== 'dark') {
        document.documentElement.setAttribute('data-theme', themeName);
    }
    
    // Update active state in dropdown
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });
    
    const activeOption = document.querySelector(`.theme-option:has(.theme-preview.${themeName})`);
    if (activeOption) {
        activeOption.classList.add('active');
    }
    
    // Save theme preference
    localStorage.setItem('bollywoodBuzzTheme', themeName);
    
    // Close dropdown
    document.getElementById('themeDropdown').classList.remove('active');
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('bollywoodBuzzTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
}

// Close theme dropdown when clicking outside
document.addEventListener('click', function(e) {
    const themeToggle = document.querySelector('.theme-toggle');
    const dropdown = document.getElementById('themeDropdown');
    
    if (!themeToggle.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeSocket();
    loadSavedTheme();
    
    // Prevent accidental page reload during game
    window.addEventListener('beforeunload', function(e) {
        if (gameState.screen === 'game' || gameState.screen === 'roundWinner') {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});
