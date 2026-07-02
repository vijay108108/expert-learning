self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));

      const registrations = await self.registration.unregister();
      await self.clients.claim();

      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      await Promise.all(
        clients.map((client) => {
          if ("navigate" in client) {
            return client.navigate(client.url);
          }
          return Promise.resolve();
        })
      );

      return registrations;
    })()
  );
});

self.addEventListener("fetch", () => {
  // Intentionally empty: this worker no longer intercepts requests.
});
