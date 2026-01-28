const portfolioChart = new Chart(document.getElementById("portfolioChart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      { label: "Total (€)", data: [], borderColor: "#00FF00", fill: true, backgroundColor: "rgba(0,255,0,0.2)", tension: 0.3 },
      { label: "Or (€)", data: [], borderColor: "#D4AF37", fill: true, backgroundColor: "rgba(212,175,55,0.2)", tension: 0.3 },
      { label: "Argent (€)", data: [], borderColor: "#C0C0C0", fill: true, backgroundColor: "rgba(192,192,192,0.2)", tension: 0.3 }
    ]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: "top", labels: { color: "#fff" } } },
    scales: {
      x: { ticks: { color: "#fff" } },
      y: { beginAtZero: true, ticks: { color: "#fff" } }
    }
  }
});

function updatePortfolioChart(history) {
  portfolioChart.data.labels = history.map(h => h.date);
  portfolioChart.data.datasets[0].data = history.map(h => h.total);
  portfolioChart.data.datasets[1].data = history.map(h => h.gold);
  portfolioChart.data.datasets[2].data = history.map(h => h.silver);
  portfolioChart.update();
}
