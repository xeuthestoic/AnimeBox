/* =========================
   CONFIGURATION
========================= */

const DEFAULT_ANIMES = [
    {
        type: "anime",
        season: "S1",
        name: "Attack on Titan",
        total: 87,
        current: 87,
        status: "Terminé",
        cover: "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
    },
    {
        type: "anime",
        season: "S2",
        name: "Jujutsu Kaisen",
        total: 47,
        current: 30,
        status: "En cours",
        cover: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
    },
    {
        type: "manga",
        season: null,
        name: "Berserk",
        total: 364,
        current: 120,
        status: "En cours",
        cover: "https://cdn.myanimelist.net/images/manga/1/157897.jpg"
    }
];

let currentFilter = "Tous";
let searchQuery = "";
const content = document.getElementById("content");

/* =========================
   DATA
========================= */

function getData(){
    return JSON.parse(localStorage.getItem("animebox")) || [];
}

function saveData(data){
    localStorage.setItem("animebox", JSON.stringify(data));
}

function initDefaultAnimes(){
    if(!localStorage.getItem("animebox")){
        saveData(DEFAULT_ANIMES);
    }
}

/* =========================
   HOME
========================= */

function showHome(){
    content.innerHTML = `
        <h2>Bienvenue sur AnimeBox</h2>
        <p>Version 6.1</p>
        <div class="grid">
            ${getData().slice(0,6).map(a=>`
                <div class="card">
                    <img src="${a.cover}">
                </div>
            `).join("")}
        </div>
    `;
}

/* =========================
   LIBRARY
========================= */

function showLibrary(){
    let data = getData();

    if(currentFilter !== "Tous"){
        data = data.filter(a => a.status === currentFilter);
    }

    if(searchQuery){
        data = data.filter(a =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    content.innerHTML = `
        <div class="search-bar">
            <input 
                id="searchInput"
                type="text" 
                placeholder="Rechercher..."
                value="${searchQuery}"
                oninput="searchAnime(this.value)">
            ${searchQuery ? `<button class="clear-btn" onclick="clearSearch()">❌</button>` : ""}
        </div>

        <div class="filters">
            ${["Tous","En cours","Terminé","Abandonné","En attente"]
            .map(f=>`
                <button class="${currentFilter===f?'active':''}"
                    onclick="setFilter('${f}')">
                    ${f}
                </button>
            `).join("")}
        </div>

        <div class="grid">
            ${data.map(a=>`
                <div class="card">
                    <img src="${a.cover}">
                    <div style="padding:8px;font-size:12px;">
                        ${a.type === "anime" ? "🎬 Anime" : "📖 Manga"}
                        ${a.type === "anime" && a.season ? ` • ${a.season}` : ""}
                    </div>
                </div>
            `).join("")}
        </div>
    `;

    const input = document.getElementById("searchInput");
    if(input){
        input.focus();
        input.setSelectionRange(searchQuery.length, searchQuery.length);
    }
}

function searchAnime(q){
    searchQuery = q;
    showLibrary();
}

function clearSearch(){
    searchQuery = "";
    showLibrary();
}

function setFilter(f){
    currentFilter = f;
    showLibrary();
}

/* =========================
   ADD
========================= */

function toggleSeasonField(){
    const type = document.getElementById("type").value;
    const seasonContainer = document.getElementById("seasonContainer");
    seasonContainer.style.display = type === "anime" ? "block" : "none";
}

function saveAnime(){
    const file = document.getElementById("cover").files[0];
    const reader = new FileReader();

    reader.onload = function(){
        const data = getData();
        data.push({
            type: document.getElementById("type").value,
            season: document.getElementById("type").value === "anime"
                ? document.getElementById("season").value
                : null,
            name: document.getElementById("name").value,
            total: document.getElementById("total").value,
            current: document.getElementById("current").value,
            status: document.getElementById("status").value,
            cover: reader.result
        });
        saveData(data);
        closeModal();
        showLibrary();
    };

    if(file) reader.readAsDataURL(file);
}

/* =========================
   SETTINGS
========================= */

function openSettings(){
    document.getElementById("settingsModal").classList.remove("hidden");
}

function closeSettings(){
    document.getElementById("settingsModal").classList.add("hidden");
}

function closeModal(){
    document.getElementById("addModal").classList.add("hidden");
}

function exportJSON(){
    const blob = new Blob([JSON.stringify(getData())], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "animebox_backup.json";
    a.click();
}

function importJSON(event){
    const reader = new FileReader();
    reader.onload = function(){
        saveData(JSON.parse(reader.result));
        showLibrary();
        closeSettings();
    };
    reader.readAsText(event.target.files[0]);
}

/* =========================
   INIT
========================= */

document.getElementById("homeTab").onclick = showHome;
document.getElementById("libraryTab").onclick = showLibrary;
document.getElementById("addTab").onclick = () =>
    document.getElementById("addModal").classList.remove("hidden");

window.addEventListener("DOMContentLoaded", () => {
    initDefaultAnimes();
    toggleSeasonField();
    showHome();
});
