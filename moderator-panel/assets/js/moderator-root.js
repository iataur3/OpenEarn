// moderator-root.js
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Services
const rtdb = getDatabase(app); // Realtime DB
const firestore = getFirestore(app); // Firestore
const auth = getAuth(app); // Auth
const analytics = getAnalytics(app); // Analytics

// ✅ Realtime DB test
console.log("✅ Firebase Realtime DB connected:", rtdb);
set(ref(rtdb, "admin/test"), {
  status: "connected",
  time: Date.now(),
});

// 🔐 Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/public-site/public-login.html";
  }
});

// 🗂️ Firestore query
const logsRef = collection(firestore, "loginLogs");
getDocs(logsRef).then((snapshot) => {
  snapshot.forEach((doc) => {
    console.log("📄", doc.data());
  });
});

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const nightBtn = document.getElementById("nightBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const contentArea = document.getElementById("contentArea");
document.addEventListener("DOMContentLoaded", () => {
  const role = sessionStorage.getItem("role");

  // 🔐 Role check: admin only
  if (!role || role !== "moderator") {
    window.location.href = "/public-site/public-login.html";
    return;
  }

  // 🧠 Sidebar filtering based on role
  document.querySelectorAll("#sidebar a").forEach((link) => {
    const roleAttr = link.getAttribute("data-role");
    if (roleAttr) {
      const allowedRoles = roleAttr.split(",").map((r) => r.trim());
      if (!allowedRoles.includes(role)) {
        link.style.display = "none";
      }
    }
  });
});
// 🟢 Activate current menu item based on URL
function activateSection(sectionName) {
  document.querySelectorAll("[data-section]").forEach((el) => {
    el.classList.toggle("active", el.dataset.section === sectionName);
  });
}
const path = window.location.pathname;
let section = "";

if (path.includes("admin-dashboard")) {
  section = "dashboard";
} else if (path.includes("user-control")) {
  section = "user-control";
} else if (path.includes("running-task")) {
  section = "running-task";
} else if (path.includes("admin-working-t")) {
  section = "admin-working";
} else if (path.includes("moderator-d-t")) {
  section = "moderator-define";
} else if (path.includes("user-worked-t")) {
  section = "user-worked";
} //  section add

activateSection(section);

// // 🟢 Activate current menu item based on URL
// function activateMenu(selector) {
//   const currentPath = decodeURIComponent(window.location.pathname);
//   document.querySelectorAll(selector).forEach((el) => {
//     const elPath = decodeURIComponent(new URL(el.href).pathname);
//     el.classList.toggle("active", elPath === currentPath);
//   });
// }
// // 🔁 Apply to sidebar and status buttons
// activateMenu("#sidebar a");
// activateMenu("status-buttons");

// 📱 Sidebar toggle for mobile/desktop
menuBtn.addEventListener("click", () => {
  window.innerWidth <= 368
    ? sidebar.classList.toggle("show")
    : sidebar.classList.toggle("hide");
});

// 📤 Auto-hide sidebar on outside click (mobile only)
document.addEventListener("click", (e) => {
  if (
    window.innerWidth <= 368 &&
    !sidebar.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    sidebar.classList.remove("show");
  }
});

//night mode js
// 🕒 পেইজ লোড হলে check করো
if (localStorage.getItem("nightMode") === "enabled") {
  document.body.classList.add("night");
  nightBtn.textContent = "✨️";
} else {
  nightBtn.textContent = "🌙";
}

// 🖱️ click toggle + localStorage update
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

// 🔍 Search filter for tasks
const rows = document.querySelectorAll("tbody tr");
function filterTasks() {
  const q = searchInput.value.trim().toLowerCase();
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? "" : "none";
  });
}
searchBtn.addEventListener("click", filterTasks);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    filterTasks();
  }
});
// ✅ Live search while typing
searchInput.addEventListener("input", filterTasks);
