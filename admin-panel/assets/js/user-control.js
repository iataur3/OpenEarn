// ✅ 2. Users array
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+88012345678",
    status: "moderator",
    fridge: false,
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    phone: "+88012345678",
    status: "unverified",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+88087654321",
    status: "waiting",
  },
  {
    id: 4,
    name: "Rahim Uddin",
    email: "rahim@example.com",
    phone: "+88011223344",
    status: "verified",
  },
  {
    id: 5,
    name: "Sadia Akter",
    email: "sadia@example.com",
    phone: "+8801987654321",
    status: "verified",
    fridge: false,
    previousStatus: null,
  },
  {
    id: 6,
    name: "Rafiul Islam",
    email: "rafi@example.com",
    phone: "+8801787654321",
    status: "unverified",
    fridge: false,
  },
  {
    id: 7,
    name: "John Doe",
    email: "john@example.com",
    phone: "+88012345678",
    status: "verified",
    fridge: false,
    previousStatus: null,
  },
];

//user id serial
let nextId = users.length + 1;
function addUser(name, email, phone, status) {
  users.push({
    id: nextId++,
    name,
    email,
    phone,
    status,
    fridge: false,
    previousStatus: null,
  });
  renderUsers(status);
  markActiveButton(status);
}

// ✅ 3. Render users function
function renderUsers(filterStatus = null) {
  userTableBody.innerHTML = "";

  users.forEach((user) => {
    if (filterStatus && user.status !== filterStatus) return;

    const row = document.createElement("tr");
    let actionButtons = "";

    switch (user.status) {
      case "moderator":
        actionButtons = `
          <button class="action fridge" onclick="toggleFridge(${user.id})">${
          user.fridge ? "Unfridge" : "Fridge"
        }</button>
          <button class="action delete" onclick="deleteModerator(${
            user.id
          })">Delete</button>
        `;
        break;

      case "waiting":
        actionButtons = `
          <button class="action approve" onclick="approveUser(${user.id})">Approve</button>
          <button class="action reject" onclick="rejectUser(${user.id})">Reject</button>
        `;
        break;

      case "verified":
        actionButtons = `
          <button class="action mod" onclick="makeModerator(${user.id})">Moderator</button>
          <button class="action delete" onclick="deleteUser(${user.id})">Delete</button>
        `;
        break;

      case "unverified":
        actionButtons = `
          <button class="action fridge" onclick="toggleFridge(${user.id})">
            ${user.fridge ? "Unfridge" : "Fridge"}
          </button>
          <button class="action delete" onclick="deleteUnverified(${
            user.id
          })">Delete</button>
        `;
        break;

      case "deleted":
        actionButtons = `
          <button class="action restore" onclick="restoreUser(${user.id})">Restore</button>
          <button class="action clear" onclick="clearUser(${user.id})">Clear</button>
        `;
        break;

      default:
        actionButtons = `
          <button class="action delete" onclick="softDeleteUser(${
            user.id
          })">Delete</button>
            ${
              user.status === "verified"
                ? `<button class="action mod" onclick="makeModerator(${user.id})">Moderator</button>`
                : ""
            }
            ${
              ["moderator", "unverified"].includes(user.status)
                ? `
          <button class="action fridge" onclick="toggleFridge(${user.id})">${
                    user.fridge ? "Unfridge" : "Fridge"
                  }</button>`
                : ""
            }
      `;
    }

    row.innerHTML = `
        <td>${user.id}</td>
        <td class="user-name">${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${actionButtons}</td>
      `;

    userTableBody.appendChild(row);
  });

  document.querySelectorAll(".user-name").forEach((cell) => {
    cell.addEventListener("click", () => {
      const name = cell.textContent;
      alert(`🔍 Opening account for ${name}`);
    });
  });
}

function softDeleteUser(id) {
  const user = users.find((u) => u.id === id);
  if (user) {
    user.previousStatus = user.status;
    user.status = "deleted";
    renderUsers("deleted");
    markActiveButton("deleted");
  }
}

function restoreUser(id) {
  const user = users.find((u) => u.id === id && u.status === "deleted");
  if (user && user.previousStatus) {
    user.status = user.previousStatus;
    user.previousStatus = null;
    renderUsers("deleted");
    markActiveButton("deleted");
  }
}

function clearUser(id) {
  const index = users.findIndex((u) => u.id === id && u.status === "deleted");
  if (index !== -1) {
    users.splice(index, 1);
    renderUsers("deleted");
    markActiveButton("deleted");
  }
}

function makeModerator(id) {
  const user = users.find((u) => u.id === id && u.status === "verified");
  if (user) {
    user.status = "moderator";
    renderUsers("verified");
    markActiveButton("verified");
  }
}

function toggleFridge(id) {
  const user = users.find(
    (u) => u.id === id && ["moderator", "unverified"].includes(u.status)
  );
  if (user) {
    user.fridge = !user.fridge;
    renderUsers(user.status);
    markActiveButton(user.status === "moderator" ? "groupM" : "unverified");
  }
}
function deleteUser(id) {
  softDeleteUser(id);
}
function deleteModerator(id) {
  softDeleteUser(id);
}
function deleteUnverified(id) {
  softDeleteUser(id);
}

// Mark Active Button
function markActiveButton(statusClass) {
  document.querySelectorAll(".status-buttons").forEach((btn) => {
    btn.classList.remove("active");
  });

  const targetBtn = document.querySelector(`.status-buttons.${statusClass}`);
  if (targetBtn) {
    targetBtn.classList.add("active");
  }
}

function approveUser(id) {
  const user = users.find((u) => u.id === id);
  if (user) user.status = "verified";

  renderUsers("waiting");
  markActiveButton("waiting");
}

function rejectUser(id) {
  const index = users.findIndex((u) => u.id === id && u.status === "waiting");
  if (index !== -1) users.splice(index, 1);

  renderUsers("waiting");
  markActiveButton("waiting");
}

// button handlers

document.querySelector(".groupM").addEventListener("click", () => {
  renderUsers("moderator");
  markActiveButton("groupM");
});
document.querySelector(".deleted").addEventListener("click", () => {
  renderUsers("deleted");
  markActiveButton("deleted");
});

document.querySelector(".verified").addEventListener("click", () => {
  renderUsers("verified");
  markActiveButton("verified");
});

document.querySelector(".waiting").addEventListener("click", () => {
  renderUsers("waiting");
  markActiveButton("waiting");
});

document.querySelector(".unverified").addEventListener("click", () => {
  renderUsers("unverified");
  markActiveButton("unverified");
});
// search functionality
searchBtn.addEventListener("click", () => {
  const q = searchInput.value.trim().toLowerCase();
  document.querySelectorAll("tbody tr").forEach((row) => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(q) ? "" : "none";
  });
});
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
renderUsers("waiting"); // initial load
markActiveButton("waiting"); // default button highlight
