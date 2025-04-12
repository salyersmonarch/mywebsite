// === INITIAL DATA ===
const ranks = [
  "Mizunoto", "Mizunoe", "Kanoto", "Kanoe", "Tsuchinoto",
  "Tsuchinoe", "Hinoto", "Hinoe", "Kinoto", "Kinoe"
];

const tasks = ["pushups", "situps", "squats", "crunches", "run"];

const baseTaskValues = {
  pushups: 20,
  situps: 20,
  squats: 20,
  crunches: 20,
  run: 2 // km
};

const quotes = [
  { name: "Tanjiro", quote: "Keep moving forward, even when you're hurting." },
  { name: "Rengoku", quote: "Set your heart ablaze." },
  { name: "Kanao", quote: "It's your heart. So listen to what it says." }
];

// === LOCAL STORAGE LOAD ===
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
let slayerStart = parseInt(localStorage.getItem("slayerStart")) || Date.now();
let streak = parseInt(localStorage.getItem("slayerStreak")) || 0;
let lastLogin = localStorage.getItem("lastLoginDate") || "";

localStorage.setItem("slayerStart", slayerStart);

// === DOM ELEMENTS ===
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
const flameAura = document.getElementById("flameAura");

// === STATS & UI ===
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
// === UPDATE DAILY TASK LABELS BASED ON RANK ===
const baseTasks = {
  pushups: 20,
  situps: 30,
  squats: 50,
  crunches: 40,
  run: 10
};

// For every rank level up, increase task count by 30%
const multiplier = 1 + rankIndex * 0.3;

document.getElementById("label-pushups").textContent = Math.round(baseTasks.pushups * multiplier);
document.getElementById("label-situps").textContent = Math.round(baseTasks.situps * multiplier);
document.getElementById("label-squats").textContent = Math.round(baseTasks.squats * multiplier);
document.getElementById("label-crunches").textContent = Math.round(baseTasks.crunches * multiplier);
document.getElementById("label-run").textContent = Math.round(baseTasks.run * multiplier);

function saveAll() {
  localStorage.setItem("slayerStats", JSON.stringify(stats));
  localStorage.setItem("slayerExp", exp);
  localStorage.setItem("slayerHealth", health);
  localStorage.setItem("slayerRankIndex", rankIndex);
  localStorage.setItem("slayerGold", gold);
  localStorage.setItem("slayerInventory", JSON.stringify(inventory));
  localStorage.setItem("slayerStart", slayerStart);
  showSaveToast();
}
function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000);
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
function getTaskAmount(task) {
  const base = baseTaskValues[task] || 10;
  if (task === "run") return base + rankIndex;
  return base + (rankIndex * 30);
}

function updateTaskDisplay() {
  tasks.forEach(task => {
    const label = document.querySelector(`#label-${task}`);
    if (label) {
      const amount = getTaskAmount(task);
      label.textContent = task === "run" ? `${amount} KM` : `${amount}`;
    }
  });
}

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

  if (lastLevelUp === today) {
    alert("🔥 You already leveled up today!");
    return;
    updateStreakDisplay(); // after updateStats()

  }

  stats.strength += 10;
  stats.speed += 5;
  stats.voice += 5;
  stats.skin += 3;
  exp += 20;
  if (exp > 100) exp = 100;
  health += 10;
  if (health > 100) health = 100;

  // ⏳ Rank up after 8 + 8 + 8 days
  const daysSinceStart = Math.floor((now - slayerStart) / 86400000);
  const requiredDays = (rankIndex + 1) * 8;

  if (daysSinceStart >= requiredDays && rankIndex < ranks.length - 1) {
    rankIndex++;
    showPopup(`⚔️ Rank Up! You are now ${ranks[rankIndex]}!`);
    showPopup("✅ Daily Tasks Completed!");

  }

  completeDailyTasks();
  updateStats();
  updateTaskDisplay();
  saveAll();
  localStorage.setItem("lastLevelUp", today);

  flameAura.classList.add("active");
  setTimeout(() => flameAura.classList.remove("active"), 4000);
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

// === UI TOGGLES ===
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
updateTaskDisplay();

function showSaveToast() {
  const toast = document.getElementById("saveToast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
const backgrounds = [
  "url('images/bg1.jpg')",
  "url('images/bg2.jpg')",
  "url('images/bg3.jpg')"
];

let currentBgIndex = 0;

document.getElementById("changeBgBtn").addEventListener("click", () => {
  currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
  document.body.style.backgroundImage = backgrounds[currentBgIndex];
});
function updateStreakDisplay() {
  document.getElementById("streakCount").textContent = streak;
}

// ⏱️ Check streak on load
const today = new Date().toDateString();
if (lastLogin && lastLogin !== today) {
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastLogin === yesterday) {
    streak++;
  } else {
    streak = 1; // missed a day, reset streak
  }
}
localStorage.setItem("slayerStreak", streak);
localStorage.setItem("lastLoginDate", today);
updateStreakDisplay();
const leaderboardData = JSON.parse(localStorage.getItem("slayerLeaderboard")) || [];

function saveToLeaderboard() {
  const today = new Date().toLocaleDateString();
  leaderboardData.push({
    date: today,
    exp: exp,
    rank: ranks[rankIndex]
  });
  leaderboardData.sort((a, b) => b.exp - a.exp);
  if (leaderboardData.length > 5) leaderboardData.length = 5;
  localStorage.setItem("slayerLeaderboard", JSON.stringify(leaderboardData));
}

function displayLeaderboard() {
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  leaderboardData.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${entry.rank} — ${entry.exp} EXP (${entry.date})`;
    list.appendChild(li);
  });
}

document.getElementById("toggleLeaderboard").addEventListener("click", () => {
  document.getElementById("leaderboardPanel").classList.toggle("hidden");
  displayLeaderboard();
});

// Save to leaderboard every level up
levelUpBtn.addEventListener("click", () => {
  // ... your existing level-up code
  saveToLeaderboard();
});
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html"; // if not signed in, go back to login
  }
});
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    firebase.database().ref("users/" + user.uid).once("value")
      .then(snapshot => {
        const style = snapshot.val().breathing;
        document.getElementById("profileStyle").textContent = style;
      });
  }
});

