function login() {
  firebase.auth()
    .signInWithEmailAndPassword(
      document.getElementById("email").value,
      document.getElementById("password").value
    )
    .then(() => window.location.href = "app.html")
    .catch(e => alert(e.message));
}

function register() {
  firebase.auth()
    .createUserWithEmailAndPassword(
      document.getElementById("email").value,
      document.getElementById("password").value
    )
    .then(() => window.location.href = "app.html")
    .catch(e => alert(e.message));
}

function resetPassword() {
  const email = document.getElementById("email").value;
  if (!email) {
    alert("Entre ton email");
    return;
  }

  firebase.auth()
    .sendPasswordResetEmail(email)
    .then(() => alert("Email de récupération envoyé"))
    .catch(e => alert(e.message));
}

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}
