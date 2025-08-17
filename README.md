# 🍜 Ramen Cooking Game

A web-based ramen cooking game with highscores and leaderboard. Built with Node.js, Express, and pure JS frontend. WSL and VS Code compatible (no native modules).

## Setup Instructions

```bash
npm install
npm start
# Game available at http://localhost:3000
```

## How to Play
1. Enter your username and start the game.
2. Each round, a random ramen order appears (broth, noodle, 2-3 toppings).
3. Select ingredients to build your bowl and submit the order.
4. Score points for correct ingredients and complete orders. Time bonus applies.
5. Try to get the highest score in 60 seconds!
6. View highscores and play again.

## API Documentation

### GET /api/highscores
Returns top 10 highscores.

### POST /api/highscores
Save a new score.
- Body: `{ username: string, score: number }`

## Technology Stack
- Node.js + Express (backend)
- JSON file storage (WSL-friendly)
- HTML, CSS, JavaScript (frontend)

## WSL + VS Code Compatibility
- No native modules (sqlite3, node-gyp, etc.)
- Pure JavaScript dependencies only
- JSON file storage for highscores

## License
MIT
