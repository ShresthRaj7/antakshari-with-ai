# 🎵 Antakshari with AI

A fun turn-based music game where you play Antakshari against an AI powered by the Spotify API.

---

🚀 Features Implemented
🟢 Easy Level
🎨 Dark Mode Support
The game supports light/dark themes. The preference is saved using localStorage and applied across pages.

⏳ Custom Loading States
During Spotify API requests and AI thinking, a loading animation (e.g. dots / spinner) is displayed to show real-time feedback to the user.

💡 Creative Error Handling
If Spotify returns no matching songs, a fun popup informs the player (instead of crashing or freezing).

🟠 Medium Level
🌐 Multilingual UI Support
A dropdown lets users choose their UI language (e.g., English / Hindi). Labels, buttons, and helper text update dynamically.

🔴 Hard Level
🎙️ Voice Navigation & Accessibility
The game supports voice input using the Web Speech API, allowing users to speak their song name instead of typing.

🗣️ Text-to-Speech
AI replies and game prompts are also read out loud using the SpeechSynthesis API for a more interactive experience.

⚙️ Additional Features (Core Game)
📜 Game History Log
A dynamic list tracks and displays all songs played by both the player and AI.

⏰ Turn Timer
Each player gets 30 seconds. If no input is received, the game ends and shows the result screen automatically.

🧠 Spotify-Powered AI
The AI pulls real song suggestions using the Spotify API, matching the last letter of the previous song.

---

## 🔗 Live Demo

👉 [Live Hosted Link](https://68683d96d9eff3fb118ec8bf--antakshari-with-ai.netlify.app/)

---

## 📦 Tech Stack

- HTML, CSS, JavaScript
- Spotify Web API (Client Credentials Flow)
- Hosted on Netlify / GitHub Pages

---

## 🧠 Problem Statement

> Use a single public API to build the most creative application.

We chose to blend tradition with tech: recreating the nostalgic Indian game of Antakshari using real-time Spotify data.

---

## 📁 Setup Instructions (for devs)

1. Clone the repository  
2. Create a Spotify Developer account  
3. Replace `clientId` and `clientSecret` in `script.js`  
4. Run `index.html` locally

---

## 👨‍💻 Made By

- Shresth Raj  
- Shalini Singh  
- Harshada Agrawal  
(Team Name: Innovex)

---
