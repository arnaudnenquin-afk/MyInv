const goldChart = new Chart(document.getElementById("goldChart"), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Cours Or €/oz',
      borderColor: '#D4AF37',
      data: []
    }]
  }
});

const silverChart = new Chart(document.getElementById("silverChart"), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Cours Argent €/oz',
      borderColor: '#C0C0C0',
      data: []
    }]
  }
});

function updateChart(chart, rate) {
  chart.data.labels.push(new Date().toLocaleTimeString());
  chart.data.datasets[0].data.push(rate);

  if (chart.data.labels.length > 10) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}
