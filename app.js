/* ==========================
   ELEMENT
========================== */
const versionText   = document.getElementById("versionText");
const statusText    = document.getElementById("statusText");
const downloadBtn   = document.getElementById("downloadBtn");
const progressFill  = document.getElementById("progressFill");
const progressText  = document.getElementById("progressText");
const statusBadge   = document.getElementById("statusBadge");
const notesList     = document.getElementById("notesList");
const vipStatusText = document.getElementById("vipStatus");

/* ==========================
   CONFIG
========================== */
const VERSION_JSON_URL =
"https://raw.githubusercontent.com/Kaitoo-KT/FORKT-VIP/main/version.json";

const DOWNLOAD_URL =
"https://raw.githubusercontent.com/Kaitoo-KT/FORKT-VIP/FORKT/FORKT%20PANEL.zip";

const MAX_NOTES = 20;

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
  vipStatusText.className = "badge " + (isVip ? "vip" : "free");

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
   RENDER CHANGELOG
========================== */
function renderNotes(notes){

  if(!Array.isArray(notes) || !notes.length){
    notesList.innerHTML = "<li>No changelog available</li>";
    return;
  }

  const limited = notes.slice(0, MAX_NOTES);

  notesList.innerHTML = limited
    .map(note => `<li><span class="arrow">➜</span>${note}</li>`)
    .join("");

}

/* ==========================
   LOAD VERSION
========================== */
async function loadVersion(){

  setStatus("Checking","Checking latest version...","#ffd36b");

  versionText.textContent = "...";
  notesList.innerHTML = "<li>Loading...</li>";

  try{

    const res = await fetch(VERSION_JSON_URL,{cache:"no-store"});
    if(!res.ok) throw new Error("Failed to fetch version");

    const data = await res.json();

    CURRENT_VERSION = data.version || "N/A";
    versionText.textContent = CURRENT_VERSION;

    renderNotes(data.notes);

    setStatus("Ready","Latest version available ✔","#6bffb3",true);

  }catch(err){

    console.error(err);

    versionText.textContent = "N/A";
    notesList.innerHTML = "<li>Failed to load changelog</li>";

    setStatus("Error",err.message,"#ff6b6b");

  }

}

/* ==========================
   DOWNLOAD
========================== */
if(downloadBtn){

downloadBtn.addEventListener("click",()=>{

  if(!CURRENT_VERSION){
    alert("Version not loaded yet");
    return;
  }

  const filename = `FORKT-PANEL(${CURRENT_VERSION}).zip`;

  setStatus(
    "Downloading",
    `Downloading FORKT PANEL v${CURRENT_VERSION}...`,
    "#9f7bff"
  );

  progressFill.style.width="100%";
  progressText.textContent="Starting...";

  const a=document.createElement("a");
  a.href=DOWNLOAD_URL;
  a.download=filename;

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(()=>{

    progressText.textContent="Complete ✓";

    setStatus(
      "Done",
      `Download started ✔ (${filename})`,
      "#6bffb3",
      true
    );

  },600);

});

}

/* ==========================
   INIT
========================== */
checkVipStatusLocal();
loadVersion();