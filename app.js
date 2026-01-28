const API_URL = "https://api.metals.live/v1/spot";
const USD_TO_EUR = 0.92;

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

async function fetchRealPrices() {
  const res = await fetch(API_URL);
  const data = await res.json();

  return {
    gold: data.gold * USD_TO_EUR,
    silver: data.silver * USD_TO_EUR
  };
}

async function savePortfolio() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  await db.collection("users")
    .doc(user.uid)
    .collection("portfolio")
    .doc("current")
    .set({
      goldQty: +goldQty.value || 0,
      silverQty: +silverQty.value || 0
    });
}

async function loadPortfolio() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const doc = await db.collection("users")
    .doc(user.uid)
    .collection("portfolio")
    .doc("current")
    .get();

  if (doc.exists) {
    goldQty.value = doc.data().goldQty || 0;
    silverQty.value = doc.data().silverQty || 0;
  }
}

async function saveDailyHistory(prices) {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const goldValue = prices.gold * (+goldQty.value || 0);
  const silverValue = prices.silver * (+silverQty.value || 0);
  const total = goldValue + silverValue;

  totalValue.innerText = total.toFixed(2);

  await db.collection("users")
    .doc(user.uid)
    .collection("history")
    .doc(todayKey())
    .set({
      gold: goldValue,
      silver: silverValue,
      total,
      timestamp: Date.now()
    });
}

async function loadHistory() {
  const user = firebase.auth().currentUser;
  if (!user) return [];

  const snap = await db.collection("users")
    .doc(user.uid)
    .collection("history")
    .orderBy("timestamp")
    .get();

  return snap.docs.map(d => ({ date: d.id, ...d.data() }));
}

["goldQty", "silverQty"].forEach(id => {
  document.getElementById(id).addEventListener("input", savePortfolio);
});

firebase.auth().onAuthStateChanged(async user => {
  if (!user) return;

  await loadPortfolio();
  const prices = await fetchRealPrices();
  await saveDailyHistory(prices);

  const history = await loadHistory();
  updatePortfolioChart(history);
});
