let db;

const request = indexedDB.open("animebox", 1);

request.onupgradeneeded = e => {
  db = e.target.result;
  db.createObjectStore("animes", { keyPath: "id" });
};

request.onsuccess = e => {
  db = e.target.result;
  loadAnimes();
};

function addAnime(anime){
  const tx = db.transaction("animes", "readwrite");
  tx.objectStore("animes").add(anime);
}

function getAll(cb){
  const tx = db.transaction("animes");
  const store = tx.objectStore("animes");
  store.getAll().onsuccess = e => cb(e.target.result);
}
