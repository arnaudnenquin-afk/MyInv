const USD_TO_EUR = 0.92; // fallback si conversion manquante

// DOM elements
const goldQty = document.getElementById("goldQty");
const silverQty = document.getElementById("silverQty");
const totalValue = document.getElementById("totalValue");
const goldRateSpan = document.getElementById("goldRate");
const silverRateSpan = document.getElementById("silverRate");

// Ta clé MetalpriceAPI
const API_KEY = "bab0d9b3e373a823cba61599e7ca2b61";

// -------------------------------------------
// FONCTION QUI RÉCUPÈRE LES PRIX EN DIRECT
// -------------------------------------------
async function fetchRealPrices() {
  const url = `https://api.metalpriceapi.com/v1/latest?base=USD&symbols=USDXAU,USDXAG,USDEUR&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const goldUSD = data.rates["USDXAU"] || 0;
    const silverUSD = data.rates["USDXAG"] || 0;
    const usdToEur = data.rates["USDEUR"] || USD_TO_EUR;

    return {
      gold: goldUSD * usdToEur,
      silver: silverUSD * usdToEur
    };
  } catch (err) {
    console.error("Erreur récupération des prix :", err);
    return { gold: 0, silver: 0 };
  }
}

// -------------------------------------------
// AFFICHAGE DES PRIX
// -------------------------------------------
function displayPrices(prices) {
  goldRateSpan.innerText = prices.gold.toFixed(2);
  silverRateSpan.innerText = prices.silver.toFixed(2);
}

// -------------------------------------------
// CALCUL VALEUR TOTALE
// -------------------------------------------
function updateTotal(prices) {
  const goldValue = prices.gold * (+goldQty.value || 0);
  const silverValue = prices.silver * (+silverQty.value || 0);
  const total = goldValue + silverValue;
  totalValue.innerText = total.toFixed(2);
  return { goldValue, silverValue, total };
}

// -------------------------------------------
// SAUVEGARDE DU PORTEFEUILLE FIRESTORE
// -------------------------------------------
async function savePortfolio() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  await db.collection("users").doc(user.uid)
    .collection("portfolio").doc("current")
    .set({
      goldQty: +goldQty.value || 0,
      silverQty: +silverQty.value || 0
    });
}

// -------------------------------------------
// SAUVEGARDE JOURNALIÈRE
// -------------------------------------------
async function saveDailyHistory(prices) {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const { goldValue, silverValue, total } = updateTotal(prices);
  const today = new Date().toISOString().split("T")[0];

  await db.collection("users").doc(user.uid)
    .collection("history").doc(today)
    .set({
      gold: goldValue,
      silver: silverValue,
      total,
      timestamp: Date.now()
    });
}

// -------------------------------------------
// CHARGEMENT DU PORTEFEUILLE
// -------------------------------------------
async function loadPortfolio() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const doc = await db.collection("users").doc(user.uid)
    .collection("portfolio").doc("current")
    .get();

  if (doc.exists) {
    goldQty.value = doc.data().goldQty || 0;
    silverQty.value = doc.data().silverQty || 0;
  }
}

// -------------------------------------------
// CHARGEMENT DE L’HISTORIQUE
// -------------------------------------------
async function loadHistory() {
  const user = firebase.auth().currentUser;
  if (!user) return [];

  const snap = await db.collection("users").doc(user.uid)
    .collection("history").orderBy("timestamp").get();

  return snap.docs.map(d => ({ date: d.id, ...d.data() }));
}

// -------------------------------------------
// RAFRAÎCHIR PORTFOLIO & GRAPHIQUE
// -------------------------------------------
async function refreshPortfolio() {
  const prices = await fetchRealPrices();
  displayPrices(prices);
  await saveDailyHistory(prices);
  const history = await loadHistory();
  updatePortfolioChart(history);
}

// -------------------------------------------
// RAFRAÎCHISSEMENT AUTOMATIQUE TOUS LES 5 MINUTES
// -------------------------------------------
function startAutoRefresh() {
  setInterval(refreshPortfolio, 300000); // 5 min
}

// -------------------------------------------
// MISE À JOUR INSTANTANÉE À LA SAISIE
// -------------------------------------------
[goldQty, silverQty].forEach(input => {
  input.addEventListener("input", async () => {
    const prices = await fetchRealPrices();
    displayPrices(prices);
    updateTotal(prices);
    await savePortfolio();
  });
});

// -------------------------------------------
// INITIALISATION APRÈS CONNEXION
// -------------------------------------------
firebase.auth().onAuthStateChanged(async user => {
  if (!user) return;

  await loadPortfolio();
  await refreshPortfolio();
  startAutoRefresh();
});
