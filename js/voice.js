
class VoiceManager {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.voiceCommands = {};
    this.currentLanguage = "en-US";

    this.init();
  }

  init() {
    this.setupSpeechRecognition();
    this.setupSpeechSynthesis();
    this.loadVoiceCommands();
    this.setupEventListeners();
  }

  setupSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in your browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.currentLanguage;
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log("Listening...");
    };

    this.recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase().trim();
      this.handleVoiceCommand(command);
    };

    this.recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log("Stopped listening.");
    };
  }

  setupSpeechSynthesis() {
    this.synthesis.onvoiceschanged = () => {
      this.voices = this.synthesis.getVoices();
    };
    this.voices = this.synthesis.getVoices();
  }

  speak(text) {
    if (!this.synthesis) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = this.currentLanguage;
    const voice = this.voices?.find((v) =>
      v.lang.startsWith(this.currentLanguage)
    );
    if (voice) utter.voice = voice;

    this.synthesis.cancel();
    this.synthesis.speak(utter);
  }

 loadVoiceCommands() {
  this.voiceCommands = {
    "start game": () => {
      this.speak("Starting the game...");
      document.getElementById("startBtn")?.click();
    },
    "how to play": () => {
      this.speak("Opening instructions...");
      document.getElementById("instructionsBtn")?.click();
    },
    "story mode": () => {
      this.speak("Switching to story mode...");
      document.getElementById("walkthroughBtn")?.click();
    },
    help: () => {
      this.speak(
        "You can say commands like start game, how to play, or story mode."
      );
    },
    "dark mode": () => {
      document.body.classList.add("dark");
      this.speak("Dark mode activated.");
    },
    "light mode": () => {
      document.body.classList.remove("dark");
      this.speak("Light mode activated.");
    },
  };
}


  handleVoiceCommand(command) {
    console.log("Voice command received:", command);

    if (this.voiceCommands[command]) {
      this.voiceCommands[command]();
      return;
    }

    for (const [key, action] of Object.entries(this.voiceCommands)) {
      if (command.includes(key)) {
        action();
        return;
      }
    }

    const input = document.getElementById("playerName");
    if (input && document.activeElement === input) {
      input.value = command;
      input.dispatchEvent(new Event("input"));
      this.speak(`Name entered: ${command}`);
      return;
    }

    this.speak("Sorry, I did not understand that command.");
  }

  startListening() {
    if (!this.recognition) return;
    this.recognition.start();
  }

  setupEventListeners() {
    const micBtn = document.getElementById("voiceToggle");
    if (micBtn) {
      micBtn.addEventListener("click", () => this.startListening());
    }
  }
}

window.voiceManager = new VoiceManager();






class Narrator {
  constructor(options = {}) {
    this.synthesis = window.speechSynthesis;
    this.isNarrating = false;
    this.language = this.detectLanguage();
    this.contentSelector = options.contentSelector || '.main-content'; // default: narrate main content
    this.toggleBtn = document.getElementById('narratorToggle');
    this.lastUtterance = null;
    this.init();
  }

  init() {
    if (!this.toggleBtn || !this.synthesis) return;

    this.toggleBtn.addEventListener('click', () => this.toggleNarrator());

    // Listen for Google Translate language changes
    this.observeLanguageChange();

    // Optional: Narrate on page load (if desired)
    // this.startNarration();
  }

  detectLanguage() {
    // Google Translate sets <html lang="xx"> or window.googleTranslateElementInit
    const htmlLang = document.documentElement.lang || 'en';
    // If Google Translate sets a cookie or global, you can read from there
    // Otherwise, fallback to html lang or navigator.language
    return htmlLang || navigator.language || 'en';
  }

  observeLanguageChange() {
    // Observe <html lang="xx"> changes (Google Translate updates this)
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      this.language = this.detectLanguage();
      if (this.isNarrating) {
        this.stopNarration();
        setTimeout(() => this.startNarration(), 300); // restart in new language
      }
    });
    observer.observe(html, { attributes: true, attributeFilter: ['lang'] });
  }

  getContentToNarrate() {
    // You can customize this to narrate any part of your page
    const el = document.querySelector(this.contentSelector);
    if (!el) return '';
    // Remove scripts, buttons, etc. if needed
    return el.innerText.trim();
  }

  startNarration() {
    if (this.isNarrating) return;
    const text = this.getContentToNarrate();
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = this.language;

    // Try to choose a voice matching the current language
    const voices = this.synthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(this.language));
    if (matchingVoice) utter.voice = matchingVoice;

    utter.onend = () => {
      this.isNarrating = false;
      this.updateButtonState();
    };

    this.synthesis.cancel(); // stop any previous
    this.synthesis.speak(utter);
    this.isNarrating = true;
    this.lastUtterance = utter;
    this.updateButtonState();
  }

  stopNarration() {
    if (!this.isNarrating) return;
    this.synthesis.cancel();
    this.isNarrating = false;
    this.updateButtonState();
  }

  toggleNarrator() {
    if (this.isNarrating) {
      this.stopNarration();
    } else {
      this.startNarration();
    }
  }

  updateButtonState() {
    if (this.isNarrating) {
      this.toggleBtn.classList.add('active');
      this.toggleBtn.title = 'Stop Narration';
    } else {
      this.toggleBtn.classList.remove('active');
      this.toggleBtn.title = 'Start Narration';
    }
  }
}

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // You can pass a different selector if you want to narrate something else
  new Narrator({ contentSelector: '.main-content' });
});

