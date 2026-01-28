// Création du graphique
const portfolioChart = new Chart(document.getElementById("portfolioChart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      { label: "Total (€)", data: [], borderColor: "#00FF00", fill: false },
      { label: "Or (€)", data: [], borderColor: "#D4AF37", fill: false },
      { label: "Argent (€)", data: [], borderColor: "#C0C0C0", fill: false }
    ]
  },
  options: { responsive: true, scales: { y: { beginAtZero: true } } }
});

function updatePortfolioChart(history) {
  portfolioChart.data.labels = history.map(h => h.date);
  portfolioChart.data.datasets[0].data = history.map(h => h.total);
  portfolioChart.data.datasets[1].data = history.map(h => h.gold);
  portfolioChart.data.datasets[2].data = history.map(h => h.silver);
  portfolioChart.update();
}
