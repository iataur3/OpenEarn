//public-login.js
document.addEventListener("DOMContentLoaded", () => {
  // 👁️ Password show/hide toggle logic
  window.togglePassword = function (id, icon) {
    const input = document.getElementById(id);
    const isHidden = input.type === "password"; // ✅ Correct check
    input.type = isHidden ? "text" : "password"; // 🔁 Toggle type
    icon.textContent = isHidden ? "👁️" : "👁️";
  };
});

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log("✅ Login success:", user.uid);
    window.location.href = "/public-site/public-dashboard.html";
  })
  .catch((error) => {
    console.error("❌ Login error:", error.message);
  });
