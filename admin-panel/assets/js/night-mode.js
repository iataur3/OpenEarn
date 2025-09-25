// 🔍 Button select করা হচ্ছে
const nightBtn = document.getElementById("nightBtn");

// 🕒 পেইজ লোড হলে check করো
if (localStorage.getItem("nightMode") === "enabled") {
  document.body.classList.add("night");
  nightBtn.textContent = "✨️";
} else {
  nightBtn.textContent = "🌙";
}

// 🖱️ ক্লিক করলে toggle + localStorage update
nightBtn.addEventListener("click", () => {
  document.body.classList.toggle("night");

  if (document.body.classList.contains("night")) {
    localStorage.setItem("nightMode", "enabled");
    nightBtn.textContent = "✨️";
  } else {
    localStorage.setItem("nightMode", "disabled");
    nightBtn.textContent = "🌙";
  }
});

// const sidebar = document.getElementById("sidebar");
// const menuBtn = document.getElementById("menuBtn");
// const nightBtn = document.getElementById("nightBtn");
// const searchBtn = document.getElementById("searchBtn");
// const searchInput = document.getElementById("searchInput");

// // 🧠 DOM element check
// if (!sidebar || !menuBtn || !nightBtn || !searchBtn || !searchInput) {
//   console.error("❌ Required DOM elements not found. Check your HTML IDs.");
// }
