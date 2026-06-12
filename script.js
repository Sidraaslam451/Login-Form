// ── Tab Switching ──────────────────────────────────────
function switchTab(tab) {
  const wrapper = document.getElementById("formsWrapper");
  const indicator = document.getElementById("indicator");
  const tabLogin = document.getElementById("tabLogin");
  const tabReg = document.getElementById("tabReg");

  if (tab === "register") {
    wrapper.classList.add("show-register");
    indicator.classList.add("to-register");
    tabLogin.classList.remove("active");
    tabReg.classList.add("active");
  } else {
    wrapper.classList.remove("show-register");
    indicator.classList.remove("to-register");
    tabReg.classList.remove("active");
    tabLogin.classList.add("active");
  }
}

// ── Password Toggle ──────────────────────────────────────
function togglePass(inputId, icon) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// ── Error Helpers ──────────────────────────────────────
function showErr(id, msg) {
  const el = document.getElementById(id);
  el.querySelector("span").textContent = msg;
  el.classList.add("show");

  // highlight the input
  const input = el.previousElementSibling?.querySelector("input");
  if (input) input.classList.add("error");
}

function clearErr(id) {
  const el = document.getElementById(id);
  el.classList.remove("show");

  const input = el.previousElementSibling?.querySelector("input");
  if (input) input.classList.remove("error");
}

// ── Password Strength ──────────────────────────────────────
function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function onPassInput() {
  clearErr("regPassErr");

  const val = document.getElementById("regPass").value;
  const score = getStrength(val);

  const colors = ["", "#e84118", "#f39c12", "#f39c12", "#27ae60"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  for (let i = 1; i <= 4; i++) {
    const seg = document.getElementById("s" + i);
    seg.style.background = i <= score ? colors[score] : "var(--border)";
  }

  const label = document.getElementById("strengthLabel");
  label.textContent = val.length ? labels[score] : "";
  label.style.color = colors[score] || "var(--text-muted)";
}

// ── Toast ──────────────────────────────────────
function showToast(title, sub) {
  document.getElementById("toastTitle").textContent = title;
  document.getElementById("toastSub").textContent = sub;

  const toast = document.getElementById("toast");
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── Fake async submit ──────────────────────────────────────
function fakeSubmit(btn, onSuccess) {
  btn.classList.add("loading");
  setTimeout(() => {
    btn.classList.remove("loading");
    onSuccess();
  }, 1300);
}

// ── Login Handler ──────────────────────────────────────
function handleLogin(btn) {
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value;

  let valid = true;

  if (!username) {
    showErr("loginUserErr", "Username is required");
    valid = false;
  }

  if (!password) {
    showErr("loginPassErr", "Password is required");
    valid = false;
  } else if (password.length < 6) {
    showErr("loginPassErr", "Password must be at least 6 characters");
    valid = false;
  }

  if (!valid) return;

  fakeSubmit(btn, () => showToast("Welcome back!", "You are now signed in."));
}

// ── Register Handler ──────────────────────────────────────
function handleRegister(btn) {
  const username = document.getElementById("regUser").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPass").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valid = true;

  if (!username || username.length < 3) {
    showErr("regUserErr", "Username must be at least 3 characters");
    valid = false;
  }

  if (!email || !emailRegex.test(email)) {
    showErr("regEmailErr", "Enter a valid email address");
    valid = false;
  }

  if (!password || getStrength(password) < 2) {
    showErr(
      "regPassErr",
      "Choose a stronger password (min 8 chars, uppercase & number)",
    );
    valid = false;
  }

  if (!valid) return;

  fakeSubmit(btn, () =>
    showToast("Account created!", "Welcome aboard. You can now sign in."),
  );
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input").forEach((input) => {
    input.setAttribute("readonly", true);
    input.addEventListener("focus", () => input.removeAttribute("readonly"));
  });
});
