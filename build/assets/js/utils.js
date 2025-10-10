// utils.js
async function fetchCountries(staticCountries) {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    if (!res.ok) throw new Error("API failed");
    const data = await res.json();
    return data.map((c) => c.name.common).sort();
  } catch (err) {
    console.warn("Using static fallback:", err.message);
    return staticCountries;
  }
}

// utils.js
async function fetchDialingCode(name, staticDialingCodes) {
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

// utils.js
async function getcountryISO(name, countryISOMap) {
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

// utils.js
async function validatePhoneOnline(
  fullNumber,
  countryName,
  phoneValidationCache,
  getcountryISO
) {
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

// utils.js
async function validatePhoneNumber(
  countryName,
  code,
  number,
  phonePatterns,
  validatePhoneOnline
) {
  const fullNumber = code + number;
  const pattern = phonePatterns[countryName];
  if (pattern?.test(fullNumber)) return true; // Local validation
  if (!/^\+\d{10,14}$/.test(fullNumber)) return false; // Basic format check
  try {
    return await validatePhoneOnline(fullNumber, countryName);
  } catch (err) {
    console.warn("Phone validation failed, using fallback:", err.message);
    return false; // Fallback to invalid
  }
}

export {
  fetchCountries,
  fetchDialingCode,
  getcountryISO,
  validatePhoneOnline,
  validatePhoneNumber,
};
