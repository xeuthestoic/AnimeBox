self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("animebox").then(cache => {
            return cache.addAll([
                "./",
                "./index.html",
                "./style.css",
                "./app.js"
            ]);
        })
    );
});
