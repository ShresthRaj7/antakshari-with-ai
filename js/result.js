// Result page JavaScript
class AntakshariResult {
  constructor() {
    this.gameResult = null
    this.init()
  }

  init() {
    this.loadGameResult()
    this.setupUI()
    this.setupEventListeners()
    this.setupTheme()
    this.createConfetti()
  }

  loadGameResult() {
    const savedResult = localStorage.getItem("gameResult")
    if (savedResult) {
      this.gameResult = JSON.parse(savedResult)
    } else {
      // Default result if no data found
      this.gameResult = {
        playerName: "Player",
        playerScore: 0,
        aiScore: 0,
        winner: "tie",
        reason: "manual",
        totalSongs: 0,
        gameDuration: 0,
        averageResponseTime: 0,
        gameHistory: [],
      }
    }
  }

  setupUI() {
    // Update player name
    document.getElementById("playerNameDisplay").textContent = this.gameResult.playerName

    // Update scores
    document.getElementById("finalPlayerScore").textContent = this.gameResult.playerScore
    document.getElementById("finalAiScore").textContent = this.gameResult.aiScore

    // Update game stats
    document.getElementById("totalSongs").textContent = this.gameResult.totalSongs
    document.getElementById("gameDuration").textContent = this.formatDuration(this.gameResult.gameDuration)
    document.getElementById("averageTime").textContent = `${this.gameResult.averageResponseTime}s`

    // Update result based on winner
    this.updateResultDisplay()
  }

  updateResultDisplay() {
    const resultContainer = document.querySelector(".result-content")
    const resultIcon = document.getElementById("resultIcon")
    const resultTitle = document.getElementById("resultTitle")
    const resultMessage = document.getElementById("resultMessage")

    switch (this.gameResult.winner) {
      case "player":
        resultContainer.classList.add("winner")
        resultIcon.textContent = "🏆"
        resultTitle.textContent = "Congratulations!"
        resultMessage.textContent = `${this.gameResult.playerName} wins the game!`
        break
      case "ai":
        resultContainer.classList.add("loser")
        resultIcon.textContent = "😔"
        resultTitle.textContent = "Game Over!"
        resultMessage.textContent = "AI wins this round. Better luck next time!"
        break
      case "tie":
        resultContainer.classList.add("tie")
        resultIcon.textContent = "🤝"
        resultTitle.textContent = "It's a Tie!"
        resultMessage.textContent = "Great game! You both played equally well."
        break
    }
  }

  setupEventListeners() {
    // Play Again button
    document.getElementById("playAgainBtn").addEventListener("click", () => {
      this.playAgain()
    })

    // Home button
    document.getElementById("homeBtn").addEventListener("click", () => {
      this.goHome()
    })

    // Share button
    document.getElementById("shareBtn").addEventListener("click", () => {
      this.shareResult()
    })

    // Theme toggle
    document.getElementById("themeToggle").addEventListener("click", () => {
      this.toggleTheme()
    })
  }

  setupTheme() {
    const savedTheme = localStorage.getItem("theme") || "light"
    document.documentElement.setAttribute("data-theme", savedTheme)

    const themeToggle = document.getElementById("themeToggle")
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙"
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)

    const themeToggle = document.getElementById("themeToggle")
    themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙"
  }

  createConfetti() {
    if (this.gameResult.winner === "player") {
      const confettiContainer = document.getElementById("confetti")
      const colors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"]

      for (let i = 0; i < 50; i++) {
        const confettiPiece = document.createElement("div")
        confettiPiece.className = "confetti-piece"
        confettiPiece.style.left = Math.random() * 100 + "%"
        confettiPiece.style.background = colors[Math.floor(Math.random() * colors.length)]
        confettiPiece.style.animationDelay = Math.random() * 3 + "s"
        confettiPiece.style.animationDuration = Math.random() * 3 + 2 + "s"
        confettiContainer.appendChild(confettiPiece)
      }
    }
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  playAgain() {
    // Clear previous game data
    localStorage.removeItem("gameResult")

    // Add loading animation
    const playAgainBtn = document.getElementById("playAgainBtn")
    playAgainBtn.innerHTML = "🎵 Starting New Game..."
    playAgainBtn.disabled = true

    setTimeout(() => {
      window.location.href = "game.html"
    }, 1000)
  }

  goHome() {
    window.location.href = "index.html"
  }

  shareResult() {
    const shareText = `🎵 I just played Antakshari with AI! 
${this.gameResult.playerName}: ${this.gameResult.playerScore} vs AI: ${this.gameResult.aiScore}
${
  this.gameResult.winner === "player"
    ? "I won! 🏆"
    : this.gameResult.winner === "ai"
      ? "AI won this time 🤖"
      : "It was a tie! 🤝"
}
Total songs played: ${this.gameResult.totalSongs}
Game duration: ${this.formatDuration(this.gameResult.gameDuration)}`

    if (navigator.share) {
      navigator
        .share({
          title: "Antakshari with AI - Game Result",
          text: shareText,
          url: window.location.origin,
        })
        .catch(console.error)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          this.showToast("Result copied to clipboard!", "success")
        })
        .catch(() => {
          this.showToast("Unable to share result", "error")
        })
    }
  }

  showToast(message, type = "info") {
    // Create toast element if it doesn't exist
    let toast = document.getElementById("toast")
    if (!toast) {
      toast = document.createElement("div")
      toast.id = "toast"
      toast.className = "toast"
      document.body.appendChild(toast)
    }

    toast.textContent = message
    toast.className = `toast show ${type}`

    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }
}

// Initialize result page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AntakshariResult()
})


