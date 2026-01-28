function createChart(canvasId, label, color) {
  return new Chart(document.getElementById(canvasId), {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label,
        borderColor: color,
        data: [],
        tension: 0.3
      }]
    }
  });
}

const goldChart = createChart("goldChart", "Valeur Or (€)", "#D4AF37");
const silverChart = createChart("silverChart", "Valeur Argent (€)", "#C0C0C0");

function updateChart(chart, value) {
  chart.data.labels.push(new Date().toLocaleTimeString());
  chart.data.datasets[0].data.push(value);

  if (chart.data.labels.length > 10) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}
