document.addEventListener("DOMContentLoaded", () => {
  // 👁️ Password show/hide toggle logic
  window.togglePassword = function (id, icon) {
    const input = document.getElementById(id);
    const isHidden = input.type === "password"; // ✅ Correct check
    input.type = isHidden ? "text" : "password"; // 🔁 Toggle type
    icon.textContent = isHidden ? "👁️" : "👁️";
  };
});
