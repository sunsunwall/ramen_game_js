const express = require('express');
const cors = require('cors');
const path = require('path');
const { initStorage, saveScore, getHighscores } = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize storage on startup
initStorage();

// API Endpoints
app.get('/api/highscores', async (req, res) => {
  try {
    const scores = await getHighscores();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch highscores.' });
  }
});

app.post('/api/highscores', async (req, res) => {
  const { username, score } = req.body;
  if (!username || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid input.' });
  }
  try {
    await saveScore(username, score);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score.' });
  }
});

app.listen(PORT, () => {
  console.log(`Ramen Cooking Game server running at http://localhost:${PORT}`);
});

