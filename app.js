let goldRate = 0;
let silverRate = 0;

function showPage(page) {
  document.getElementById("gold").classList.add("hidden");
  document.getElementById("silver").classList.add("hidden");
  document.getElementById(page).classList.remove("hidden");
}

function saveData() {
  localStorage.setItem("goldQty", document.getElementById("goldQty").value);
  localStorage.setItem("goldRate", document.getElementById("goldRate").value);
  localStorage.setItem("silverQty", document.getElementById("silverQty").value);
  localStorage.setItem("silverRate", document.getElementById("silverRate").value);
}

function loadData() {
  const gQty = localStorage.getItem("goldQty");
  const gRate = localStorage.getItem("goldRate");
  const sQty = localStorage.getItem("silverQty");
  const sRate = localStorage.getItem("silverRate");

  if (gQty) document.getElementById("goldQty").value = gQty;
  if (gRate) document.getElementById("goldRate").value = gRate;
  if (sQty) document.getElementById("silverQty").value = sQty;
  if (sRate) document.getElementById("silverRate").value = sRate;

  updateGoldValue();
  updateSilverValue();
}

function updateGoldValue() {
  const rate = parseFloat(document.getElementById("goldRate").value || 0);
  const qty = parseFloat(document.getElementById("goldQty").value || 0);
  const value = rate * qty;
  document.getElementById("goldValue").innerText = value.toFixed(2);
  updateChart(goldChart, rate);
}

function updateSilverValue() {
  const rate = parseFloat(document.getElementById("silverRate").value || 0);
  const qty = parseFloat(document.getElementById("silverQty").value || 0);
  const value = rate * qty;
  document.getElementById("silverValue").innerText = value.toFixed(2);
  updateChart(silverChart, rate);
}

// events
document.getElementById("goldQty").addEventListener("input", () => {
  saveData();
  updateGoldValue();
});

document.getElementById("goldRate").addEventListener("input", () => {
  saveData();
  updateGoldValue();
});

document.getElementById("silverQty").addEventListener("input", () => {
  saveData();
  updateSilverValue();
});

document.getElementById("silverRate").addEventListener("input", () => {
  saveData();
  updateSilverValue();
});

// load data at start
loadData();
