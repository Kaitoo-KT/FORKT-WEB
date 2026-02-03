/* ==========================
   ELEMENT
========================== */
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

/* ==========================
   GLOBAL STATE
========================== */
let CURRENT_VERSION = null;

/* ==========================
   VIP LOCAL
========================== */
function checkVipStatusLocal() {
  const isVip = localStorage.getItem("forkt_vip_permanent") === "1";

  if (!vipStatusText) return isVip;

  vipStatusText.textContent = isVip ? "VIP" : "ACCESS";
  vipStatusText.classList.remove("vip", "free");
  vipStatusText.classList.add(isVip ? "vip" : "free");

  return isVip;
}

/* ==========================
   STATUS UI
========================== */
function setStatus(label, text, color, enable = false) {
  if (!statusBadge || !statusText || !downloadBtn) return;

  statusBadge.textContent = label;
  statusBadge.style.color = color;
  statusText.textContent = text;
  downloadBtn.disabled = !enable;
}

/* ==========================
   LOAD VERSION
========================== */
async function loadVersion() {
  setStatus("Checking", "Checking latest version...", "#ffd36b");
  versionText.textContent = "...";
  notesList.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch(VERSION_JSON_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch version");

    const data = await res.json();
    if (!data.version) throw new Error("Invalid version.json");

    // SET VERSION
    CURRENT_VERSION = data.version;
    versionText.textContent = CURRENT_VERSION;

    // CHANGELOG
    notesList.innerHTML = "";
    if (Array.isArray(data.notes) && data.notes.length) {
      data.notes.forEach(note => {
        const li = document.createElement("li");
        li.textContent = note;
        notesList.appendChild(li);
      });
    } else {
      notesList.innerHTML = "<li>No changelog available</li>";
    }

    setStatus("Ready", "Latest version available ✔", "#6bffb3", true);

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
if (downloadBtn) {
  downloadBtn.addEventListener("click", async () => {
  if (!CURRENT_VERSION) {
    alert("Version not loaded yet");
    return;
  }

  const filename = `FORKT-PANEL(${CURRENT_VERSION}).zip`;

  setStatus(
    "Downloading",
    `Downloading FORKT PANEL v${CURRENT_VERSION}...`,
    "#9f7bff"
  );

  try {
    const res = await fetch(DOWNLOAD_URL);
    if (!res.ok) throw new Error("Download failed");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

    setStatus(
      "Done",
      `Download completed ✔ (${filename})`,
      "#6bffb3",
      true
    );

  } catch (err) {
    console.error(err);
    setStatus("Error", "Failed to download file", "#ff6b6b");
  }
});
}

/* ==========================
   INIT
========================== */
checkVipStatusLocal();
loadVersion();