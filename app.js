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
  const silverValue = prices.silver * (+*
