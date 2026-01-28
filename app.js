<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>MyInv</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"></script>

  <!-- Chart -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <link rel="stylesheet" href="style.css">
</head>
<body>

<!-- 🔒 PROTECTION AUTH -->
<script>
  const firebaseConfig = {
    apiKey: "XXX",
    authDomain: "XXX.firebaseapp.com",
    projectId: "XXX",
    appId: "XXX"
  };

  firebase.initializeApp(firebaseConfig);

  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "index.html";
    }
  });
</script>

<!-- APP -->
<div id="app">

  <nav>
    <button data-page="gold">Or</button>
    <button data-page="silver">Argent</button>
    <button onclick="logout()">Déconnexion</button>
  </nav>

  <!-- OR -->
  <section id="gold" class="page gold">
    <h2>Or</h2>

    <p>Cours (€/oz)</p>
    <input type="number" id="goldRate">
    <small id="goldSource"></small>

    <p>Quantité (oz)</p>
    <input type="number" id="goldQty">

    <p>Valeur : <span id="goldValue">0</span> €</p>
    <canvas id="goldChart"></canvas>
  </section>

  <!-- ARGENT -->
  <section id="silver" class="page silver hidden">
    <h2>Argent</h2>

    <p>Cours (€/oz)</p>
    <input type="number" id="silverRate">
    <small id="silverSource"></small>

    <p>Quantité (oz)</p>
    <input type="number" id="silverQty">

    <p>Valeur : <span id="silverValue">0</span> €</p>
    <canvas id="silverChart"></canvas>
  </section>

</div>

<script src="auth.js"></script>
<script src="charts.js"></script>
<script src="app.js"></script>
</body>
</html>
