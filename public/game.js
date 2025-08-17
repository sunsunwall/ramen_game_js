// Ramen Cooking Game Logic
const BROTHS = ['Shoyu', 'Miso', 'Tonkotsu', 'Shio'];
const NOODLES = ['Thin', 'Thick', 'Wavy'];
const TOPPINGS = ['Chashu', 'Egg', 'Nori', 'Green Onions', 'Corn', 'Bamboo Shoots'];

let username = '';
let score = 0;
let timer = 60;
let timerInterval = null;
let currentOrder = null;
let currentBowl = {
  broth: null,
  noodle: null,
  toppings: []
};
let gameActive = false;

// DOM Elements
const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');
const gameSection = document.getElementById('game-section');
const orderDetails = document.getElementById('order-details');
const bowlVisual = document.getElementById('bowl-visual');
const resetBowlBtn = document.getElementById('reset-bowl');
const submitOrderBtn = document.getElementById('submit-order');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const highscoreModal = document.getElementById('highscore-modal');
const highscoreList = document.getElementById('highscore-list');
const playAgainBtn = document.getElementById('play-again');
const brothButtons = document.getElementById('broth-buttons');
const noodleButtons = document.getElementById('noodle-buttons');
const toppingButtons = document.getElementById('topping-buttons');

function show(element) { element.classList.remove('hidden'); }
function hide(element) { element.classList.add('hidden'); }

function resetGameState() {
  score = 0;
  timer = 60;
  currentOrder = null;
  currentBowl = { broth: null, noodle: null, toppings: [] };
  gameActive = false;
  scoreDisplay.textContent = 'Score: 0';
  timerDisplay.textContent = 'Time: 60';
  bowlVisual.innerHTML = '';
  orderDetails.innerHTML = '';
}

function startGame() {
  username = usernameInput.value.trim().slice(0, 20);
  if (!username) {
    alert('Please enter a username.');
    return;
  }
  hide(document.getElementById('username-section'));
  show(gameSection);
  resetGameState();
  gameActive = true;
  generateOrder();
  updateBowlVisual();
  startTimer();
}

