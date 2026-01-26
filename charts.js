const goldChart = new Chart(document.getElementById("goldChart"), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Valeur Or €',
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
      label: 'Valeur Argent €',
      borderColor: '#C0C0C0',
      data: []
    }]
  }
});