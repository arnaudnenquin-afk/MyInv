const PIN_KEY = "myinv_pin";

document.getElementById("unlockBtn").addEventListener("click", checkPin);

function checkPin() {
  const input = document.getElementById("pinInput").value;
  const savedPin = localStorage.getItem(PIN_KEY);

  if (input.length !== 6) {
    alert("Le code doit contenir 6 chiffres");
    return;
  }

  if (!savedPin) {
    localStorage.setItem(PIN_KEY, input);
    unlock();
    return;
  }

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
