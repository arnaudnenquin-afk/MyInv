// Conversion USD → EUR approximative
const USD_TO_EUR = 0.92;

// Champs HTML
const goldQty = document.getElementById("goldQty");
const silverQty = document.getElementById("silverQty");
const totalValue = document.getElementById("totalValue");
const goldRateSpan = document.getElementById("goldRate");
const silverRateSpan = document.getElementById("silverRate");

// Fonction pour récupérer les prix gratuits
async function fetchRealPrices() {
  try {
    const res = await fetch("https://api.metals.live/v1/spot");
    const data = await res.json();
    return {
      gold: data.gold * USD_TO_EUR,
      silver: data.silver * USD_TO_EUR
    };
  } catch (e) {
    console.error("Erreur récupération prix:", e);
    return { gold: 0, silver: 0 };
  }
}

// Afficher les prix dans les spans
function displayPrices(prices) {
  goldRateSpan.innerText = prices.gold.toFixed(2);
  silverRateSpan.innerText = prices.silver.toFixed(2);
}

// Calcul de la valeur totale
function updateTotal(prices) {
  const goldValue = prices.gold * (+goldQty.value || 0);
  const silverValue = prices.silver * (+silverQty.value || 0);
  const total = goldValue + silverValue;
  totalValue.innerText = total.toFixed(2);
  return { goldValue, silverValue, total };
}

// Sauvegarde du portefeuille dans Firestore
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

// Sauvegarde journalière des valeurs
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

// Chargement du portefeuille Firestore
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

// Chargement de l'historique pour le graphique
async function loadHistory() {
  const user = firebase.auth().currentUser;
  if (!user) return [];

  const snap = await db.collection("users").doc(user.uid)
    .collection("history").orderBy("timestamp").get();

  return snap.docs.map(d => ({ date: d.id, ...d.data() }));
}

// Mise à jour du portefeuille et graphique
async function refreshPortfolio() {
  const prices = await fetchRealPrices();
  displayPrices(prices);
  await saveDailyHistory(prices);
  const history = await loadHistory();
  updatePortfolioChart(history);
}

// Mise à jour dynamique toutes les 5 minutes
function startAutoRefresh() {
  setInterval(refreshPortfolio, 300000); // 5 min
}

// Détecter changement de quantité et recalculer
[goldQty, silverQty].forEach(input => {
  input.addEventListener("input", async () => {
    await savePortfolio();
    await refreshPortfolio();
  });
});

// Exécution principale après connexion
firebase.auth().onAuthStateChanged(async user => {
  if (!user) return;

  await loadPortfolio();
  await refreshPortfolio();
  startAutoRefresh();
});
