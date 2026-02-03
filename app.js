const versionText = document.getElementById("versionText");
const statusText = document.getElementById("statusText");
const downloadBtn = document.getElementById("downloadBtn");
const statusBadge = document.getElementById("statusBadge");
const notesList = document.getElementById("notesList");
const vipStatusText = document.getElementById("vipStatus");
/* ==========================
   CONFIG
========================== */
const VERSION_JSON_URL =
  "https://raw.githubusercontent.com/Kaitoo-KT/FORKT-VIP/main/version.json";

const DOWNLOAD_URL =
  "https://raw.githubusercontent.com/Kaitoo-KT/FORKT-VIP/FORKT/FORKT%20PANEL.zip";
  
const VIP_JSON_URL =
  "https://raw.githubusercontent.com/Kaitoo-KT/FORKT-VIP/main/vip.json";
/* ==========================
   STATUS HELPER
========================== */
function checkVipStatusLocal() {
  const isVip = localStorage.getItem("forkt_vip_permanent") === "1";

  if (vipStatusText) {
    if (isVip) {
      vipStatusText.textContent = "VIP";
      vipStatusText.classList.remove("vip", "free");
      vipStatusText.classList.add(isVip ? "vip" : "free");
    } else {
      vipStatusText.textContent = "ACCEES";
      vipStatusText.classList.remove("vip", "free");
      vipStatusText.classList.add(isVip ? "vip" : "free");
    }
  }

  return isVip;
}
function setStatus(label, text, color, enable = false) {
  if (!statusBadge || !statusText || !downloadBtn) return;

  statusBadge.textContent = label;
  statusBadge.style.color = color;
  statusText.textContent = text;
  downloadBtn.disabled = !enable;
}


/* ==========================
   FETCH VERSION.JSON
========================== */
async function loadVersion() {
  setStatus("Checking", "Checking latest version...", "#ffd36b");
  versionText.textContent = "...";
  notesList.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch(VERSION_JSON_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load version.json");

    const data = await res.json();

    if (!data.version)
      throw new Error("Invalid version.json");

    // version
    versionText.textContent = data.version;

    // notes / changelog
    notesList.innerHTML = "";
    if (Array.isArray(data.notes) && data.notes.length > 0) {
      data.notes.forEach(note => {
        const li = document.createElement("li");
        li.textContent = note;
        notesList.appendChild(li);
      });
    } else {
      notesList.innerHTML = "<li>No changelog available</li>";
    }

    setStatus(
      "Ready",
      "Latest version available ✔",
      "#6bffb3",
      true
    );

  } catch (err) {
    console.error(err);
    versionText.textContent = "N/A";
    notesList.innerHTML = "<li>Failed to load changelog</li>";

    setStatus("Error", err.message, "#ff6b6b");
  }
}

/* ==========================
   DOWNLOAD
========================== */
downloadBtn.addEventListener("click", () => {
  setStatus("Downloading", "Downloading FORKT PANEL...", "#9f7bff");

  const a = document.createElement("a");
  a.href = DOWNLOAD_URL;
  a.download = "FORKT_PANEL.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => {
    setStatus("Done", "Download started ✔", "#6bffb3", true);
  }, 500);
});

/* ==========================
   INIT
========================== */
const IS_VIP = checkVipStatusLocal();
loadVersion();