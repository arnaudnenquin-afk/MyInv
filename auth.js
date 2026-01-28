const auth = firebase.auth();

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => { window.location.href = "app.html"; })
    .catch(err => alert(err.message));
}

function register() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => { window.location.href = "app.html"; })
    .catch(err => alert(err.message));
}

function resetPassword() {
  const email = document.getElementById("email").value.trim();
  if (!email) return alert("Entrez votre email");

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Email de récupération envoyé"))
    .catch(err => alert(err.message));
}
