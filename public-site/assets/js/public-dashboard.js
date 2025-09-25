document.addEventListener("DOMContentLoaded", () => {
  renderChart("daily");
  showSection("dashboard");
  loadLanguages();

  const chartFilter = document.getElementById("chartFilter");
  if (chartFilter) {
    chartFilter.addEventListener("change", function () {
      renderChart(this.value);
    });
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

// --- Profile Form Toggle ---
function toggleProfileForm() {
  const form = document.getElementById("profile-details-form");
  form.style.display =
    form.style.display === "none" || form.style.display === ""
      ? "block"
      : "none";
}

// --- Profile Photo Preview ---
function validateProfilePhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
  ];
  const maxSizeMB = 1;
  const messages = {
    en: {
      invalidType: "❌ Only JPG, PNG, WEBP, GIF, or BMP images are allowed.",
      tooLarge: (size) => `❌ Image must be under ${size}MB.`,
    },
  };
  const currentLang = document.documentElement.lang === "bn" ? "bn" : "en";
  if (!allowedTypes.includes(file.type)) {
    alert("❌ Only JPG or PNG images are allowed.");
    input.value = "";
    return;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    alert(`❌ Image must be under ${maxSizeMB}MB.`);
    input.value = "";
    return;
  }

  // ✅ Optional: Preview
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("profilePhoto").src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// --- Name Edit ---
function editName() {
  const nameSpan = document.getElementById("user-name");
  const currentName = nameSpan.textContent;
  nameSpan.innerHTML = `<input type="text" value="${currentName}" onblur="saveName(this.value)" />`;
}
function saveName(newName) {
  document.getElementById("user-name").textContent = newName;
}

// --- Referral Copy ---
function copyReferral() {
  navigator.clipboard.writeText("SE12345");
  alert("Referral code copied!");
}

// --- Task Completion ---
function completeTask(button) {
  button.textContent = "✅ Task Completed";
  button.classList.add("completed");
  button.disabled = true;
}

// --- Sublist Toggle ---
function toggleSubList(event) {
  const subList = document.getElementById("taskSubList");
  subList.classList.toggle("hidden");
}

// --- Dashboard Data Setup ---
function setDashboardData() {
  document.getElementById("completedCount").textContent = 12;
  document.getElementById("pendingCount").textContent = 5;
  document.getElementById("rejectedCount").textContent = 2;
  document.getElementById("earningsAmount").textContent = "$48.00";
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = "70%";
  progressBar.textContent = "70%";
}

// --- Chart Data ---
const chartData = {
  daily: {
    labels: Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const suffix = hour < 12 ? "AM" : "PM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${displayHour} ${suffix}`;
    }),
    data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 1),
    label: "Hourly Earnings",
    xLabel: "Hour",
  },
  weekly: {
    labels: ["Aug 1", "Aug 2", "Aug 3", "Aug 4", "Aug 5", "Aug 6", "Aug 7"],
    data: [4, 6, 3, 5, 7, 2, 4],
    label: "Daily Earnings (Last 7 Days)",
    xLabel: "Date",
  },
  monthly: {
    labels: Array.from({ length: 30 }, (_, i) => `Aug ${i + 1}`),
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 15) + 5),
    label: "Daily Earnings (Last 30 Days)",
    xLabel: "Date",
  },
};

// --- Chart Creator ---
function createLineChart(ctx, { labels, data, label, xLabel }) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Earnings Overview" },
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (context) => `$${context.parsed.y}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Amount ($)" },
        },
        x: {
          title: { display: true, text: xLabel },
        },
      },
    },
  });
}

let earningsChart;
function renderChart(type = "daily") {
  const ctx = document.getElementById("earningsChart").getContext("2d");
  const config = chartData[type];
  if (earningsChart) earningsChart.destroy();
  earningsChart = createLineChart(ctx, config);
  const chartCanvas = document.getElementById("earningsChart");
  chartCanvas.classList.remove("chart-loaded");
  setTimeout(() => chartCanvas.classList.add("chart-loaded"), 100);
}

// --- Calendar Renderer ---
(function () {
  const grid = document.getElementById("activityCalendarGrid");
  if (!grid) return;
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let d = 0; d < 7; d++) {
    const cell = document.createElement("div");
    cell.style.background = "#d7efdf";
    cell.style.fontWeight = "bold";
    cell.style.textAlign = "center";
    cell.style.padding = "6px";
    cell.textContent = dayNames[d];
    grid.appendChild(cell);
  }

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.textContent = "";
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.textContent = d;
    cell.style.background = "#fff";
    cell.style.textAlign = "center";
    cell.style.padding = "10px";
    cell.style.borderRadius = "6px";
    cell.style.border = "1px solid #e0e0e0";
    if (d === today.getDate()) {
      cell.style.background = "#1abc9c";
      cell.style.color = "#fff";
      cell.style.fontWeight = "bold";
    }
    grid.appendChild(cell);
  }
})();
