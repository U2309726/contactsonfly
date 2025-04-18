import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBRZdSNDkC2vq5TA5QYjNQtw-xUbWEye2Y",
  authDomain: "contact-on-the-go.firebaseapp.com",
  projectId: "contact-on-the-go",
  storageBucket: "contact-on-the-go.firebasestorage.app",
  messagingSenderId: "19775203867",
  appId: "1:19775203867:web:e1918bb1215565da8be6be"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const email = document.getElementById('emailAuth');
const password = document.getElementById('passwordAuth');
const loginBtn = document.getElementById('loginBtnAuth');
const signupBtn = document.getElementById('signupBtn');
const toggleText = document.getElementById('toggleText');
const authError = document.getElementById('authError');

function clearError() {
  authError.textContent = '';
}

toggleText.addEventListener('click', () => {
  const isSignup = signupBtn.style.display === 'none';
  signupBtn.style.display = isSignup ? 'inline-block' : 'none';
  loginBtn.style.display = isSignup ? 'none' : 'inline-block';
  toggleText.innerHTML = isSignup
    ? `Already have an account? <span id="loginLink">Login</span>`
    : `Don't have an account? <span id="signupLink">Sign Up</span>`;
  clearError();
});

loginBtn.addEventListener('click', async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    window.location.href = 'app.html';
  } catch (error) {
    authError.textContent = error.message;
  }
});

signupBtn.addEventListener('click', async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    window.location.href = 'app.html';
  } catch (error) {
    authError.textContent = error.message;
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = 'app.html';
  }
});
