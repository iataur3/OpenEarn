import {
  fetchCountries,
  fetchDialingCode,
  getcountryISO,
  validatePhoneOnline,
  validatePhoneNumber,
} from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const countryInput = document.getElementById("s-country");
  const suggestionBox = document.getElementById("s-country_suggestions");
  const countryCodePrefix = document.getElementById("s-countryCodePrefix");
  const phoneInput = document.getElementById("phone");
  const errorPhone = document.getElementById("error_phone");

  const staticCountries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
  ];

  const staticDialingCodes = {
    Bangladesh: "+880",
    India: "+91",
    "United States": "+1",
    "United Kingdom": "+44",
    Canada: "+1",
  };
  const countryISOMap = {
    Bangladesh: "BD",
    India: "IN",
    "United States": "US",
    "United Kingdom": "GB",
    Canada: "CA",
  };
  const phonePatterns = {
    Bangladesh: /^\+8801[3-9]\d{8}$/,
    India: /^\+91[6-9]\d{9}$/,
    "United States": /^\+1\d{10}$/,
    "United Kingdom": /^\+44\d{10}$/,
    Canada: /^\+1\d{10}$/,
  };

  let countryList = [];
  const phoneValidationCache = {};

  countryList = await fetchCountries(staticCountries);

  countryInput.addEventListener("input", async function () {
    const query = this.value.toLowerCase();
    suggestionBox.innerHTML = "";
    if (!query) {
      suggestionBox.style.display = "none";
      countryCodePrefix.textContent = "";
      return;
    }
    const matches = countryList
      .filter((name) => name.toLowerCase().includes(query))
      .slice(0, 10);
    if (matches.length === 0) {
      suggestionBox.innerHTML = `<div class="suggestion-item">No country found</div>`;
      suggestionBox.style.display = "block";
      countryCodePrefix.textContent = "";
      return;
    }
    matches.forEach((name) => {
      const div = document.createElement("div");
      div.textContent = name;
      div.classList.add("suggestion-item");
      div.addEventListener("click", async () => {
        countryInput.value = name;
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";
        const code = await fetchDialingCode(name, staticDialingCodes);
        countryCodePrefix.textContent = code;
      });
      suggestionBox.appendChild(div);
    });
    suggestionBox.style.display = "block";
  });

  document.addEventListener("click", function (e) {
    if (!suggestionBox.contains(e.target) && e.target !== countryInput) {
      suggestionBox.innerHTML = "";
      suggestionBox.style.display = "none";
    }
  });

  phoneInput.addEventListener("blur", async function () {
    const code = countryCodePrefix.textContent.trim();
    const number = phoneInput.value.trim();
    const countryName = countryInput.value.trim();
    if (!code || !number || !countryName) {
      errorPhone.textContent = "Please select a country and enter phone number";
      return;
    }
    const isValid = await validatePhoneNumber(
      countryName,
      code,
      number,
      phonePatterns,
      validatePhoneOnline
    );
    errorPhone.textContent = isValid
      ? ""
      : `Invalid phone number: ${code}${number}`;
  });
  showSection("signup");
});

// 🔄 Section toggle
function showSection(id) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
  if (id === "confirmation") loadConfirmation();
}
window.showSection = showSection; // Exposing to global scope

// 🍞 Toast
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "show";
  setTimeout(() => (t.className = ""), 3000);
}

// 📝 Signup validation
const fields = [
  "s-full-name",
  "s-father-name",
  "s-mother-name",
  "s-marital-status",
  "s-dob",
  "s-religion",
  "s-profession",
  "s-country",
  "s-state",
  "s-district",
  "s-policeStation",
  "s-unionWord",
  "s-village",
  "phone",
  "email",
  "password",
  "confirmPassword",
];

