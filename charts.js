const portfolioChart = new Chart(
  document.getElementById("portfolioChart"),
  {
    type: "line",
    data: {
      labels: [],
      datasets: [
        { label: "Total (€)", data: [] },
        { label: "Or (€)", data: [] },
        { label: "Argent (€)", data: [] }
      ]
    }
  }
);

function updatePortfolioChart(history) {
  portfolioChart.data.labels = history.map(h => h.date);
  portfolioChart.data.datasets[0].data = history.map(h => h.total);
  portfolioChart.data.datasets[1].data = history.map(h => h.gold);
  portfolioChart.data.datasets[2].data = history.map(h => h.silver);
  portfolioChart.update();
}
