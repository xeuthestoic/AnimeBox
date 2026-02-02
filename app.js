const customAddButtonLink = null;

let currentFilter = "Tous";
let searchQuery = "";

const content = document.getElementById("content");

function getData(){
    return JSON.parse(localStorage.getItem("animebox")) || [];
}

function saveData(data){
    localStorage.setItem("animebox", JSON.stringify(data));
}

function showHome(){
    content.innerHTML = `
        <h2>Bienvenue sur AnimeBox</h2>
        <p>Version Release : 1.0</p>
        <p>Créé par xeuthestoic</p>
    `;
}

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
            <input type="text" placeholder="Rechercher..."
                oninput="searchAnime(this.value)">
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
                </div>
            `).join("")}
        </div>
    `;
}

function setFilter(f){
    currentFilter = f;
    showLibrary();
}

function searchAnime(q){
    searchQuery = q;
    showLibrary();
}

function saveAnime(){
    const file = document.getElementById("cover").files[0];
    const reader = new FileReader();

    reader.onload = function(){
        const data = getData();
        data.push({
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

document.getElementById("homeTab").onclick = showHome;
document.getElementById("libraryTab").onclick = showLibrary;
document.getElementById("addTab").onclick = () =>
    document.getElementById("addModal").classList.remove("hidden");

window.addEventListener("DOMContentLoaded", () => {
    if(customAddButtonLink){
        const btn = document.querySelector(".add-btn");
        btn.innerHTML = `<img src="${customAddButtonLink}" style="width:28px;height:28px;">`;
        btn.style.background = "none";
    }
    showHome();
});
