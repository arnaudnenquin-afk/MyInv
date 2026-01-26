const GOLD_PRICE = 65;   // €/g (modifiable via API plus tard)
const SILVER_PRICE = 0.8;

function showPage(page) {
  document.getElementById("gold").classList.add("hidden");
  document.getElementById("silver").classList.add("hidden");
  document.getElementById(page).classList.remove("hidden");
}

document.getElementById("goldQty").addEventListener("input", e => {
  const value = e.target.value * GOLD_PRICE;
  document.getElementById("goldValue").innerText = value.toFixed(2);
  updateChart(goldChart, value);
});

document.getElementById("silverQty").addEventListener("input", e => {
  const value = e.target.value * SILVER_PRICE;
  document.getElementById("silverValue").innerText = value.toFixed(2);
  updateChart(silverChart, value);
});

function updateChart(chart, value) {
  chart.data.labels.push(new Date().toLocaleTimeString());
  chart.data.datasets[0].data.push(value);
  chart.update();
}