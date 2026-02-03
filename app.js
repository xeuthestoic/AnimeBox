/* =========================
   SUGGESTIONS PAR DÉFAUT
========================= */

const DEFAULT_ANIMES = [
    {
        type: "anime",
        season: "S1",
        name: "Attack on Titan",
        total: 87,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
        link: "https://example.com/jjk"
    },
    {
        type: "anime",
        season: "S2",
        name: "Jujutsu Kaisen",
        total: 47,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
        link: "https://example.com/jjk"
    },
    {
        type: "manga",
        season: null,
        name: "Berserk",
        total: 364,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/manga/1/157897.jpg",
        link: "https://example.com/jjk"
    }
];

const APP_VERSION = "v1.5";

let currentFilter = "Tous";
let searchQuery = "";
let editIndex = null;
let toastTimeout = null;

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

/* =========================
   HOME
========================= */

function showHome(){
    content.innerHTML = `
        <h2>Suggestions</h2>
        <p>Clique pour ajouter à ta bibliothèque</p>

        <div class="grid">
            ${DEFAULT_ANIMES.map((a,i)=>`
                <div class="card" onclick="addDefaultAnime(${i})">
                    <img src="${a.cover}">
                    <div style="padding:8px;font-size:13px;">
                        ${a.name}
                        ${a.type === "anime" && a.season ? ` • ${a.season}` : ""}
                    </div>
                </div>
            `).join("")}
        </div>

        <div class="app-version">
            AnimeBox ${APP_VERSION}
        </div>
    `;
}

function addDefaultAnime(index){
    const data = getData();
    const anime = DEFAULT_ANIMES[index];

    const exists = data.find(a => 
        a.name === anime.name &&
        a.season === anime.season
    );

    if(!exists){
        data.push({...anime});
        saveData(data);
        showToast("✅ | Ajouté à ta bibliothèque");
    } else {
        showToast("⚠️ | Déjà dans ta bibliothèque");
    }
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
            ${data.map((a,i)=>`
                <div class="card" onclick="openEdit(${i})">
                    <img src="${a.cover}">
                    <div style="padding:8px;font-size:13px;">
                        <strong>${a.name}</strong>
                        ${a.type === "anime" && a.season ? ` • ${a.season}` : ""}
                        <br>
                        ${a.type === "anime"
                            ? `🎬 | Épisode ${a.current} / ${a.total}`
                            : `📖 | Chapitre ${a.current} / ${a.total}`}
                        ${a.link ? `
                            <br>
                            <a href="${a.link}" 
                               target="_blank" 
                               onclick="event.stopPropagation()"
                               style="color:#60a5fa;text-decoration:none;">
                               🔗 Ouvrir
                            </a>
                        ` : ""}
                    </div>
                </div>
            `).join("")}
        </div>
    `;
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
   EDIT
========================= */

function openEdit(index){
    const data = getData();
    const anime = data[index];

    editIndex = index;

    document.getElementById("type").value = anime.type;
    document.getElementById("name").value = anime.name;
    document.getElementById("total").value = anime.total;
    document.getElementById("current").value = anime.current;
    document.getElementById("status").value = anime.status;
    document.getElementById("link").value = anime.link || "";

    if(anime.type === "anime"){
        document.getElementById("season").value = anime.season || "";
    }

    toggleSeasonField();

    document.querySelector(".primary").textContent = "Mettre à jour";

    document.getElementById("addModal").classList.remove("hidden");
}

/* =========================
   ADD / UPDATE
========================= */

function toggleSeasonField(){
    const type = document.getElementById("type").value;
    const seasonContainer = document.getElementById("seasonContainer");
    seasonContainer.style.display = type === "anime" ? "block" : "none";
}

function saveAnime(){
    const data = getData();
    const type = document.getElementById("type").value;

    const newData = {
        type: type,
        season: type === "anime"
            ? document.getElementById("season").value
            : null,
        name: document.getElementById("name").value,
        total: document.getElementById("total").value,
        current: document.getElementById("current").value,
        status: document.getElementById("status").value,
        link: document.getElementById("link").value || null,
        cover: editIndex !== null ? data[editIndex].cover : ""
    };

    if(editIndex !== null){
        data[editIndex] = newData;
        editIndex = null;
    } else {
        const file = document.getElementById("cover").files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = function(){
                newData.cover = reader.result;
                data.push(newData);
                saveData(data);
                showLibrary();
            };
            reader.readAsDataURL(file);
            closeModal();
            return;
        }
        data.push(newData);
    }

    saveData(data);
    closeModal();
    showLibrary();

    document.querySelector(".primary").textContent = "Ajouter";
}

/* =========================
   SETTINGS
========================= */

function openSettings(){
    const modal = document.getElementById("settingsModal");

    modal.classList.remove("hidden");

    // Affiche la version
    document.getElementById("settingsVersion").textContent = APP_VERSION;
}

function closeSettings(){
    const modal = document.getElementById("settingsModal");
    modal.classList.add("hidden");
    modal.style.display = "none";
}

function closeModal(){
    const modal = document.getElementById("addModal");

    modal.classList.add("hidden");

    editIndex = null;

    document.querySelector(".primary").textContent = "Ajouter";

    // Reset formulaire
    document.getElementById("name").value = "";
    document.getElementById("total").value = "";
    document.getElementById("current").value = "";
    document.getElementById("season").value = "";
    document.getElementById("link").value = "";
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

function resetData(){
    localStorage.removeItem("animebox");
    closeSettings();
    showToast("🗑 | Données réinitialisées");
    showLibrary();
}

/* =========================
   TOAST SYSTEM
========================= */

function showToast(message){
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    toastMessage.textContent = message;

    toast.classList.remove("hidden");
    toast.style.opacity = "1";

    if(toastTimeout){
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
            toast.classList.add("hidden");
        }, 200);
    }, 2000);
}

function closeToast(){
    const toast = document.getElementById("toast");

    if(toastTimeout){
        clearTimeout(toastTimeout);
    }

    toast.classList.add("hidden");
}


/* =========================
   INIT
========================= */

document.getElementById("homeTab").onclick = showHome;
document.getElementById("libraryTab").onclick = showLibrary;
document.getElementById("addTab").onclick = () => {
    const modal = document.getElementById("addModal");
    modal.classList.remove("hidden");
    modal.style.display = "flex";
};

window.addEventListener("DOMContentLoaded", () => {
    toggleSeasonField();
    showHome();
});
