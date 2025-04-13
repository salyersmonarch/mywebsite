// === INITIAL DATA ===
const ranks = ["Mizunoto", "Mizunoe", "Kanoto", "Kanoe", "Tsuchinoto", "Tsuchinoe", "Hinoto", "Hinoe", "Kinoto", "Kinoe"];
const tasks = ["pushups", "situps", "squats", "crunches", "run"];
const baseTaskValues = { pushups: 20, situps: 20, squats: 20, crunches: 20, run: 2 };
const backgrounds = ["url('images/bg1.jpg')", "url('images/bg2.jpg')", "url('images/bg3.jpg')"];
let currentBgIndex = 0;

// === STORAGE ===
let stats = JSON.parse(localStorage.getItem("slayerStats")) || { strength: 30, speed: 30, voice: 30, skin: 30 };
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
const flameAura = document.getElementById("flameAura");

// === UI BUTTONS ===
document.getElementById("musicToggle").addEventListener("click", () => {
  bgMusic.paused ? bgMusic.play() : bgMusic.pause();
});

document.getElementById("toggleInventory").addEventListener("click", () => {
  document.getElementById("inventoryPanel").classList.toggle("hidden");
});

document.getElementById("toggleShop").addEventListener("click", () => {
  document.getElementById("shopPanel").classList.toggle("hidden");
});

document.getElementById("changeBgBtn").addEventListener("click", () => {
  currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
  document.body.style.backgroundImage = backgrounds[currentBgIndex];
});

document.getElementById("logOutBtn").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  });
});

document.getElementById("toggleLeaderboard").addEventListener("click", () => {
  document.getElementById("leaderboardPanel").classList.toggle("hidden");
  displayLeaderboard();
});

// === STATS & RANK ===
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

function updateRankProgress() {
  const daysPassed = Math.floor((Date.now() - slayerStart) / 86400000);
  const requiredDays = (rankIndex + 1) * 8;
  const percent = Math.min((daysPassed / requiredDays) * 100, 100);
  const fill = document.getElementById("rankProgressFill");
  const text = document.getElementById("rankProgressText");
  if (fill && text) {
    fill.style.width = `${percent}%`;
    text.textContent = `${Math.min(daysPassed, requiredDays)} / ${requiredDays} Days`;
  }
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

function getTaskAmount(task) {
  const base = baseTaskValues[task] || 10;
  return task === "run" ? base + rankIndex : base + rankIndex * 30;
}

function loadQuote() {
  const today = new Date().toDateString();
  const last = localStorage.getItem("quoteDate");
  if (last === today) {
    quoteElem.textContent = localStorage.getItem("quoteText");
    return;
  }
  const picks = [
    { name: "Tanjiro", quote: "Keep moving forward, even when you're hurting." },
    { name: "Rengoku", quote: "Set your heart ablaze." },
    { name: "Zenitsu", quote: "When you’re in pain, you should say it out loud!" },
    { name: "Kanao", quote: "It's your heart. So listen to what it says." }
  ];
  const pick = picks[Math.floor(Math.random() * picks.length)];
  const final = `“${pick.quote}” — ${pick.name}`;
  quoteElem.textContent = final;
  localStorage.setItem("quoteDate", today);
  localStorage.setItem("quoteText", final);
}

function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 3000);
}

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

function showSaveToast() {
  const toast = document.getElementById("saveToast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// === LEVEL UP ===
levelUpBtn.addEventListener("click", () => {
  const today = new Date().toDateString();
  const now = Date.now();
  const lastLevelUp = localStorage.getItem("lastLevelUp");

  if (lastLevelUp === today) return alert("🔥 You already leveled up today!");

  stats.strength += 10;
  stats.speed += 5;
  stats.voice += 5;
  stats.skin += 3;
  exp = Math.min(exp + 20, 100);
  health = Math.min(health + 10, 100);

  const daysSinceStart = Math.floor((now - slayerStart) / 86400000);
  const requiredDays = (rankIndex + 1) * 8;
  if (daysSinceStart >= requiredDays && rankIndex < ranks.length - 1) {
    rankIndex++;
    showPopup(`⚔️ Rank Up! You are now ${ranks[rankIndex]}!`);
    showPopup("✅ Daily Tasks Completed!");
  }

  completeDailyTasks();
  updateStats();
  loadQuote();
  updateRankProgress();
  updateTaskDisplay();
  saveAll();
  localStorage.setItem("lastLevelUp", today);
  saveToLeaderboard();

  flameAura.classList.add("active");
  setTimeout(() => flameAura.classList.remove("active"), 4000);
});

// === TASK SYSTEM ===
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

function loadTasks() {
  const today = new Date().toDateString();
  const taskData = JSON.parse(localStorage.getItem("dailyTasks")) || {};
  const savedDate = localStorage.getItem("taskDate");
  tasks.forEach(task => {
    const checkbox = document.querySelector(`input[data-task="${task}"]`);
    checkbox.checked = savedDate === today && taskData[task];
  });
}

// === STREAK TRACKER ===
function updateStreakDisplay() {
  document.getElementById("streakCount").textContent = streak;
}
const today = new Date().toDateString();
if (lastLogin && lastLogin !== today) {
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  streak = lastLogin === yesterday ? streak + 1 : 1;
}
localStorage.setItem("slayerStreak", streak);
localStorage.setItem("lastLoginDate", today);
updateStreakDisplay();

// === LEADERBOARD ===
const leaderboardData = JSON.parse(localStorage.getItem("slayerLeaderboard")) || [];
function saveToLeaderboard() {
  const today = new Date().toLocaleDateString();
  leaderboardData.push({ date: today, exp, rank: ranks[rankIndex] });
  leaderboardData.sort((a, b) => b.exp - a.exp);
  leaderboardData.length = Math.min(5, leaderboardData.length);
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

// === FIREBASE CHECK ===
firebase.auth().onAuthStateChanged((user) => {
  if (!user) window.location.href = "login.html";
  else {
    firebase.database().ref("users/" + user.uid).once("value")
      .then(snapshot => {
        const style = snapshot.val().breathing;
        document.getElementById("profileStyle").textContent = style;
      });
  }
});

// === INITIAL LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  loadQuote();
  loadTasks();
  updateTaskDisplay();
  updateRankProgress();
});
document.addEventListener("DOMContentLoaded", () => {
  const changeBgBtn = document.getElementById("changeBgBtn");
  const body = document.body;

  const backgrounds = [
    "url('images/bg1.jpg')",
    "url('images/bg2.jpg')",
    "url('images/bg3.jpg')"
  ];

  let currentBgIndex = 0;

  if (changeBgBtn && body) {
    changeBgBtn.addEventListener("click", () => {
      currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
      body.style.backgroundImage = backgrounds[currentBgIndex];
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundAttachment = "fixed";
    });
  }

  // Just in case: Fix for other buttons
  const musicBtn = document.getElementById("musicToggle");
  const shopBtn = document.getElementById("toggleShop");
  const invBtn = document.getElementById("toggleInventory");

  if (musicBtn && document.getElementById("bgMusic")) {
    musicBtn.addEventListener("click", () => {
      const audio = document.getElementById("bgMusic");
      audio.paused ? audio.play() : audio.pause();
    });
  }

  if (shopBtn && document.getElementById("shopPanel")) {
    shopBtn.addEventListener("click", () => {
      document.getElementById("shopPanel").classList.toggle("hidden");
    });
  }

  if (invBtn && document.getElementById("inventoryPanel")) {
    invBtn.addEventListener("click", () => {
      document.getElementById("inventoryPanel").classList.toggle("hidden");
    });
  }
});