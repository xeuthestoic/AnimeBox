let rating = 0;
const content = document.getElementById("content");

function showPage(html){
    content.classList.remove("fade");
    void content.offsetWidth;
    content.innerHTML = html;
    content.classList.add("fade");
}

function showHome(){
    showPage(`
        <h2>Bienvenue sur AnimeBox</h2>
        <p>Version 2.0</p>
        <p>Créé par Hugo</p>
        <p>Développé en HTML / CSS / JavaScript</p>
    `);
}

function showLibrary(){
    const data = JSON.parse(localStorage.getItem("animebox")) || [];

    if(data.length === 0){
        showPage("<p>Aucun anime ajouté.</p>");
        return;
    }

    showPage(`
        <div class="grid">
        ${data.map((a,i)=>`
            <div class="card" onclick="deleteAnime(${i})">
                <img src="${a.cover}">
                <div class="card-info">
                    <strong>${a.name}</strong><br>
                    ${a.current}/${a.total} • ${"⭐".repeat(a.rating)}
                </div>
            </div>
        `).join("")}
        </div>
    `);
}

function saveAnime(){
    const file = document.getElementById("cover").files[0];
    const reader = new FileReader();

    reader.onload = function(){
        const data = JSON.parse(localStorage.getItem("animebox")) || [];
        data.push({
            name: document.getElementById("name").value,
            total: document.getElementById("total").value,
            current: document.getElementById("current").value,
            status: document.getElementById("status").value,
            cover: reader.result,
            rating: rating
        });
        localStorage.setItem("animebox", JSON.stringify(data));
        closeModal();
        showLibrary();
    }

    if(file) reader.readAsDataURL(file);
}

function deleteAnime(i){
    if(confirm("Supprimer cet anime ?")){
        const data = JSON.parse(localStorage.getItem("animebox"));
        data.splice(i,1);
        localStorage.setItem("animebox", JSON.stringify(data));
        showLibrary();
    }
}

function closeModal(){
    document.getElementById("addModal").classList.add("hidden");
}

document.getElementById("addTab").onclick = ()=> {
    document.getElementById("addModal").classList.remove("hidden");
};

document.getElementById("homeTab").onclick = showHome;
document.getElementById("libraryTab").onclick = showLibrary;

showHome();
