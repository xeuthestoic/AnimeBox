let rating = 0;

const content = document.getElementById("content");

function init() {
    showHome();
    renderStars();
}

function showHome() {
    content.innerHTML = `
        <h2>Bienvenue sur AnimeBox</h2>
        <p>Version 1.0</p>
        <p>Créé par Hugo</p>
        <p>Développé en HTML / CSS / JavaScript</p>
    `;
}

function showLibrary() {
    const data = JSON.parse(localStorage.getItem("animebox")) || [];

    if(data.length === 0){
        content.innerHTML = "<p>Aucun anime ajouté.</p>";
        return;
    }

    content.innerHTML = data.map((a,i)=>`
        <div class="card">
            <img src="${a.cover}">
            <h3>${a.name}</h3>
            <p>${a.type}</p>
            <p>${a.current} / ${a.total}</p>
            <p>${a.status}</p>
            <p>${"⭐".repeat(a.rating)}</p>
            <button onclick="deleteAnime(${i})">Supprimer</button>
        </div>
    `).join("");
}

function saveAnime(){
    const file = document.getElementById("cover").files[0];
    const reader = new FileReader();

    reader.onload = function(){
        const data = JSON.parse(localStorage.getItem("animebox")) || [];

        data.push({
            type: document.getElementById("type").value,
            name: document.getElementById("name").value,
            cover: reader.result,
            total: document.getElementById("total").value,
            current: document.getElementById("current").value,
            status: document.getElementById("status").value,
            rating: rating
        });

        localStorage.setItem("animebox", JSON.stringify(data));
        closeModal();
        showLibrary();
    };

    if(file){
        reader.readAsDataURL(file);
    }
}

function deleteAnime(index){
    const data = JSON.parse(localStorage.getItem("animebox"));
    data.splice(index,1);
    localStorage.setItem("animebox", JSON.stringify(data));
    showLibrary();
}

function renderStars(){
    const starsDiv = document.getElementById("stars");
    starsDiv.innerHTML = "";

    for(let i=1;i<=5;i++){
        const star = document.createElement("span");
        star.innerHTML = "☆";
        star.onclick = ()=>{
            rating = i;
            updateStars();
        };
        starsDiv.appendChild(star);
    }
}

function updateStars(){
    const stars = document.querySelectorAll("#stars span");
    stars.forEach((s,i)=>{
        s.innerHTML = i < rating ? "★" : "☆";
    });
}

function closeModal(){
    document.getElementById("addModal").classList.add("hidden");
}

document.getElementById("addTab").onclick = ()=> {
    document.getElementById("addModal").classList.remove("hidden");
};

document.getElementById("homeTab").onclick = showHome;
document.getElementById("libraryTab").onclick = showLibrary;

init();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}
