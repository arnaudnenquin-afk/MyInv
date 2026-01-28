function login() {
  firebase.auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then(() => window.location.href = "app.html")
    .catch(e => alert(e.message));
}

function register() {
  firebase.auth()
    .createUserWithEmailAndPassword(email.value, password.value)
    .then(() => window.location.href = "app.html")
    .catch(e => alert(e.message));
}

function resetPassword() {
  if (!email.value) {
    alert("Entre ton email");
    return;
  }

  firebase.auth()
    .sendPasswordResetEmail(email.value)
    .then(() => alert("Email envoyé"))
    .catch(e => alert(e.message));
}

function logout() {
  firebase.auth().signOut();
}
