// Simulated user database with roles
const users = {
  ataur: { password: "1234", role: "admin" },
  arahman: { password: "1234", role: "admin" },
  rakib: { password: "7388", role: "moderator" },
  abdullah: { password: "7388", role: "moderator" },
};

function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  // 🔐 Check if device is blocked
  const blocked = localStorage.getItem("loginBlocked");
  if (blocked === "true") {
    errorMsg.textContent =
      "⚠️ This device is blocked due to multiple failed attempts.";
    return;
  }

  // ✅ Valid login
  if (users[user] && users[user].password === pass) {
    const role = users[user].role;
    sessionStorage.setItem("role", role);
    localStorage.removeItem("loginAttempts"); // reset on success

    setTimeout(() => {
      window.location.href =
        role === "admin" ? "admin-dashboard.html" : "mDashboard.html";
    }, 100);
  } else {
    let attempts = parseInt(localStorage.getItem("loginAttempts") || "0");
    attempts++;
    localStorage.setItem("loginAttempts", attempts);

    if (attempts >= 3) {
      localStorage.setItem("loginBlocked", "true");

      const blockLog = {
        deviceId: navigator.userAgent,
        reason: "3 failed logins",
        time: new Date().toISOString(),
      };

      fetch("/api/device-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blockLog),
      }).then((res) => {
        if (res.ok) {
          console.log("✅ Block logged to server");
        } else {
          console.warn("⚠️ Failed to log block");
        }
      });

      errorMsg.textContent =
        "🚫 Too many failed attempts. Device is now blocked.";
    } else {
      errorMsg.textContent = `❌ Invalid login (${attempts}/3 attempts used)`;
    }

    // if (attempts >= 3) {
    //   localStorage.setItem("loginBlocked", "true");
    //   errorMsg.textContent =
    //     "🚫 Too many failed attempts. Device is now blocked.";
    // } else {
    //   errorMsg.textContent = `❌ Invalid login (${attempts}/3 attempts used)`;
    // }
  }

  const loginSuccess = users[user] && users[user].password === pass;

  const log = {
    user: user,
    time: new Date().toISOString(),
    status: loginSuccess ? "success" : "failed",
    device: navigator.userAgent,
  };

  let logs = JSON.parse(localStorage.getItem("loginLogs") || "[]");
  logs.push(log);
  localStorage.setItem("loginLogs", JSON.stringify(logs));
}
