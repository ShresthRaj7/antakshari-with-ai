
// Enhanced Main page JavaScript with loading animation & theme, IEEE SB style

class AntakshariApp {
  constructor() {
    this.currentView = "loading"
    this.playerName = ""
    this.selectedDifficulty = "medium"
    this.gameMode = "single"
    this.loadingMessages = [
      "🎧 Tuning the notes...",
      "🎤 Listening for your vibe...",
      "🎵 Mixing the perfect playlist...",
      "🎼 Composing your experience...",
    ]
    this.currentMessageIndex = 0
    this.messageInterval = null

    this.init()
  }

  async init() {
    try {
      this.showLoadingScreen()
      await this.delay(1000) // simulate app prep
      this.setupEventListeners()
      this.setupTheme()
      this.animateNotes()
      this.loadSavedData()

      await this.delay(3000) // Keep loading screen for effect
      this.showMainApp()
    } catch (err) {
      console.error("Initialization error:", err)
      this.showError("App failed to load. Please try again.")
    }
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen")
    const app = document.getElementById("app")

    if (loadingScreen) loadingScreen.style.display = "flex"
    if (app) app.classList.add("hidden")

    this.rotateLoadingMessages()
  }

  rotateLoadingMessages() {
    const status = document.getElementById("loadingStatus")
    if (!status) return

    const updateMessage = () => {
      status.textContent = this.loadingMessages[this.currentMessageIndex]
      this.currentMessageIndex = (this.currentMessageIndex + 1) % this.loadingMessages.length
    }

    updateMessage()
    this.messageInterval = setInterval(updateMessage, 2000)
  }

  showMainApp() {
    clearInterval(this.messageInterval)

    const loadingScreen = document.getElementById("loadingScreen")
    const app = document.getElementById("app")

    if (loadingScreen) loadingScreen.style.display = "none"
    if (app) app.classList.remove("hidden")
  }

  setupEventListeners() {
    const startBtn = document.getElementById("startBtn")
    const playerNameInput = document.getElementById("playerName")
    const themeToggle = document.getElementById("themeToggle")
    const instructionsBtn = document.getElementById("instructionsBtn")
    const modal = document.getElementById("instructionsModal")
    const closeBtn = modal?.querySelector(".close")

    if (startBtn && playerNameInput) {
      startBtn.addEventListener("click", () => this.startGame())
      playerNameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.startGame()
      })
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }

    if (instructionsBtn && modal && closeBtn) {
      instructionsBtn.addEventListener("click", () => (modal.style.display = "block"))
      closeBtn.addEventListener("click", () => (modal.style.display = "none"))
      window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none"
      })
    }
  }

  startGame() {
    const playerNameInput = document.getElementById("playerName")
    const startBtn = document.getElementById("startBtn")

    this.playerName = playerNameInput.value.trim() || "Player"
    localStorage.setItem("playerName", this.playerName)

    if (startBtn) {
      startBtn.innerHTML = "🎵 Starting Game..."
      startBtn.disabled = true
    }

    setTimeout(() => {
      window.location.href = "game.html"
    }, 1000)
  }

  setupTheme() {
    const savedTheme = localStorage.getItem("theme") || "light"
    document.documentElement.setAttribute("data-theme", savedTheme)

    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙"
    }
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme")
    const next = current === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", next)
    localStorage.setItem("theme", next)

    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.textContent = next === "dark" ? "☀️" : "🌙"
    }
  }

  animateNotes() {
    const notes = document.querySelectorAll(".note")
    notes.forEach((note) => {
      const delay = Math.random() * 5
      const duration = 5 + Math.random() * 5
      note.style.animationDelay = `${delay}s`
      note.style.animationDuration = `${duration}s`
    })
  }

  loadSavedData() {
    const storedName = localStorage.getItem("playerName")
    if (storedName) {
      const input = document.getElementById("playerName")
      if (input) input.value = storedName
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  showError(msg) {
    alert(msg) // You can replace this with a nicer toast UI
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AntakshariApp()
})





document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const startBtn = document.getElementById('startBtn');
  const gameModeModal = document.getElementById('gameModeModal');
  const closeGameMode = document.getElementById('closeGameMode');
  const modeButtons = document.querySelectorAll('.mode-btn');

  // Show modal on Start Game click
  startBtn.addEventListener('click', function () {
    gameModeModal.style.display = 'flex';
  });

  // Close modal
  closeGameMode.addEventListener('click', function () {
    gameModeModal.style.display = 'none';
  });

  // Select game mode
  modeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      modeButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      // Save mode to localStorage
      localStorage.setItem('selectedGameMode', this.dataset.mode);
      // Hide modal and proceed to game logic
      gameModeModal.style.display = 'none';
      // You can now start the game with the selected mode
      // startGame(this.dataset.mode); // Implement your game start logic here
    });
  });

  // Optional: Close modal when clicking outside content
  window.addEventListener('click', function (event) {
    if (event.target === gameModeModal) {
      gameModeModal.style.display = 'none';
    }
  });
});

