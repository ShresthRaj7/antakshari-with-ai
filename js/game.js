// Final updated game.js with song validation, timer-triggered end game, and working end/restart buttons

class AntakshariGame {
    constructor() {
        this.playerScore = 0;
        this.aiScore = 0;
        this.currentLetter = this.getRandomLetter();
        this.token = null;
        this.timerInterval = null;
        this.responseTimes = [];
        this.gameStartTime = Date.now();
        this.gameHistory = [];
        this.init();
    }

    async init() {
        await this.getSpotifyToken();
        this.updateUI();
        this.startTimer();

        document.getElementById('submitBtn').addEventListener('click', () => this.handlePlayerTurn());
        document.getElementById('endGameBtn').addEventListener('click', () => this.endGame());
        document.getElementById('restartGameBtn').addEventListener('click', () => location.reload());
    }

    async getSpotifyToken() {
        const clientId = '4754708cb13c46e0a4e8c0dd627e08b7';
        const clientSecret = '7f99df8dea1b49958c32d8062b61a407';
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await result.json();
        this.token = data.access_token;
    }

    updateUI() {
        document.getElementById('playerScore').innerText = this.playerScore;
        document.getElementById('aiScore').innerText = this.aiScore;
        document.getElementById('currentLetter').innerText = this.currentLetter.toUpperCase();
    }

    getRandomLetter() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return letters[Math.floor(Math.random() * letters.length)];
    }

    startTimer() {
        let time = 30;
        const timerDisplay = document.getElementById('timerText');
        clearInterval(this.timerInterval);
        timerDisplay.innerText = time;

        this.timerInterval = setInterval(() => {
            time--;
            timerDisplay.innerText = time;
            if (time <= 0) {
                clearInterval(this.timerInterval);
                alert("⏱ Time's up! Game Over.");
                this.endGame();
            }
        }, 1000);
    }

    async validateSong(songName) {
        const query = `track:${songName}`;
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });
        const data = await response.json();
        return data.tracks.items.length > 0;
    }

    async handlePlayerTurn() {
        const playerInput = document.getElementById('songInput').value.trim();

        if (!playerInput || playerInput[0].toUpperCase() !== this.currentLetter) {
            alert('❌ Song must start with the letter ' + this.currentLetter);
            return;
        }

        const isValid = await this.validateSong(playerInput);
        if (!isValid) {
            alert('❌ The entered song is not found on Spotify.');
            return;
        }

        clearInterval(this.timerInterval);
        this.playerScore++;
        this.responseTimes.push(30 - parseInt(document.getElementById('timerText').innerText));
        this.gameHistory.push({ player: 'You', song: playerInput });

        this.displaySong('player', playerInput, 'You');
        this.currentLetter = playerInput.slice(-1).toUpperCase();
        this.updateUI();
        document.getElementById('songInput').value = '';
        await this.handleAITurn();
    }

    async handleAITurn() {
        this.startTimer();
        const aiSong = await this.getSongFromSpotify(this.currentLetter);
        if (aiSong) {
            this.aiScore++;
            const songText = `${aiSong.name} by ${aiSong.artists[0].name}`;
            this.gameHistory.push({ player: 'AI', song: songText });
            this.displaySong('ai', songText, 'AI');
            this.currentLetter = aiSong.name.slice(-1).toUpperCase();
        } else {
            alert('🎵 AI couldn’t find a matching song! You win this round.');
        }
        this.updateUI();
    }

    async getSongFromSpotify(letter) {
        const query = `track:${letter}*`;
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        });
        const data = await response.json();
        const tracks = data.tracks.items.filter(track => track.name[0].toUpperCase() === letter);
        return tracks.length > 0 ? tracks[Math.floor(Math.random() * tracks.length)] : null;
    }

    displaySong(role, text, label) {
        const log = document.getElementById('historyList');
        const entry = document.createElement('p');
        entry.innerText = `${label}: ${text}`;
        log.appendChild(entry);

        const lastPlayedTitle = document.querySelector('#songCard .song-title');
        const lastPlayedArtist = document.querySelector('#songCard .song-artist');

        if (label === 'AI') {
            const [title, artist] = text.split(' by ');
            lastPlayedTitle.textContent = title;
            lastPlayedArtist.textContent = artist;
        } else {
            lastPlayedTitle.textContent = text;
            lastPlayedArtist.textContent = 'You';
        }
    }

    getWinner() {
        if (this.playerScore > this.aiScore) return 'player';
        if (this.aiScore > this.playerScore) return 'ai';
        return 'tie';
    }

    calculateAverageResponseTime() {
        if (this.responseTimes.length === 0) return 0;
        const total = this.responseTimes.reduce((a, b) => a + b, 0);
        return Math.round(total / this.responseTimes.length);
    }

    endGame() {
        clearInterval(this.timerInterval);

        const gameResult = {
            playerName: 'Player',
            playerScore: this.playerScore,
            aiScore: this.aiScore,
            winner: this.getWinner(),
            reason: 'manual',
            totalSongs: this.playerScore + this.aiScore,
            gameDuration: Math.floor((Date.now() - this.gameStartTime) / 1000),
            averageResponseTime: this.calculateAverageResponseTime(),
            gameHistory: this.gameHistory
        };

        localStorage.setItem('gameResult', JSON.stringify(gameResult));
        window.location.href = 'result.html';
    }
}

window.onload = () => {
    new AntakshariGame();
};
