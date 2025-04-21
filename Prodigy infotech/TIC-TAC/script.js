document.addEventListener('DOMContentLoaded', () => {
    // ========== DOM Elements ========== //
    const board = document.querySelector('.cells-container');
    const status = document.querySelector('.announcement-board .message');
    const xPlayerCard = document.querySelector('.x-player');
    const oPlayerCard = document.querySelector('.o-player');
    const xScoreDisplay = document.querySelector('.x-player .score');
    const oScoreDisplay = document.querySelector('.o-player .score');
    const resetBtn = document.querySelector('.reset-btn');
    const aiBtn = document.querySelector('.ai-btn');
    const soundBtn = document.querySelector('.sound-btn');
    const placeSound = document.getElementById('placeSound');
    const winSound = document.getElementById('winSound');
    const drawSound = document.getElementById('drawSound');

    // ========== Game State ========== //
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let scores = { X: 0, O: 0 };
    let isAIMode = true;
    let isSoundOn = true;
    let moveHistory = [];

    // ========== Winning Conditions ========== //
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // ========== Initialize Game ========== //
    function initGame() {
        // Create cells
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }

        updateGameStatus();
    }

    // ========== Handle Cell Click ========== //
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        // If cell is already filled or game is inactive, return
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;

        // Play sound if enabled
        if (isSoundOn) {
            placeSound.currentTime = 0;
            placeSound.play().catch(e => console.log("Sound blocked by browser"));
        }

        // Make the move
        makeMove(clickedCellIndex, currentPlayer);

        // If in AI mode and game is still active, make AI move
        if (isAIMode && gameActive && currentPlayer === 'O') {
            setTimeout(makeAIMove, 800); // Delay for better UX
        }
    }

    // ========== Make Move ========== //
    function makeMove(index, player) {
        // Update game state
        gameState[index] = player;
        moveHistory.push([...gameState]);

        // Update UI
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(`${player.toLowerCase()}-move`);

        // Check for win or draw
        if (checkWin()) {
            handleWin();
        } else if (checkDraw()) {
            handleDraw();
        } else {
            // Switch player
            currentPlayer = player === 'X' ? 'O' : 'X';
            updateGameStatus();
        }
    }

    // ========== AI Move ========== //
    function makeAIMove() {
        // Simple AI - tries to win or block
        let move;

        // 1. Try to win
        move = findWinningMove('O');
        
        // 2. Block player if they can win
        if (!move) move = findWinningMove('X');
        
        // 3. Take center if available
        if (!move && gameState[4] === '') move = 4;
        
        // 4. Take a random corner
        if (!move) {
            const corners = [0, 2, 6, 8].filter(i => gameState[i] === '');
            if (corners.length > 0) move = corners[Math.floor(Math.random() * corners.length)];
        }
        
        // 5. Take any available spot
        if (!move) {
            const available = gameState.map((cell, i) => cell === '' ? i : null).filter(val => val !== null);
            if (available.length > 0) move = available[0];
        }

        if (move !== undefined) {
            if (isSoundOn) {
                placeSound.currentTime = 0;
                placeSound.play().catch(e => console.log("Sound blocked by browser"));
            }
            makeMove(move, 'O');
        }
    }

    // ========== Helper Functions ========== //
    function findWinningMove(player) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            
            // Check if two in a row and third is empty
            if (gameState[a] === player && gameState[b] === player && gameState[c] === '') return c;
            if (gameState[a] === player && gameState[c] === player && gameState[b] === '') return b;
            if (gameState[b] === player && gameState[c] === player && gameState[a] === '') return a;
        }
        return null;
    }

    function checkWin() {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    }

    function checkDraw() {
        return !gameState.includes('');
    }

    function getWinningCells() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] !== '' && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return [a, b, c];
            }
        }
        return [];
    }

    // ========== Game Result Handlers ========== //
    function handleWin() {
        gameActive = false;
        scores[currentPlayer]++;
        updateScores();

        // Highlight winning cells
        const winningCells = getWinningCells();
        winningCells.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.classList.add('win-cell');
        });

        // Play win sound
        if (isSoundOn) {
            winSound.currentTime = 0;
            winSound.play().catch(e => console.log("Sound blocked by browser"));
        }

        // Update status
        status.textContent = `PLAYER ${currentPlayer} WINS!`;
    }

    function handleDraw() {
        gameActive = false;
        
        // Play draw sound
        if (isSoundOn) {
            drawSound.currentTime = 0;
            drawSound.play().catch(e => console.log("Sound blocked by browser"));
        }

        // Update status
        status.textContent = "DRAW!";
    }

    // ========== UI Updates ========== //
    function updateGameStatus() {
        // Update player cards
        xPlayerCard.classList.toggle('active', currentPlayer === 'X');
        oPlayerCard.classList.toggle('active', currentPlayer === 'O');

        // Update status message
        status.textContent = `PLAYER ${currentPlayer}'S TURN`;
    }

    function updateScores() {
        xScoreDisplay.textContent = scores.X;
        oScoreDisplay.textContent = scores.O;
    }

    // ========== Reset Game ========== //
    function resetGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        moveHistory = [];
        
        // Reset UI
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        updateGameStatus();
    }

    // ========== Event Listeners ========== //
    resetBtn.addEventListener('click', resetGame);
    
    aiBtn.addEventListener('click', () => {
        isAIMode = !isAIMode;
        aiBtn.classList.toggle('active', isAIMode);
        resetGame();
    });
    
    soundBtn.addEventListener('click', () => {
        isSoundOn = !isSoundOn;
        soundBtn.classList.toggle('active', isSoundOn);
    });

    // ========== Initialize ========== //
    initGame();
});