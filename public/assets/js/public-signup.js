// public/assets/js/public-signup.js
document.addEventListener("DOMContentLoaded", function () {
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

  async function fetchCountries() {
    try {
      const res = await fetch("https://restcountries.com/v3.1/all");
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      countryList = data.map((c) => c.name.common).sort();
    } catch (err) {
      console.warn("Using static fallback:", err.message);
      countryList = staticCountries;
    }
  }

  async function fetchDialingCode(name) {
    if (staticDialingCodes[name]) return staticDialingCodes[name];
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(
          name
        )}?fullText=true`
      );
      if (!res.ok) throw new Error("Dialing code API failed");
      const data = await res.json();
      return data[0]?.idd?.root + (data[0]?.idd?.suffixes?.[0] || "") || "";
    } catch (err) {
      console.warn("Fallback dialing code:", err.message);
      return "";
    }
  }

  async function getcountryISO(name) {
    if (countryISOMap[name]) return countryISOMap[name];
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(
          name
        )}?fullText=true`
      );
      if (!res.ok) throw new Error("ISO API failed");
      const data = await res.json();
      return data[0]?.cca2 || "BD";
    } catch (err) {
      console.warn("Fallback ISO:", err.message);
      return "BD";
    }
  }

  async function validatePhoneOnline(fullNumber, countryName) {
    if (phoneValidationCache[fullNumber] !== undefined)
      return phoneValidationCache[fullNumber];
    try {
      const API_KEY = "5b422e31d9734c7ca1d61bb93b29ddfb";
      const countryCode = await getcountryISO(countryName);
      const res = await fetch(
        `https://phonevalidation.abstractapi.com/v1/?api_key=${API_KEY}&phone=${fullNumber}&country_code=${countryCode}`
      );
      const data = await res.json();
      const isValid = data.valid === true;
      phoneValidationCache[fullNumber] = isValid;
      return isValid;
    } catch (err) {
      console.warn("API validation failed:", err.message);
      phoneValidationCache[fullNumber] = false;
      return false;
    }
  }

  async function validatePhoneNumber(countryName, code, number) {
    const fullNumber = code + number;
    const pattern = phonePatterns[countryName];
    if (pattern?.test(fullNumber)) return true;
    if (!/^\+\d{10,14}$/.test(fullNumber)) return false;
    return await validatePhoneOnline(fullNumber, countryName);
  }

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
        const code = await fetchDialingCode(name);
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
    const isValid = await validatePhoneNumber(countryName, code, number);
    errorPhone.textContent = isValid
      ? ""
      : `Invalid phone number: ${code}${number}`;
  });

  fetchCountries();
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
  // if (id === "login") bindLoginToggle();
}

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
    /*
      if (data.phone && !/^01[3-9]\d{8}$/.test(data.phone)) {
        const input = document.getElementById("phone");
        const errorDiv = document.getElementById("error_phone");
        errorDiv.textContent = "Invalid phone number";
        input.classList.add("input-error");
        hasError = true;
      }
        */

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      const input = document.getElementById("email");
      const errorDiv = document.getElementById("error_email");
      errorDiv.textContent = "Invalid email address";
      input.classList.add("input-error");
      hasError = true;
    }

    if (data.password.length < 8) {
      const input = document.getElementById("password");
      const errorDiv = document.getElementById("error_password");
      errorDiv.textContent = "Password must be at least 8 characters";
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
    showToast("Signup successful!");
    setTimeout(() => showSection("confirmation"), 1500);
  });

function togglePassword(id, icon) {
  const input = document.getElementById(id);
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  icon.textContent = isHidden ? "👁️" : "👁️";
}

// 📋 Confirmation loader
function loadConfirmation() {
  const raw = localStorage.getItem("signupData");
  const table = document.getElementById("dataTable");
  const noData = document.getElementById("noData");

  if (!raw) {
    noData.style.display = "block";
    table.style.display = "none";
    return;
  }

  const data = JSON.parse(raw);
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
