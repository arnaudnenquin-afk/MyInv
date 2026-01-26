function checkPin() {
  const input = document.getElementById("pinInput").value;
  const savedPin = localStorage.getItem("pin");

  if (input.length !== 6) {
    alert("Le code doit contenir 6 caractères");
    return;
  }

  // Premier lancement : on enregistre le code
  if (!savedPin) {
    localStorage.setItem("pin", input);
    unlock();
    return;
  }

  // Vérification du code
  if (input === savedPin) {
    unlock();
  } else {
    alert("Code incorrect");
  }
}

function unlock() {
  document.getElementById("lockScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}