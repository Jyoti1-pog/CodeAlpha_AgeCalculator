flatpickr("#dob", {
  dateFormat: "Y-m-d",
  maxDate: "today",
  altInput: true,
  altFormat: "F j, Y",
});

const translations = {
  en: {
    title: "🎂 Age Calculator",
    subtitle: "Find out your exact age in years, months, and days",
    dobLabel: "Choose your date of birth:",
    calcBtn: "Calculate Age",
    voiceBtn: "🎤",
    noDob: "Please select your date of birth.",
    futureDob: "Date of birth cannot be in the future!",
    resultMsg: (y, m, d) => `🎉 You are ${y} years, ${m} months, and ${d} days old.`,
  },
  hi: {
    title: "🎂 आपकी उम्र ज्ञात करें",
    subtitle: "उम्र वर्ष, माह और दिन में जानें",
    dobLabel: "जन्म तिथि चुनें:",
    calcBtn: "उम्र निकालें",
    voiceBtn: "🎤",
    noDob: "कृपया जन्म तिथि चुनें।",
    futureDob: "भविष्य की तिथि नहीं हो सकती!",
    resultMsg: (y, m, d) => `🎉 आपकी उम्र है ${y} साल, ${m} माह और ${d} दिन।`,
  },
};

const langSelect = document.getElementById("langSelect");
const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const dobLabel = document.getElementById("dobLabel");
const calcBtn = document.getElementById("calcBtn");
const resultDiv = document.getElementById("result");
const voiceBtn = document.getElementById("voiceBtn");

langSelect.addEventListener("change", updateLanguage);
function updateLanguage() {
  const t = translations[langSelect.value];
  titleEl.textContent = t.title;
  subtitleEl.textContent = t.subtitle;
  dobLabel.textContent = t.dobLabel;
  calcBtn.textContent = t.calcBtn;
  voiceBtn.textContent = t.voiceBtn;
}
updateLanguage();

document.getElementById("ageForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const dobInput = document.getElementById("dob").value;
  if (!dobInput) return resultDiv.textContent = translations[langSelect.value].noDob;

  const dob = new Date(dobInput);
  const today = new Date();
  if (dob > today) return resultDiv.textContent = translations[langSelect.value].futureDob;

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  resultDiv.textContent = translations[langSelect.value].resultMsg(years, months, days);
});

// Voice Input
voiceBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = langSelect.value === "hi" ? "hi-IN" : "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript.trim();
    const date = Date.parse(spokenText);
    if (!isNaN(date)) {
      const dt = new Date(date);
      const formatted = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
      document.getElementById("dob")._flatpickr.setDate(formatted, true);
      resultDiv.textContent = "";
    } else {
      resultDiv.textContent = langSelect.value === "hi"
        ? "कृपया एक मान्य तिथि बोलें।"
        : "Please speak a valid date.";
    }
  };
});

// Theme toggle
document.getElementById("modeToggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark", e.target.checked);
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}





