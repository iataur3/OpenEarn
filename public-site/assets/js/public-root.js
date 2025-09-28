// --- Page Load Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  // showSection("dashboard");
  loadLanguages();

  const homeToggle = document.getElementById("homeToggle");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");

  homeToggle.addEventListener("click", function (e) {
    e.preventDefault();
    if (sidebar.classList.contains("hidden")) {
      sidebar.classList.remove("hidden");
      sidebar.classList.add("visible");
      mainContent.classList.remove("shifted");
    } else {
      sidebar.classList.add("hidden");
      sidebar.classList.remove("visible");
      mainContent.classList.add("shifted");
    }
  });

  const currentPath = window.location.pathname.split("/").pop(); // 🔍 current page name
  const sidebarLinks = document.querySelectorAll(".sidebar-link a");

  sidebarLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active"); // ✅ active class add
    }
  });
});

//night mode button
const nightBtn = document.getElementById("nightBtn");
// 🕒 page loade check
if (localStorage.getItem("nightMode") === "enabled") {
  document.body.classList.add("night-mode");
  nightBtn.textContent = "✨️";
} else {
  nightBtn.textContent = "🌙";
}

// 🖱️ click toggle + localStorage update
nightBtn.addEventListener("click", () => {
  document.body.classList.toggle("night-mode");

  if (document.body.classList.contains("night-mode")) {
    localStorage.setItem("nightMode", "enabled");
    nightBtn.textContent = "✨️";
  } else {
    localStorage.setItem("nightMode", "disabled");
    nightBtn.textContent = "🌙";
  }
});

// --- Language Loader ---
let currentLang = "en";
async function loadLanguages() {
  const select = document.getElementById("languageSelect");
  select.innerHTML = "";
  let fallback = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "bn", name: "Bengali", flag: "🇧🇩" },
  ];
  try {
    const res = await fetch("https://libretranslate.com/languages");
    if (!res.ok) throw new Error("API error");
    let langs = await res.json();
    fallback.forEach((fb) => {
      const found = langs.find((l) => l.code === fb.code);
      if (found) {
        select.innerHTML += `<option value="${fb.code}">${fb.flag} ${found.name}</option>`;
      }
    });
    langs.forEach((lang) => {
      if (lang.code !== "en" && lang.code !== "bn") {
        select.innerHTML += `<option value="${lang.code}">${lang.name}</option>`;
      }
    });
  } catch {
    fallback.forEach((lang) => {
      select.innerHTML += `<option value="${lang.code}">${lang.flag} ${lang.name}</option>`;
    });
    select.innerHTML += "<option disabled>API Error</option>";
  }
  select.value = "en";
}
// --- Language Change Handler ---
document
  .getElementById("languageSelect")
  .addEventListener("change", function () {
    currentLang = this.value;
    document.documentElement.lang = currentLang;
  });

// --- Text Selection Translation ---
document.addEventListener("mouseup", async function (e) {
  const selection = window.getSelection();
  const text = selection && selection.toString().trim();
  if (text && currentLang !== "en") {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    let tooltip = document.getElementById("translateTooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "translateTooltip";
      tooltip.style.position = "absolute";
      tooltip.style.background = "#686363ff";
      tooltip.style.border = "1px solid #ccc";
      tooltip.style.padding = "6px 12px";
      tooltip.style.borderRadius = "6px";
      tooltip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
      tooltip.style.zIndex = 9999;
      tooltip.style.fontSize = "15px";
      tooltip.style.maxWidth = "80%";
      tooltip.style.wordWrap = "break-word";
      tooltip.style.display = "none";
      document.body.appendChild(tooltip);
    }

    tooltip.textContent = "Translating...";
    tooltip.style.display = "block";

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    tooltip.style.left = rect.left + scrollLeft + "px";
    tooltip.style.top = rect.bottom + scrollTop + 5 + "px";
    tooltip.style.transform = "none";

    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|${currentLang}`
      );
      const data = await res.json();
      tooltip.textContent =
        data.responseData.translatedText || "Translation error";
    } catch {
      tooltip.textContent = "Translation error";
    }
  } else {
    const tooltip = document.getElementById("translateTooltip");
    if (tooltip) tooltip.style.display = "none";
  }
});

// function showSection(sectionId) {
//   if (sectionId === "public-dashboard") setDashboardData();
//   document
//     .querySelectorAll(".task-section")
//     .forEach((section) => section.classList.add("hidden"));
//   const target = document.getElementById(sectionId);
//   if (target) target.classList.remove("hidden");

//   document
//     .querySelectorAll(".sub-list a")
//     .forEach((link) => link.classList.remove("active-link"));
//   const activeLink = [...document.querySelectorAll(".sub-list a")].find(
//     (link) => link.getAttribute("onclick")?.includes(sectionId)
//   );
//   if (activeLink) activeLink.classList.add("active-link");

//   // ✅ Add this line to reset scroll
//   window.scrollTo({ top: 0, behavior: "smooth" });
// }

// window.showSection = showSection;
