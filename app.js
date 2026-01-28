// Conversion USD → EUR approximative
const USD_TO_EUR = 0.92;

// Champs HTML
const goldQty = document.getElementById("goldQty");
const silverQty = document.getElementById("silverQty");
const totalValue = document.getElementById("totalValue");
const goldRateSpan = document.getElementById("goldRate");
const silverRateSpan = document.getElementById("silverRate");

// Récupération des prix réels gratuits
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

// Mettre à jour les spans avec les prix
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

// Fonction principale
firebase.auth().onAuthStateChanged(async user => {
  if (!user) return;

  // Charger les quantités sauvegardées
  const doc = await db.collection("users").doc(user.uid)
    .collection("portfolio").doc("current").get();

  if (doc.exists) {
    goldQty.value = doc.data().goldQty || 0;
    silverQty.value = doc.data().silverQty || 0;
  }

  // Récupérer les prix et afficher
  const prices = await fetchRealPrices();
  displayPrices(prices);

  // Calcul et sauvegarde
  const values = updateTotal(prices);

  // Sauvegarde journalière
  const today = new Date().toISOString().split("T")[0];
  await db.collection("users").doc(user.uid)
    .collection("history").doc(today)
    .set({
      gold: values.goldValue,
      silver: values.silverValue,
      total: values.total,
      timestamp: Date.now()
    });

  // Mettre à jour le graphique
  const historySnap = await db.collection("users").doc(user.uid)
    .collection("history").orderBy("timestamp").get();

  const history = historySnap.docs.map(d => ({ date: d.id, ...d.data() }));
  updatePortfolioChart(history);

  // Actualisation toutes les 5 min
  setInterval(async () => {
    const newPrices = await fetchRealPrices();
    displayPrices(newPrices);
    const newValues = updateTotal(newPrices);
    const todayKey = new Date().toISOString().split("T")[0];
    await db.collection("users").doc(user.uid)
      .collection("history").doc(todayKey)
      .set({
        gold: newValues.goldValue,
        silver: newValues.silverValue,
        total: newValues.total,
        timestamp: Date.now()
      });
    const snap = await db.collection("users").doc(user.uid)
      .collection("history").orderBy("timestamp").get();
    const newHistory = snap.docs.map(d => ({ date: d.id, ...d.data() }));
    updatePortfolioChart(newHistory);
  }, 300000);
});

// Mettre à jour la valeur totale quand l’utilisateur change la quantité
[goldQty, silverQty].forEach(input => {
  input.addEventListener("input", async () => {
    const prices = await fetchRealPrices();
    displayPrices(prices);
    const values = updateTotal(prices);
    savePortfolio();
  });
});

// Sauvegarde du portefeuille
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

