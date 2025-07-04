let accessToken = '';

// 1. Get Spotify token
async function getToken() {
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
  accessToken = data.access_token;
}

// 2. Handle Player Turn
async function handlePlayerTurn() {
  const input = document.getElementById('playerSong');
  const song = input.value.trim();

  if (!song) return alert("Please enter a song title");

  appendLog(`🧍 You: ${song}`);

  const lastChar = getLastUsefulChar(song);

  appendLog(`➡️ Last Letter: "${lastChar.toUpperCase()}"`);

  await aiRespond(lastChar);

  input.value = '';
}

// 3. AI Response
async function aiRespond(letter) {
  if (!accessToken) {
    await getToken();
  }

  const searchResult = await fetch(`https://api.spotify.com/v1/search?q=${letter}&type=track&limit=15`, {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });

  const data = await searchResult.json();
  const tracks = data.tracks.items;

  const validTracks = tracks.filter(track =>
    track.name.toLowerCase().startsWith(letter.toLowerCase())
  );

  if (validTracks.length === 0) {
    appendLog(`🤖 AI: I can't find a song with "${letter}" 😓 You win!`);
    return;
  }

  const aiSong = validTracks[Math.floor(Math.random() * validTracks.length)];
  appendLog(`🤖 AI: ${aiSong.name} by ${aiSong.artists[0].name}`);
}

// 4. Utility: Extract last usable letter
function getLastUsefulChar(songName) {
  const cleaned = songName.replace(/[^a-zA-Z]/g, '').toLowerCase();
  for (let i = cleaned.length - 1; i >= 0; i--) {
    const c = cleaned[i];
    if (c !== 'a' && c !== 'e' && c !== 'i' && c !== 'o' && c !== 'u') {
      return c;
    }
  }
  return cleaned[cleaned.length - 1]; // fallback
}

// 5. Append to Game Log
function appendLog(message) {
  const logBox = document.getElementById('gameLog');
  const entry = document.createElement('p');
  entry.textContent = message;
  logBox.appendChild(entry);
}
