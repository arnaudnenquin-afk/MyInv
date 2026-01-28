// DOM elements
const goldQty = document.getElementById("goldQty");
const silverQty = document.getElementById("silverQty");
const goldRateInput = document.getElementById("goldRate");
const silverRateInput = document.getElementById("silverRate");
const totalValue = document.getElementById("totalValue");

// Sauvegarde du portefeuille Firestore
async function savePortfolio() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  await db.collection("users").doc(user.uid)
    .collection("portfolio").doc("current")
    .set({
      goldQty: +goldQty.value || 0,
      silverQty: +silverQty.value || 0,
      goldRate: +goldRateInput.value || 0,
      silverRate: +silverRateInput.value || 0
    });
}

// Sauvegarde journalière
async function saveDailyHistory() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const goldValue = (+goldQty.value || 0) * (+goldRateInput.value || 0);
  const silverValue = (+silverQty.value || 0) * (+silverRateInput.value || 0);
  const total = goldValue + silverValue;

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

// Charger le portefeuille
async function loadPortfolio() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const doc = await db.collection("users").doc(user.uid)
    .collection("portfolio").doc("current").get();

  if (doc.exists) {
    goldQty.value = doc.data().goldQty || 0;
    silverQty.value = doc.data().silverQty || 0;
    goldRateInput.value = doc.data().goldRate || 0;
    silverRateInput.value = doc.data().silverRate || 0;
  }

  updateValues();
  loadHistory();
}

// Charger l’historique pour le graphique
async function loadHistory() {
  const user = firebase.auth().currentUser;
  if (!user) return [];

  const snap = await db.collection("users").doc(user.uid)
    .collection("history").orderBy("timestamp").get();

  const history = snap.docs.map(d => ({ date: d.id, ...d.data() }));
  updatePortfolioChart(history);
  return history;
}

// Calcul et affichage des valeurs
function updateValues() {
  const goldValue = (+goldQty.value || 0) * (+goldRateInput.value || 0);
  const silverValue = (+silverQty.value || 0) * (+silverRateInput.value || 0);
  const total = goldValue + silverValue;

  totalValue.innerText = total.toFixed(2);
}

// Mise à jour instantanée au changement
[goldQty, silverQty, goldRateInput, silverRateInput].forEach(input => {
  input.addEventListener("input", async () => {
    updateValues();
    await savePortfolio();
    await saveDailyHistory();
  });
});

// Initialisation après connexion
firebase.auth().onAuthStateChanged(async user => {
  if (!user) return;

  await loadPortfolio();
});
