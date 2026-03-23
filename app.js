/* =========================
   SUGGESTIONS PAR DÉFAUT
========================= */

const DEFAULT_ANIMES = [
   {
        type: "anime",
        season: "Final Season",
        name: "Attack on Titan",
        total: 87,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
        link: ""
   },
   {
        type: "anime",
        season: "S2",
        name: "Jujutsu Kaisen",
        total: 47,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
        link: ""
   },
   {
        type: "manga",
        season: null,
        name: "Magic Emperor",
        total: 803,
        current: 0,
        status: null,
        cover: "https://static.scan-manga.com/img/manga/Magic_Emperor_1_2392.jpg",
        link: "https://anime-sama.tv/catalogue/magic-emperor/"
    },
      {
        type: "manga",
        season: null,
        name: "Overgeared",
        total: 297,
        current: 0,
        status: null,
        cover: "https://raw.githubusercontent.com/Anime-Sama/IMG/img/contenu/overgeared.jpg",
        link: "https://anime-sama.tv/catalogue/overgeared/"
    },
    {
        type: "manga",
        season: null,
        name: "The Beginning After The End",
        total: 225,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/anime/1712/148299.jpg",
        link: "https://anime-sama.tv/catalogue/the-beginning-after-the-end/"
    },
    {
        type: "anime",
        season: "S1",
        name: "Chainsaw Man",
        total: 12,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
        link: ""
    },
    {
        type: "anime",
        season: "S1",
        name: "Frieren",
        total: 28,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
        link: ""
    },
    {
        type: "anime",
        season: "S1",
        name: "Demon Slayer",
        total: 55,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
        link: ""
    },
    {
        type: "anime",
        season: "S1",
        name: "Blue Lock",
        total: 24,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/anime/1258/126929.jpg",
        link: ""
    },
    {
        type: "anime",
        season: "S1",
        name: "My Hero Academia",
        total: 138,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
        link: ""
    },
    {
        type: "manga",
        season: null,
        name: "Berserk",
        total: 364,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/manga/1/157897.jpg",
        link: ""
    },
    {
        type: "manhwa",
        season: null,
        name: "Solo Leveling",
        total: 200,
        current: 0,
        status: null,
        cover: "https://cdn.myanimelist.net/images/manga/3/222295.jpg",
        link: ""
    }
];

const APP_VERSION = "BETA Release";

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
        <p>Clique sur un anime pour l'ajouter à ta bibliothèque</p>

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

const input = document.getElementById("searchInput");
if(input){
    input.focus();
    input.setSelectionRange(searchQuery.length, searchQuery.length);
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

/* =========================
   +/- CURRENT
========================= */

function changeCurrent(value){
    const input = document.getElementById("current");

    let current = parseInt(input.value) || 0;
    const total = parseInt(document.getElementById("total").value) || Infinity;

    current += value;

    // limites
    if(current < 0) current = 0;
    if(current > total) current = total;

    input.value = current;
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

    document.getElementById("settingsVersion").textContent = APP_VERSION;
}

function closeSettings(){
    const modal = document.getElementById("settingsModal");
    modal.classList.add("hidden");
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

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", function(e){
        if(e.target === modal){
            modal.classList.add("hidden");
        }
    });
});


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
   document.getElementById("addModal").classList.remove("hidden");
};

window.addEventListener("DOMContentLoaded", () => {
    toggleSeasonField();
    showHome();
});
