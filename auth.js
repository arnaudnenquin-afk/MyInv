// 🔥 Firebase config (COLLE LA TIENNE ICI)
const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX.firebaseapp.com",
  projectId: "XXX",
  appId: "XXX"
};

// Init
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// LOGIN
function login() {
  const email = email.value;
  const password = password.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "app.html";
    })
    .catch(err => alert(err.message));
}

// REGISTER
function register() {
  const email = email.value;
  const password = password.value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Compte créé, connecte-toi"))
    .catch(err => alert(err.message));
}

// RESET PASSWORD
function resetPassword() {
  const email = document.getElementById("email").value;
  if (!email) {
    alert("Entre ton email");
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Email de récupération envoyé"))
    .catch(err => alert(err.message));
}
