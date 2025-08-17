const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'highscores.json');

function initStorage() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { scores: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
}

function saveScore(username, score) {
  return new Promise((resolve, reject) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
      if (err) return reject(err);
      let db;
      try {
        db = JSON.parse(data);
      } catch (e) {
        db = { scores: [] };
      }
      const newScore = {
        id: Date.now(),
        username: username.trim().slice(0, 20),
        score,
        date: new Date().toISOString()
      };
      db.scores.push(newScore);
      db.scores.sort((a, b) => b.score - a.score);
      db.scores = db.scores.slice(0, 10);
      fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

function getHighscores() {
  return new Promise((resolve, reject) => {
    fs.readFile(DB_PATH, 'utf8', (err, data) => {
      if (err) return reject(err);
      let db;
      try {
        db = JSON.parse(data);
      } catch (e) {
        db = { scores: [] };
      }
      resolve(db.scores);
    });
  });
}

module.exports = { initStorage, saveScore, getHighscores };
