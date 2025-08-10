// Game Configuration
const GAME_CONFIG = {
    gridSize: 10,
    colors: ["#E74C3C", "#2ECC71", "#3498DB", "#F1C40F", "#9B59B6"],
    colorNames: ["red", "green", "blue", "yellow", "purple"],
    difficulties: {
        easy: { moves: 6, colorCount: 3 },
        normal: { moves: 4, colorCount: 4 },
        difficult: { moves: 3, colorCount: 5 }
    },
    levelSets: [
        // Each level can override moves & colorCount optionally
        { id: 1, name: 'Level 1', difficulty: 'easy' },
        { id: 2, name: 'Level 2', difficulty: 'easy' },
        { id: 3, name: 'Level 3', difficulty: 'normal' },
        { id: 4, name: 'Level 4', difficulty: 'normal' },
        { id: 5, name: 'Level 5', difficulty: 'difficult' }
    ]
};

class OverflowGame {
    constructor() {
        this.grid = [];
        this.currentDifficulty = 'easy';
        this.movesRemaining = 6;
        this.gameColors = [];
        this.isGameActive = false;
    this.isAnimating = false; // Prevent overlapping animations
    this.movesHistory = [];   // Track selected colors for potential future undo / analytics
    this.debug = false;       // Toggle verbose logs
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.initializeElements();
        this.bindEvents();
        this.showIntroScreen();
    }

    initializeElements() {
        // Screens
    this.hubScreen = document.getElementById('hubScreen');
        this.introScreen = document.getElementById('introScreen');
        this.gameScreen = document.getElementById('gameScreen');
        
        // Game elements
        this.gameGrid = document.getElementById('gameGrid');
        this.colorButtons = document.getElementById('colorButtons');
        this.movesCounter = document.getElementById('movesRemaining');
        
        // Buttons
        this.startButton = document.getElementById('startGame');
        this.resetButton = document.getElementById('resetButton');
    this.backToHubBtn = document.getElementById('backToHubBtn');
    this.backToHubFromIntro = document.getElementById('backToHubFromIntro');
    this.openDifficultyPanel = document.getElementById('openDifficultyPanel');
    this.nextLevelBtn = document.getElementById('nextLevelBtn');
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        
        // Modals
        this.winModal = document.getElementById('winModal');
        this.loseModal = document.getElementById('loseModal');
        
        // Modal buttons
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.tryAgainBtn = document.getElementById('tryAgainBtn');
        this.backToMenuBtn = document.getElementById('backToMenuBtn');
        this.backToMenuBtn2 = document.getElementById('backToMenuBtn2');
        
        // Particle container
        this.particleContainer = document.getElementById('particleContainer');

    // Levels grid
    this.levelsGrid = document.getElementById('levelsGrid');
    }

