// ================= CONFIG =================
const API_URL = "https://api.metals.live/v1/spot";
const USD_TO_EUR = 0.92;
const REFRESH_INTERVAL = 10 * 60 * 1000;

// ================= NAVIGATION =================
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
}

document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});

// ================= STORAGE =================
function saveData() {
  ["goldRate", "goldQty", "silverRate", "silverQty"].forEach(id => {
    localStorage.setItem(id, document.getElementById(id).value);
  });
}

function loadData() {
  ["goldRate", "goldQty", "silverRate", "silverQty"].forEach(id => {
    document.getElementById(id).value = localStorage.getItem(id) || "";
  });
  updateGold();
  updateSilver();
}

// ================= CALCULS =================
function updateGold() {
  const rate = +goldRate.value || 0;
  const qty = +goldQty.value || 0;
  const value = rate * qty;

  goldValue.innerText = value.toFixed(2);
  updateChart(goldChart, value);
}

function updateSilver() {
  const rate = +silverRate.value || 0;
  const qty = +silverQty.value || 0;
  const value = rate * qty;

  silverValue.innerText = value.toFixed(2);
  updateChart(silverChart, value);
}

// ================= API PRIX RÉEL =================
async function fetchRealPrices() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const goldEUR = (data.gold * USD_TO_EUR).toFixed(2);
    const silverEUR = (data.silver * USD_TO_EUR).toFixed(2);

    goldRate.value = goldEUR;
    silverRate.value = silverEUR;

    localStorage.setItem("goldRate", goldEUR);
    localStorage.setItem("silverRate", silverEUR);

    goldSource.innerText = `API metals.live • ${new Date().toLocaleTimeString()}`;
    silverSource.innerText = `API metals.live • ${new Date().toLocaleTimeString()}`;

    updateGold();
    updateSilver();
  } catch (e) {
    goldSource.innerText = "Valeur manuelle";
    silverSource.innerText = "Valeur manuelle";
  }
}

// ================= EVENTS =================
["goldRate", "goldQty"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    saveData();
    goldSource.innerText = "Valeur manuelle";
    updateGold();
  });
});

["silverRate", "silverQty"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    saveData();
    silverSource.innerText = "Valeur manuelle";
    updateSilver();
  });
});

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  fetchRealPrices();
  setInterval(fetchRealPrices, REFRESH_INTERVAL);
});
