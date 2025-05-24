// Configuración del juego
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BOARD_HIDDEN_HEIGHT = 4;
const TOTAL_HEIGHT = BOARD_HEIGHT + BOARD_HIDDEN_HEIGHT;
const CELL_SIZE = 27;

// Colores de las piezas
const COLORS = {
    I: '#00FFFF', // Cian
    O: '#FFFF00', // Amarillo
    T: '#800080', // Púrpura
    S: '#00FF00', // Verde
    Z: '#FF0000', // Rojo
    J: '#0000FF', // Azul
    L: '#FFA500', // Naranja
    EMPTY: '#000000',
    GRID: '#333333'
};

// Definición de las piezas (tetrominós)
const PIECES = {
    I: {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: COLORS.I
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: COLORS.O
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: COLORS.T
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: COLORS.S
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: COLORS.Z
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: COLORS.J
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: COLORS.L
    }
};

const PIECE_TYPES = Object.keys(PIECES);

// Sistema de puntuación
const SCORING = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 800,
    SOFT_DROP: 1,
    HARD_DROP: 2
};

// Clase principal del juego
class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.board = this.createBoard();
        this.currentPiece = null;
        this.nextPiece = null;
        this.ghostPiece = null;
        
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        
        this.gameOver = false;
        this.paused = false;
        this.lastTime = 0;
        this.dropCounter = 0;
        this.lockDelay = 0;
        this.lockDelayMax = 500; // 0.5 segundos
        
        this.dropInterval = 1000; // 1 segundo inicial
        this.gameStarted = false;
        
        // Sistema 7-Bag para distribución equitativa de piezas
        this.pieceBag = [];
        this.initializePieceBag();
        
        this.setupWelcomeMenu();
    }
    
    setupWelcomeMenu() {
        // Botones del menú de bienvenida
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('highScoresBtn').addEventListener('click', () => {
            this.showHighScores();
        });
        
        document.getElementById('aboutBtn').addEventListener('click', () => {
            this.showAbout();
        });
        
        // Tecla Enter para comenzar desde el menú
        document.addEventListener('keydown', (e) => {
            if (!this.gameStarted && e.key === 'Enter') {
                this.startGame();
            }
        });
    }
    
    startGame() {
        // Ocultar menú de bienvenida
        document.getElementById('welcomeMenu').classList.add('hidden');
        document.getElementById('gameContainer').classList.remove('hidden');
        
        this.gameStarted = true;
        this.init();
    }
    
    showHighScores() {
        // Implementar sistema de puntuaciones altas
        alert('🏅 Mejores Puntuaciones\n\n' +
              '1. 15,000 pts - Nivel 8\n' +
              '2. 12,500 pts - Nivel 7\n' +
              '3. 10,200 pts - Nivel 6\n' +
              '4. 8,750 pts - Nivel 5\n' +
              '5. 6,300 pts - Nivel 4\n\n' +
              '¡Intenta superar estos récords!');
    }
    
    showAbout() {
        alert('ℹ️ Acerca de Tetris Clásico\n\n' +
              'Versión: 1.0\n' +
              'Desarrollado con HTML5 Canvas y JavaScript\n\n' +
              'Características:\n' +
              '• 7 piezas clásicas (I, O, T, S, Z, J, L)\n' +
              '• Sistema de rotación con wall kicks\n' +
              '• Pieza fantasma para preview\n' +
              '• Niveles progresivos de dificultad\n' +
              '• Puntuación por líneas completadas\n\n' +
              '¡Disfruta jugando este clásico atemporal!');
    }
      returnToMenu() {
        // Volver al menú principal
        this.gameStarted = false;
        this.gameOver = false;
        this.paused = false;
        
        document.getElementById('gameContainer').classList.add('hidden');
        document.getElementById('welcomeMenu').classList.remove('hidden');
        document.getElementById('gameOverModal').classList.add('hidden');
        
        // Resetear estado del juego
        this.board = this.createBoard();
        this.currentPiece = null;
        this.nextPiece = null;
        this.ghostPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropCounter = 0;
        this.lockDelay = 0;
        this.dropInterval = 1000;
        
        // Reinicializar el sistema de bolsa de piezas
        this.initializePieceBag();
    }
    
    init() {
        this.setupEventListeners();
        this.spawnPiece();
        this.updateDisplay();
        this.gameLoop();
    }
    
    createBoard() {
        const board = [];
        for (let y = 0; y < TOTAL_HEIGHT; y++) {
            board[y] = new Array(BOARD_WIDTH).fill(0);
        }
        return board;
    }
      setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameStarted) return;
              if (this.gameOver || this.paused) {
                if (e.key === 'r' || e.key === 'R') {
                    this.restart();
                } else if (e.key === 'p' || e.key === 'P') {
                    this.togglePause();
                } else if (e.key === 'Escape') {
                    this.returnToMenu();
                } else if (e.key === 'Enter' && this.gameOver) {
                    // Enter para reiniciar rápidamente después de game over
                    this.restart();
                }
                return;
            }
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.softDrop();
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case ' ':
                    e.preventDefault();
                    this.hardDrop();
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
                case 'r':
                case 'R':
                    this.restart();
                    break;
                case 'Escape':
                    this.returnToMenu();
                    break;
            }
        });
          // Botones de la interfaz
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.returnToMenu();
        });
    }
      spawnPiece() {
        if (!this.nextPiece) {
            this.nextPiece = this.createRandomPiece();
        }
        
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createRandomPiece();
        
        // Posición inicial centrada en la parte superior (en las filas ocultas)
        this.currentPiece.x = Math.floor((BOARD_WIDTH - this.currentPiece.shape[0].length) / 2);
        this.currentPiece.y = 0;
        
        // Verificar game over - si la pieza no puede colocarse en la posición inicial
        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.gameOver = true;
            this.showGameOverModal();
            return;
        }
        
        // Verificar si alguna parte de la pieza estaría en el área visible y hay colisión
        // Esto detecta cuando el área visible está llena
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    
                    // Si la pieza se extiende al área visible y hay colisión
                    if (boardY >= BOARD_HIDDEN_HEIGHT && 
                        boardY < TOTAL_HEIGHT && 
                        boardX >= 0 && 
                        boardX < BOARD_WIDTH && 
                        this.board[boardY][boardX]) {
                        this.gameOver = true;
                        this.showGameOverModal();
                        return;
                    }
                }
            }
        }
        
        this.updateGhostPiece();
        this.lockDelay = 0;
        this.drawNextPiece();
    }
      createRandomPiece() {
        // Si la bolsa está vacía, llenarla con todas las piezas
        if (this.pieceBag.length === 0) {
            this.fillPieceBag();
        }
        
        // Tomar una pieza aleatoria de la bolsa
        const randomIndex = Math.floor(Math.random() * this.pieceBag.length);
        const type = this.pieceBag.splice(randomIndex, 1)[0];
        
        return {
            type: type,
            shape: JSON.parse(JSON.stringify(PIECES[type].shape)),
            color: PIECES[type].color,
            x: 0,
            y: 0
        };
    }
    
    initializePieceBag() {
        this.pieceBag = [];
        this.fillPieceBag();
    }
    
    fillPieceBag() {
        // Agregar cada una de las 7 piezas a la bolsa
        for (const pieceType of PIECE_TYPES) {
            this.pieceBag.push(pieceType);
        }
    }
    
    rotatePiece() {
        const rotated = this.rotate(this.currentPiece.shape);
        const previousShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        
        // Wall kicks - intentar ajustar la posición si hay colisión
        const kicks = this.getWallKicks(this.currentPiece);
        let validPosition = false;
        
        for (const kick of kicks) {
            if (!this.checkCollision(this.currentPiece, kick.x, kick.y)) {
                this.currentPiece.x += kick.x;
                this.currentPiece.y += kick.y;
                validPosition = true;
                break;
            }
        }
          if (!validPosition) {
            this.currentPiece.shape = previousShape;
        } else {
            this.updateGhostPiece();
            this.lockDelay = 0; // Reset lock delay al rotar exitosamente
        }
    }
    
    rotate(matrix) {
        const N = matrix.length;
        const rotated = matrix.map(row => [...row]);
        
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                rotated[j][N - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }
    
    getWallKicks(piece) {
        // Sistema básico de wall kicks
        return [
            { x: 0, y: 0 },   // Sin movimiento
            { x: -1, y: 0 },  // Izquierda
            { x: 1, y: 0 },   // Derecha
            { x: 0, y: -1 },  // Arriba
            { x: -1, y: -1 }, // Diagonal izquierda-arriba
            { x: 1, y: -1 }   // Diagonal derecha-arriba
        ];
    }
      movePiece(dx, dy) {
        if (!this.checkCollision(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            this.updateGhostPiece();
            
            // Reset lock delay cuando la pieza se mueve
            this.lockDelay = 0;
        }
    }
    
    softDrop() {
        if (!this.checkCollision(this.currentPiece, 0, 1)) {
            this.currentPiece.y++;
            this.score += SCORING.SOFT_DROP;
            this.lockDelay = 0;
            this.updateDisplay();
        }
    }
      hardDrop() {
        let dropDistance = 0;
        while (!this.checkCollision(this.currentPiece, 0, 1)) {
            this.currentPiece.y++;
            dropDistance++;
            // Protección adicional para evitar loops infinitos
            if (this.currentPiece.y >= TOTAL_HEIGHT) {
                break;
            }
        }
        this.score += dropDistance * SCORING.HARD_DROP;
        this.lockPiece();
        this.updateDisplay();
    }
      updateGhostPiece() {
        this.ghostPiece = {
            ...this.currentPiece,
            shape: JSON.parse(JSON.stringify(this.currentPiece.shape))
        };
        
        while (!this.checkCollision(this.ghostPiece, 0, 1)) {
            this.ghostPiece.y++;
            // Protección adicional para evitar loops infinitos
            if (this.ghostPiece.y >= TOTAL_HEIGHT) {
                break;
            }
        }
    }
      checkCollision(piece, dx = 0, dy = 0) {
        const newX = piece.x + dx;
        const newY = piece.y + dy;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;
                    
                    // Verificar límites del tablero
                    if (boardX < 0 || boardX >= BOARD_WIDTH || 
                        boardY >= TOTAL_HEIGHT || 
                        (boardY >= 0 && this.board[boardY][boardX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }      lockPiece() {
        // Colocar la pieza en el tablero
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    
                    // Validar que la posición esté dentro de los límites del tablero
                    if (boardY >= 0 && boardY < TOTAL_HEIGHT && 
                        boardX >= 0 && boardX < BOARD_WIDTH) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        // Verificar líneas completas
        this.clearLines();
        
        // Verificar game over - si hay bloques en las primeras filas visibles
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (this.board[BOARD_HIDDEN_HEIGHT][x] !== 0) {
                this.gameOver = true;
                this.showGameOverModal();
                return;
            }
        }
        
        // Generar nueva pieza solo si el juego no ha terminado
        if (!this.gameOver) {
            this.spawnPiece();
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = TOTAL_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                // Línea completa encontrada
                this.board.splice(y, 1);
                this.board.unshift(new Array(BOARD_WIDTH).fill(0));
                linesCleared++;
                y++; // Verificar la misma línea nuevamente
            }
        }
        
        if (linesCleared > 0) {
            this.updateScore(linesCleared);
            this.lines += linesCleared;
            this.updateLevel();
        }
    }
    
    updateScore(linesCleared) {
        let points = 0;
        switch (linesCleared) {
            case 1:
                points = SCORING.SINGLE;
                break;
            case 2:
                points = SCORING.DOUBLE;
                break;
            case 3:
                points = SCORING.TRIPLE;
                break;
            case 4:
                points = SCORING.TETRIS;
                break;
        }
        
        this.score += points * this.level;
    }
    
    updateLevel() {
        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
        }
    }
      gameLoop(currentTime = 0) {
        if (this.gameOver) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (!this.paused) {
            this.dropCounter += deltaTime;
            
            // Verificar si la pieza puede moverse hacia abajo
            const canMoveDown = !this.checkCollision(this.currentPiece, 0, 1);
            
            if (this.dropCounter > this.dropInterval) {
                if (canMoveDown) {
                    this.currentPiece.y++;
                    this.lockDelay = 0;
                }
                this.dropCounter = 0;
            }
            
            // Si la pieza no puede moverse hacia abajo, iniciar el lock delay
            if (!canMoveDown) {
                this.lockDelay += deltaTime;
                if (this.lockDelay >= this.lockDelayMax) {
                    this.lockPiece();
                }
            } else {
                this.lockDelay = 0;
            }
            
            this.draw();
            this.updateDisplay();
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    draw() {
        // Limpiar canvas
        this.ctx.fillStyle = COLORS.EMPTY;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar grid
        this.drawGrid();
        
        // Dibujar tablero
        this.drawBoard();
        
        // Dibujar pieza fantasma
        if (this.ghostPiece) {
            this.drawPiece(this.ghostPiece, true);
        }
        
        // Dibujar pieza actual
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece);
        }
    }
      drawGrid() {
        this.ctx.strokeStyle = COLORS.GRID;
        this.ctx.lineWidth = 1;
        
        // Líneas verticales (solo en el área visible)
        for (let x = 0; x <= BOARD_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * CELL_SIZE, 0);
            this.ctx.lineTo(x * CELL_SIZE, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Líneas horizontales (solo área visible - 20 filas)
        for (let y = 0; y <= BOARD_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * CELL_SIZE);
            this.ctx.lineTo(this.canvas.width, y * CELL_SIZE);
            this.ctx.stroke();
        }
    }
      drawBoard() {
        // Solo dibujar las filas visibles (desde BOARD_HIDDEN_HEIGHT hasta TOTAL_HEIGHT)
        for (let y = BOARD_HIDDEN_HEIGHT; y < TOTAL_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (this.board[y][x]) {
                    // Ajustar la posición Y para mostrar correctamente en el canvas
                    this.drawCell(x, y - BOARD_HIDDEN_HEIGHT, this.board[y][x]);
                }
            }
        }
    }
      drawPiece(piece, isGhost = false) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardY = piece.y + y;
                    // Solo dibujar si está en el área visible (no en las filas ocultas)
                    if (boardY >= BOARD_HIDDEN_HEIGHT) {
                        // Ajustar la coordenada Y para el canvas (restar las filas ocultas)
                        const canvasY = boardY - BOARD_HIDDEN_HEIGHT;
                        this.drawCell(piece.x + x, canvasY, piece.color, isGhost);
                    }
                }
            }
        }
    }
    
    drawCell(x, y, color, isGhost = false) {
        const pixelX = x * CELL_SIZE;
        const pixelY = y * CELL_SIZE;
        
        if (isGhost) {
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);
            this.ctx.globalAlpha = 1;
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);
        } else {
            // Fondo del bloque
            this.ctx.fillStyle = color;
            this.ctx.fillRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);
            
            // Efecto 3D
            this.ctx.fillStyle = this.lightenColor(color, 0.3);
            this.ctx.fillRect(pixelX, pixelY, CELL_SIZE - 2, 4);
            this.ctx.fillRect(pixelX, pixelY, 4, CELL_SIZE - 2);
            
            this.ctx.fillStyle = this.darkenColor(color, 0.3);
            this.ctx.fillRect(pixelX + CELL_SIZE - 4, pixelY + 4, 4, CELL_SIZE - 4);
            this.ctx.fillRect(pixelX + 4, pixelY + CELL_SIZE - 4, CELL_SIZE - 4, 4);
            
            // Borde
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);
        }
    }
    
    lightenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.floor(255 * factor));
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.floor(255 * factor));
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.floor(255 * factor));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    darkenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.floor(255 * factor));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.floor(255 * factor));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.floor(255 * factor));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }    drawNextPiece() {
        // Limpiar canvas
        this.nextCtx.fillStyle = COLORS.EMPTY;
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (!this.nextPiece) return;
        
        const piece = this.nextPiece;
        const cellSize = 19;
        const offsetX = (this.nextCanvas.width - piece.shape[0].length * cellSize) / 2;
        const offsetY = (this.nextCanvas.height - piece.shape.length * cellSize) / 2;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const pixelX = offsetX + x * cellSize;
                    const pixelY = offsetY + y * cellSize;
                    
                    this.nextCtx.fillStyle = piece.color;
                    this.nextCtx.fillRect(pixelX, pixelY, cellSize, cellSize);
                    
                    this.nextCtx.strokeStyle = '#000';
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(pixelX, pixelY, cellSize, cellSize);
                }
            }
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score.toLocaleString();
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }
    
    togglePause() {
        this.paused = !this.paused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.paused ? 'Reanudar' : 'Pausar';
    }
      restart() {
        this.board = this.createBoard();
        this.currentPiece = null;
        this.nextPiece = null;
        this.ghostPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        this.dropCounter = 0;
        this.lockDelay = 0;
        this.dropInterval = 1000;
        
        // Reinicializar el sistema de bolsa de piezas
        this.initializePieceBag();
        
        document.getElementById('gameOverModal').classList.add('hidden');
        document.getElementById('pauseBtn').textContent = 'Pausar';
        
        this.spawnPiece();
        this.updateDisplay();
    }
      showGameOverModal() {
        document.getElementById('finalScore').textContent = this.score.toLocaleString();
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('finalLines').textContent = this.lines;
        document.getElementById('gameOverModal').classList.remove('hidden');
        
        // Auto-reinicio opcional después de 5 segundos (comentado por defecto)
        // setTimeout(() => {
        //     if (!document.getElementById('gameOverModal').classList.contains('hidden')) {
        //         this.restart();
        //     }
        // }, 5000);
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new TetrisGame();
});
