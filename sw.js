self.addEventListener("fetch", e => {
  e.respondWith(
    caches.open("animebox").then(cache =>
      cache.match(e.request).then(res =>
        res || fetch(e.request).then(net => {
          cache.put(e.request, net.clone());
          return net;
        })
      )
    )
  );
});