function startTimer() {
  timerDisplay.textContent = `Time: ${timer}`;
  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `Time: ${timer}`;
    if (timer <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  submitScore();
  showHighscores();
}

function generateOrder() {
  const broth = BROTHS[Math.floor(Math.random() * BROTHS.length)];
  const noodle = NOODLES[Math.floor(Math.random() * NOODLES.length)];
  const toppingCount = Math.floor(Math.random() * 2) + 2; // 2-3 toppings
  const shuffledToppings = TOPPINGS.slice().sort(() => 0.5 - Math.random());
  const toppings = shuffledToppings.slice(0, toppingCount);
  currentOrder = { broth, noodle, toppings };
  renderOrder();
}

function renderOrder() {
  orderDetails.innerHTML = `
    <strong>Broth:</strong> ${currentOrder.broth}<br>
    <strong>Noodle:</strong> ${currentOrder.noodle}<br>
    <strong>Toppings:</strong> ${currentOrder.toppings.join(', ')}
  `;
}

function updateBowlVisual() {
  let html = '';
  if (currentBowl.broth) html += `<span class="bowl-item">🥣 ${currentBowl.broth}</span>`;
  if (currentBowl.noodle) html += `<span class="bowl-item">🍜 ${currentBowl.noodle}</span>`;
  currentBowl.toppings.forEach(t => {
    html += `<span class="bowl-item">${getToppingEmoji(t)} ${t}</span>`;
  });
  bowlVisual.innerHTML = html;
}

function getToppingEmoji(topping) {
  switch (topping) {
    case 'Chashu': return '🥩';
    case 'Egg': return '🥚';
    case 'Nori': return '🟩';
    case 'Green Onions': return '🧅';
    case 'Corn': return '🌽';
    case 'Bamboo Shoots': return '🎋';
    default: return '';
  }
}

function addIngredient(type, value) {
  if (!gameActive) return;
  if (type === 'broth') {
    currentBowl.broth = value;
  } else if (type === 'noodle') {
    currentBowl.noodle = value;
  } else if (type === 'topping') {
    if (!currentBowl.toppings.includes(value) && currentBowl.toppings.length < 5) {
      currentBowl.toppings.push(value);
    }
  }
  updateBowlVisual();
}

function resetBowl() {
  currentBowl = { broth: null, noodle: null, toppings: [] };
  updateBowlVisual();
}

function validateOrder() {
  let orderScore = 0;
  let correctIngredients = 0;
  let wrongIngredients = 0;
  // Broth
  if (currentBowl.broth === currentOrder.broth) {
    orderScore += 50;
    correctIngredients++;
  } else if (currentBowl.broth) {
    orderScore -= 25;
    wrongIngredients++;
  }
  // Noodle
  if (currentBowl.noodle === currentOrder.noodle) {
    orderScore += 50;
    correctIngredients++;
  } else if (currentBowl.noodle) {
    orderScore -= 25;
    wrongIngredients++;
  }
  // Toppings
  currentOrder.toppings.forEach(t => {
    if (currentBowl.toppings.includes(t)) {
      orderScore += 50;
      correctIngredients++;
    }
  });
  currentBowl.toppings.forEach(t => {
    if (!currentOrder.toppings.includes(t)) {
      orderScore -= 25;
      wrongIngredients++;
    }
  });
  // Complete order bonus
  if (
    currentBowl.broth === currentOrder.broth &&
    currentBowl.noodle === currentOrder.noodle &&
    currentOrder.toppings.every(t => currentBowl.toppings.includes(t)) &&
    currentBowl.toppings.length === currentOrder.toppings.length
  ) {
    orderScore += 100;
  }
  // Time bonus
  orderScore += timer * 10;
  return orderScore;
}

function submitOrder() {
  if (!gameActive) return;
  const orderScore = validateOrder();
  score += orderScore;
  scoreDisplay.textContent = `Score: ${score}`;
  // Next order
  resetBowl();
  generateOrder();
}

function submitScore() {
  fetch('/api/highscores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, score })
  }).catch(() => {});
}

function showHighscores() {
  fetch('/api/highscores')
    .then(res => res.json())
    .then(scores => {
      highscoreList.innerHTML = '';
      scores.forEach((s, i) => {
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${s.username} - ${s.score}`;
        highscoreList.appendChild(li);
      });
      show(highscoreModal);
    });
}

function playAgain() {
  hide(highscoreModal);
  show(document.getElementById('username-section'));
  hide(gameSection);
  usernameInput.value = '';
}

// Ingredient Buttons Setup
function setupIngredientButtons() {
  brothButtons.innerHTML = BROTHS.map(b => `<button class="ingredient-btn" data-type="broth" data-value="${b}">${b}</button>`).join('');
  noodleButtons.innerHTML = NOODLES.map(n => `<button class="ingredient-btn" data-type="noodle" data-value="${n}">${n}</button>`).join('');
  toppingButtons.innerHTML = TOPPINGS.map(t => `<button class="ingredient-btn" data-type="topping" data-value="${t}">${t}</button>`).join('');
}

// Event Listeners
startBtn.addEventListener('click', startGame);
resetBowlBtn.addEventListener('click', resetBowl);
submitOrderBtn.addEventListener('click', submitOrder);
playAgainBtn.addEventListener('click', playAgain);

[brothButtons, noodleButtons, toppingButtons].forEach(group => {
  group.addEventListener('click', e => {
    if (e.target.classList.contains('ingredient-btn')) {
      const type = e.target.getAttribute('data-type');
      const value = e.target.getAttribute('data-value');
      addIngredient(type, value);
    }
  });
});

setupIngredientButtons();
