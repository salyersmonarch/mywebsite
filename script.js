// === INITIAL DATA ===

const ranks = [
  "Mizunoto", "Mizunoe", "Kanoto", "Kanoe", "Tsuchinoto",
  "Tsuchinoe", "Hinoto", "Hinoe", "Kinoto", "Kinoe"
];

const tasks = ["pushups", "situps", "squats", "crunches", "run"];

const quotes = [
  { name: "Tanjiro", quote: "Keep moving forward, even when you're hurting." },
  { name: "Rengoku", quote: "Set your heart ablaze." },
  { name: "Kanao", quote: "It's your heart. So listen to what it says." }
];

// === LOAD FROM LOCALSTORAGE OR SET DEFAULTS ===

let stats = JSON.parse(localStorage.getItem("slayerStats")) || {
  strength: 30,
  speed: 30,
  voice: 30,
  skin: 30
};

let exp = parseInt(localStorage.getItem("slayerExp")) || 0;
let health = parseInt(localStorage.getItem("slayerHealth")) || 100;
let rankIndex = parseInt(localStorage.getItem("slayerRankIndex")) || 0;
let gold = parseInt(localStorage.getItem("slayerGold")) || 100;
let inventory = JSON.parse(localStorage.getItem("slayerInventory")) || ["Nichirin Blade", "Healing Herb"];

// === ELEMENTS ===

const strengthElem = document.getElementById("strength");
const speedElem = document.getElementById("speed");
const voiceElem = document.getElementById("voice");
const skinElem = document.getElementById("skin");
const rankElem = document.getElementById("rank");
const expFill = document.getElementById("expFill");
const healthFill = document.getElementById("healthFill");
const quoteElem = document.getElementById("motivationQuote");
const inventoryList = document.getElementById("inventoryList");
const goldDisplay = document.getElementById("goldAmount");

const levelUpBtn = document.getElementById("levelUpBtn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const toggleInventory = document.getElementById("toggleInventory");
const toggleShop = document.getElementById("toggleShop");
const inventoryPanel = document.getElementById("inventoryPanel");
const shopPanel = document.getElementById("shopPanel");

// === INIT LOADERS ===

function updateStats() {
  strengthElem.textContent = stats.strength;
  speedElem.textContent = stats.speed;
  voiceElem.textContent = stats.voice;
  skinElem.textContent = stats.skin;
  expFill.style.width = `${exp}%`;
  healthFill.style.width = `${health}%`;
  rankElem.textContent = `Rank: ${ranks[rankIndex]}`;
  goldDisplay.textContent = gold;
  updateInventory();
}

function updateInventory() {
  inventoryList.innerHTML = "";
  inventory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

function saveAll() {
  localStorage.setItem("slayerStats", JSON.stringify(stats));
  localStorage.setItem("slayerExp", exp);
  localStorage.setItem("slayerHealth", health);
  localStorage.setItem("slayerRankIndex", rankIndex);
  localStorage.setItem("slayerGold", gold);
  localStorage.setItem("slayerInventory", JSON.stringify(inventory));
}

// === QUOTES ===

function loadQuote() {
  const today = new Date().toDateString();
  const last = localStorage.getItem("quoteDate");

  if (last === today) {
    quoteElem.textContent = localStorage.getItem("quoteText");
    return;
  }

  const pick = quotes[Math.floor(Math.random() * quotes.length)];
  const final = `“${pick.quote}” — ${pick.name}`;
  quoteElem.textContent = final;
  localStorage.setItem("quoteDate", today);
  localStorage.setItem("quoteText", final);
}

// === TASKS ===

function loadTasks() {
  const today = new Date().toDateString();
  const taskData = JSON.parse(localStorage.getItem("dailyTasks")) || {};
  const savedDate = localStorage.getItem("taskDate");

  tasks.forEach(task => {
    const checkbox = document.querySelector(`input[data-task="${task}"]`);
    checkbox.checked = savedDate === today && taskData[task];
  });
}

function completeDailyTasks() {
  const today = new Date().toDateString();
  const completedTasks = {};
  tasks.forEach(task => {
    const checkbox = document.querySelector(`input[data-task="${task}"]`);
    checkbox.checked = true;
    completedTasks[task] = true;
  });
  localStorage.setItem("dailyTasks", JSON.stringify(completedTasks));
  localStorage.setItem("taskDate", today);
}

// === LEVEL UP ===

levelUpBtn.addEventListener("click", () => {
  const today = new Date().toDateString();
  const now = Date.now();
  const lastLevelUp = localStorage.getItem("lastLevelUp");
  const lastRankUp = localStorage.getItem("lastRankUp");

  if (lastLevelUp === today) {
    alert("🔥 You already leveled up today!");
    return;
  }

  stats.strength += 10;
  stats.speed += 5;
  stats.voice += 5;
  stats.skin += 3;
  exp += 20;
  if (exp > 100) exp = 100;
  health += 10;
  if (health > 100) health = 100;

  // Rank Up every 7 days
  if (!lastRankUp || now - parseInt(lastRankUp) > 7 * 24 * 60 * 60 * 1000) {
    if (rankIndex < ranks.length - 1) {
      rankIndex++;
      localStorage.setItem("lastRankUp", now.toString());
      alert(`⚔️ Rank Up! You are now ${ranks[rankIndex]}!`);
    }
  }
  completeDailyTasks();
updateStats();
saveAll();
localStorage.setItem("lastLevelUp", today);

// 🔥 HINOKAMI BREATHING
const flameAura = document.getElementById("flameAura");
flameAura.classList.add("active");
setTimeout(() => {
  flameAura.classList.remove("active");
}, 4000); // 4 seconds of flame aura

  localStorage.setItem("lastLevelUp", today);
});

// === SHOP ===

function buyItem(itemName, cost) {
  if (gold >= cost) {
    gold -= cost;
    inventory.push(itemName);
    alert(`🛒 You bought ${itemName}`);
    updateStats();
    saveAll();
  } else {
    alert("❌ Not enough gold!");
  }
}

// === TOGGLES ===

musicToggle.addEventListener("click", () => {
  bgMusic.paused ? bgMusic.play() : bgMusic.pause();
});

toggleInventory.addEventListener("click", () => {
  inventoryPanel.classList.toggle("hidden");
});

toggleShop.addEventListener("click", () => {
  shopPanel.classList.toggle("hidden");
});

// === INIT ===

updateStats();
loadQuote();
loadTasks();