fields.forEach((id) => {
  const input = document.getElementById(id);
  const errorDiv = document.getElementById("error_" + id);
  if (!input) return;
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      errorDiv.textContent = "";
      input.classList.remove("input-error");
    }
  });
  if (input.tagName === "SELECT") {
    input.addEventListener("change", () => {
      if (input.value.trim() !== "") {
        errorDiv.textContent = "";
        input.classList.remove("input-error");
      }
    });
  }
});

document
  .getElementById("signup-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    let hasError = false;
    const data = {};

    fields.forEach((id) => {
      const input = document.getElementById(id);
      const value = input?.value?.trim() || "";
      const errorDiv = document.getElementById("error_" + id);
      errorDiv.textContent = "";
      input?.classList?.remove("input-error");
      if (!value) {
        errorDiv.textContent = "This field is required";
        input?.classList?.add("input-error");
        hasError = true;
      } else {
        data[id] = value;
      }
    });

    // const code = countryCodePrefix.textContent.trim();
    // const number = phoneInput.value.trim();
    // const countryName = countryInput.value.trim();

    // if (!code || !number || !countryName) {
    //   errorPhone.textContent = "Please select a country and enter phone number";
    //   return;
    // }

    // data.phone = `${code}${number}`; // Save phone number with country code

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      const input = document.getElementById("email");
      const errorDiv = document.getElementById("error_email");
      errorDiv.textContent = "Invalid email address";
      input.classList.add("input-error");
      hasError = true;
    }

    if (data.password.length < 4) {
      const input = document.getElementById("password");
      const errorDiv = document.getElementById("error_password");
      errorDiv.textContent = "Password must be at least 4 characters";
      input.classList.add("input-error");
      hasError = true;
    }

    if (data.password !== data.confirmPassword) {
      const input = document.getElementById("confirmPassword");
      const errorDiv = document.getElementById("error_confirmPassword");
      errorDiv.textContent = "Passwords do not match";
      input.classList.add("input-error");
      hasError = true;
    }

    if (hasError) {
      showToast("Please fix the errors before submitting.");
      return;
    }

    localStorage.setItem("signupData", JSON.stringify(data));
    showToast("Welcome");
    setTimeout(() => showSection("confirmation"), 1500);
  });

// 👁️ Password toggle icon
function togglePassword(id, icon) {
  const input = document.getElementById(id);
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  icon.textContent = isHidden ? "🔒" : "👁️";
}
window.togglePassword = togglePassword;

// 📋 Confirmation loader
function loadConfirmation() {
  const raw = localStorage.getItem("signupData");
  let data = {};
  try {
    data = JSON.parse(raw) || {};
  } catch (err) {
    console.warn("Invalid signup data:", err.message);
  }

  const table = document.getElementById("dataTable");
  const noData = document.getElementById("noData");

  if (!Object.keys(data).length) {
    noData.style.display = "block";
    table.style.display = "none";
    return;
  }

  const keys = [
    "s-full-name",
    "s-father-name",
    "s-mother-name",
    "s-marital-status",
    "s-dob",
    "s-religion",
    "s-profession",
    "s-country",
    "s-state",
    "s-district",
    "s-policeStation",
    "s-unionWord",
    "s-village",
    "phone",
    "email",
    "password",
  ];

  keys.forEach((key) => {
    const cell = document.getElementById("val_" + key);
    let val = data[key] || "";
    if (key === "password") val = "********";
    if (key === "s-marital-status" || key === "s-religion") {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    cell.textContent = val;
  });

  table.style.display = "table";
  noData.style.display = "none";
}

// // public/assets/js/public-signup.js
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const express = require("express");

// admin.initializeApp();

// const app = express();
// app.use(express.json()); // ✅ Body parser

// app.post("/submitSignup", async (req, res) => {
//   try {
//     const data = req.body;
//     if (!data.name || !data.email || !data.phone) {
//       return res.status(400).send({ success: false, error: "Missing fields" });
//     }

//     await admin.firestore().collection("signups").add(data);
//     res.send({ success: true });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).send({ success: false });
//   }
// });

// exports.submitSignup = functions.https.onRequest(app);
