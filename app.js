// Conversion USD → EUR approximative
const USD_TO_EUR = 0.92;

// Champs HTML
const goldQty = document.getElementById("goldQty");
const silverQty = document.getElementById("silverQty");
const totalValue = document.getElementById("totalValue");

// Fonction pour récupérer les prix réels gratuits
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

// Sauvegarde du portefeuille dans Firestore
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

// Chargement du portefeuille depuis Firestore
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

// Sauvegarde quotidienne des valeurs
async function saveDailyHistory(prices) {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const goldValue = prices.gold * (+goldQty.value || 0);
  const silverValue = prices.silver * (+silverQty.value || 0);
  const total = goldValue + silverValue;

  totalValue.innerText = total.toFixed(2);

  const today = new Date().toISOString().split("T")[0];

  await db.collection("users")
    .doc(user.uid)
    .collection("history")
    .doc(today)
    .set({
      gold: goldValue,
      silver: silverValue,
      total,
      timestamp: Date.now()
    });
}

// Chargement de l'historique depuis Firestore
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

// Mettre à jour la sauvegarde lors de la saisie
[goldQty, silverQty].forEach(input => {
  input.addEventListener("input", savePortfolio);
});

// Fonction principale après connexion
firebase.auth().onAuthStateChanged(async user => {
  if (!user) return;

  // Charger le portefeuille de l'utilisateur
  await loadPortfolio();

  // Récupérer les prix réels
  const prices = await fetchRealPrices();

  // Sauvegarder les valeurs du jour
  await saveDailyHistory(prices);

  // Charger l'historique et mettre à jour le graphique
  const history = await loadHistory();
  updatePortfolioChart(history);

  // Mettre à jour dynamiquement toutes les 5 min
  setInterval(async () => {
    const newPrices = await fetchRealPrices();
    await saveDailyHistory(newPrices);
    const newHistory = await loadHistory();
    updatePortfolioChart(newHistory);
  }, 300000); // 300000 ms = 5 min
});
