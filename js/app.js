const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const form = document.getElementById("animeForm");
const library = document.getElementById("library");
const homePage = document.getElementById("homePage");
const libraryPage = document.getElementById("libraryPage");
const allLibrary = document.getElementById("allLibrary");

addBtn.onclick = () => modal.hidden = false;
modal.onclick = e => { if(e.target === modal) modal.hidden = true; }

form.onsubmit = async e => {
  e.preventDefault();

  let img = null;
  if(image.files[0]) img = await compressImage(image.files[0]);

  const anime = {
    id: Date.now(),
    title: title.value,
    status: status.value,
    image: img,
    createdAt: Date.now()
  };

  addAnime(anime);
  renderAnime(anime);

  modal.hidden = true;
  form.reset();
};

function loadAnimes(){
  getAll(list => {
    library.innerHTML = "";
    allLibrary.innerHTML = "";
    list.forEach(renderAnime);
  });
}

function renderAnime(anime){
  let section = document.getElementById(anime.status);
  if(!section){
    section = document.createElement("div");
    section.className = "section";
    section.innerHTML = `<h2>${label(anime.status)}</h2><div class="row" id="${anime.status}"></div>`;
    library.appendChild(section);
    const mini = document.createElement("div");
    mini.className = "card";
    mini.innerHTML = anime.image ? `<img src="${anime.image}">` : "";
    allLibrary.appendChild(mini);
  }

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = anime.image ? `<img src="${anime.image}">` : "";
  section.querySelector(".row").appendChild(card);
}

function label(s){
  return {
    watching:"En cours",
    planned:"À voir",
    completed:"Terminés",
    dropped:"Abandonnés"
  }[s];
}

document.querySelectorAll("#bottomBar .tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("#bottomBar .tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if(btn.dataset.page === "home"){
      homePage.classList.add("active");
      libraryPage.classList.remove("active");
    }

    if(btn.dataset.page === "library"){
      homePage.classList.remove("active");
      libraryPage.classList.add("active");
    }
  };
});

document.getElementById("addBtnBottom").onclick = () => {
  modal.hidden = false;
};