    bindEvents() {
        // Difficulty selection
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectDifficulty(e);
            });
        });

        // Start game - Make sure this works
        if (this.startButton) {
            this.startButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Start button clicked!'); // Debug log
                this.startGame();
            });
        }

        // Back to hub from intro
        if (this.backToHubFromIntro) {
            this.backToHubFromIntro.addEventListener('click', (e) => {
                e.preventDefault();
                this.showHub();
            });
        }

        if (this.backToHubBtn) {
            this.backToHubBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showHub();
            });
        }

        if (this.openDifficultyPanel) {
            this.openDifficultyPanel.addEventListener('click', (e) => {
                e.preventDefault();
                this.showIntroScreen();
            });
        }

        if (this.nextLevelBtn) {
            this.nextLevelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.advanceToNextLevel();
            });
        }

        // Reset button
        if (this.resetButton) {
            this.resetButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetGame();
            });
        }

        // Modal buttons
        if (this.playAgainBtn) {
            this.playAgainBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetGame();
            });
        }
        if (this.tryAgainBtn) {
            this.tryAgainBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetGame();
            });
        }
        if (this.backToMenuBtn) {
            this.backToMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showIntroScreen();
            });
        }
        if (this.backToMenuBtn2) {
            this.backToMenuBtn2.addEventListener('click', (e) => {
                e.preventDefault();
                this.showIntroScreen();
            });
        }

        // Close modals on background click
        [this.winModal, this.loseModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideModals();
                    }
                });
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    if (this.introScreen.classList.contains('active')) {
                        e.preventDefault();
                        this.startGame();
                    }
                    break;
                case 'r':
                case 'R':
                    if (this.gameScreen.classList.contains('active')) {
                        e.preventDefault();
                        this.resetGame();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.hideModals();
                    break;
            }
        });
    }

    selectDifficulty(e) {
        console.log('Difficulty selected:', e.target.dataset.difficulty); // Debug log
        
        // Remove active class from all buttons
        this.difficultyButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to selected button
        e.target.classList.add('active');
        
        // Set current difficulty
        this.currentDifficulty = e.target.dataset.difficulty;
        
        this.playSound('hover');
    }

    showIntroScreen() {
        console.log('Showing intro screen'); // Debug log
        this.hubScreen.classList.remove('active');
        this.introScreen.classList.add('active');
        this.gameScreen.classList.remove('active');
        this.hideModals();
        this.isGameActive = false;
    }

    showHub() {
        this.introScreen.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.hubScreen.classList.add('active');
        this.hideModals();
        this.isGameActive = false;
    }

    startGame() {
        console.log('Starting game with difficulty:', this.currentDifficulty); // Debug log
        this.playSound('click');
        
        // Hide intro, show game
        this.introScreen.classList.remove('active');
    this.hubScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        
        // Initialize game
        this.initializeGame();
        this.isGameActive = true;
    }

    initializeGame() {
        console.log('Initializing game...'); // Debug log
        if (this.currentLevel) {
            // Use level's mapped difficulty
            this.currentDifficulty = this.currentLevel.difficulty;
        }
        const difficulty = GAME_CONFIG.difficulties[this.currentDifficulty];
        this.movesRemaining = difficulty.moves;
        this.gameColors = GAME_CONFIG.colors.slice(0, difficulty.colorCount);
        
        // Update moves counter
        this.updateMovesDisplay();
        
        // Generate grid
        this.generateGrid();
        
        // Create color buttons
        this.createColorButtons();
        
        // Hide modals
        this.hideModals();
    }

    buildLevels() {
        if (!this.levelsGrid) return;
        this.levelsGrid.innerHTML = '';
        GAME_CONFIG.levelSets.forEach(level => {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.textContent = level.id;
            btn.title = level.name + ' (' + level.difficulty + ')';
            btn.dataset.levelId = level.id;
            btn.addEventListener('click', () => {
                this.currentLevel = level;
                this.startGame();
            });
            this.levelsGrid.appendChild(btn);
        });
    }

    advanceToNextLevel() {
        if (!this.currentLevel) {
            this.showHub();
            return;
        }
        const idx = GAME_CONFIG.levelSets.findIndex(l => l.id === this.currentLevel.id);
        const next = GAME_CONFIG.levelSets[idx + 1];
        if (next) {
            this.currentLevel = next;
            this.hideModals();
            this.startGame();
        } else {
            // Completed all levels
            this.showHub();
        }
    }

    generateGrid() {
        console.log('Generating grid...'); // Debug log
        this.grid = [];
        
        if (!this.gameGrid) {
            console.error('Game grid element not found!');
            return;
        }
        
        this.gameGrid.innerHTML = '';
        
        for (let i = 0; i < GAME_CONFIG.gridSize * GAME_CONFIG.gridSize; i++) {
            const colorIndex = Math.floor(Math.random() * this.gameColors.length);
            const color = this.gameColors[colorIndex];
            this.grid.push(color);
            
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.backgroundColor = color;
            cell.dataset.index = i;
            
            this.gameGrid.appendChild(cell);
        }
    }

    createColorButtons() {
        console.log('Creating color buttons...'); // Debug log
        
        if (!this.colorButtons) {
            console.error('Color buttons container not found!');
            return;
        }
        
        this.colorButtons.innerHTML = '';
        
        this.gameColors.forEach((color, index) => {
            const button = document.createElement('button');
            button.className = 'color-btn';
            button.style.backgroundColor = color;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectColor(color);
            });
            
            this.colorButtons.appendChild(button);
        });
    }

    selectColor(selectedColor) {
        if (!this.isGameActive || this.movesRemaining <= 0 || this.isAnimating) return;
        const startColor = this.grid[0];
        if (startColor === selectedColor) return;
        this.movesHistory.push(selectedColor);
        if (this.debug) console.log('Color selected:', selectedColor);
        this.playSound('click');
        this.isAnimating = true;

        // Perform flood fill & animate, then evaluate result
        this.floodFill(0, startColor, selectedColor).then(() => {
            this.movesRemaining--;
            this.updateMovesDisplay();
            if (this.checkWinCondition()) {
                this.gameWon();
            } else if (this.movesRemaining <= 0) {
                this.gameLost();
            }
            this.isAnimating = false;
        });
    }

    floodFill(startIndex, originalColor, newColor) {
        if (originalColor === newColor) return Promise.resolve();
        const stack = [startIndex];
        const visited = new Set();
        const cellsToChange = [];
        while (stack.length > 0) {
            const currentIndex = stack.pop();
            if (visited.has(currentIndex) || currentIndex < 0 || currentIndex >= this.grid.length) continue;
            if (this.grid[currentIndex] !== originalColor) continue;
            visited.add(currentIndex);
            cellsToChange.push(currentIndex);
            this.getNeighbors(currentIndex).forEach(n => {
                if (!visited.has(n) && this.grid[n] === originalColor) stack.push(n);
            });
        }
        return this.animateColorChange(cellsToChange, newColor);
    }

    getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / GAME_CONFIG.gridSize);
        const col = index % GAME_CONFIG.gridSize;
        
        // Up
        if (row > 0) neighbors.push(index - GAME_CONFIG.gridSize);
        // Down
        if (row < GAME_CONFIG.gridSize - 1) neighbors.push(index + GAME_CONFIG.gridSize);
        // Left
        if (col > 0) neighbors.push(index - 1);
        // Right
        if (col < GAME_CONFIG.gridSize - 1) neighbors.push(index + 1);
        
        return neighbors;
    }

    animateColorChange(indices, newColor) {
        if (!indices.length) return Promise.resolve();
        return new Promise(resolve => {
            indices.forEach((index, i) => {
                setTimeout(() => {
                    this.grid[index] = newColor;
                    const cell = this.gameGrid.children[index];
                    if (cell) {
                        cell.classList.add('changing');
                        cell.style.backgroundColor = newColor;
                        setTimeout(() => cell.classList.remove('changing'), 600);
                    }
                }, i * 45); // Slightly faster cascade
            });
            const total = indices.length * 45 + 650; // final cell + cleanup buffer
            setTimeout(resolve, total);
        });
    }

    checkWinCondition() {
        const firstColor = this.grid[0];
        return this.grid.every(color => color === firstColor);
    }

    gameWon() {
        console.log('Game won!'); // Debug log
        this.isGameActive = false;
        this.playSound('success');
        this.createParticleEffect();
        
        setTimeout(() => {
            if (this.winModal) {
                this.winModal.classList.remove('hidden');
                if (this.nextLevelBtn) {
                    // Hide next level if last
                    const isLast = this.currentLevel && !GAME_CONFIG.levelSets.some(l => l.id === this.currentLevel.id + 1);
                    this.nextLevelBtn.style.display = isLast ? 'none' : 'inline-flex';
                }
            }
        }, 1000);
    }

    gameLost() {
        console.log('Game lost!'); // Debug log
        this.isGameActive = false;
        this.playSound('fail');
        
        setTimeout(() => {
            if (this.loseModal) {
                this.loseModal.classList.remove('hidden');
            }
        }, 500);
    }

    resetGame() {
        console.log('Resetting game...'); // Debug log
        this.playSound('click');
        this.hideModals();
        this.initializeGame();
    }

    updateMovesDisplay() {
        if (this.movesCounter) {
            this.movesCounter.textContent = this.movesRemaining;
            
            // Add warning style when moves are low
            if (this.movesRemaining <= 1) {
                this.movesCounter.style.color = 'var(--color-error)';
            } else {
                this.movesCounter.style.color = 'var(--color-primary)';
            }
        }
    }

    hideModals() {
        if (this.winModal) this.winModal.classList.add('hidden');
        if (this.loseModal) this.loseModal.classList.add('hidden');
    }

    createParticleEffect() {
        if (!this.particleContainer) return;
        
        const colors = this.gameColors;
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Random starting position
                const startX = Math.random() * window.innerWidth;
                const startY = window.innerHeight;
                
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';
                
                this.particleContainer.appendChild(particle);
                
                // Animate particle
                this.animateParticle(particle);
                
            }, i * 100);
        }
    }

    animateParticle(particle) {
        const duration = 2000 + Math.random() * 1000;
        const startTime = Date.now();
        const startY = parseInt(particle.style.top);
        const endY = -100;
        const startX = parseInt(particle.style.left);
        const drift = (Math.random() - 0.5) * 200;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                particle.remove();
                return;
            }
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const y = startY + (endY - startY) * easeOut;
            const x = startX + drift * progress;
            
            particle.style.top = y + 'px';
            particle.style.left = x + 'px';
            particle.style.opacity = 1 - progress;
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }

    playSound(type) {
        // Simulate sound effects with console feedback and visual feedback
        switch (type) {
            case 'click':
                console.log('🔊 Click sound');
                break;
            case 'success':
                console.log('🎉 Success sound');
                break;
            case 'fail':
                console.log('😔 Fail sound');
                break;
            case 'hover':
                console.log('✨ Hover sound');
                break;
        }
        
        // Visual feedback for sound
        this.createSoundVisualFeedback(type);
    }

    createSoundVisualFeedback(type) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            pointer-events: none;
        `;
        
        const icons = {
            click: '🔊',
            success: '🎉',
            fail: '😔',
            hover: '✨'
        };
        
        feedback.textContent = `${icons[type]} ${type.toUpperCase()}`;
        document.body.appendChild(feedback);
        
        // Animate in
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0)';
        });
        
        // Remove after delay
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(-10px)';
            setTimeout(() => feedback.remove(), 300);
        }, 1500);
    }
}

// Single global initialization guard
if (!window.__overflowGameInitialized) {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.__overflowGameInitialized) return;
        window.__overflowGameInitialized = true;
        window.gameInstance = new OverflowGame();
    window.gameInstance.buildLevels();
    });
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        window.__overflowGameInitialized = true;
        window.gameInstance = new OverflowGame();
    window.gameInstance.buildLevels();
    }
}

// Add hover effects and ripple animation
document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('btn') || 
        e.target.classList.contains('color-btn') ||
        e.target.classList.contains('difficulty-btn')) {
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        if (getComputedStyle(e.target).position === 'static') {
            e.target.style.position = 'relative';
        }
        e.target.style.overflow = 'hidden';
        
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple && ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);