const CACHE_NAME = "safewalk-v1"
const DYNAMIC_CACHE = "safewalk-dynamic-v1"

// Assets to cache on install
const urlsToCache = [
  "/",
  "/dashboard",
  "/about",
  "/contact",
  "/emergency-contacts",
  "/safety-zones",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/google-logo.svg",
  "/subtle-pattern.png",
  "/manifest.json",
  "/register-sw.js",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting()), // Force activation
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE]

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()), // Take control of clients
  )
})

// Fetch event - network first with cache fallback strategy
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // For HTML pages - network first, then cache
  if (event.request.headers.get("accept").includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          return caches.match(event.request)
        }),
    )
    return
  }

  // For other requests - cache first, then network
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }

      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data.json()

  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(clients.openWindow(event.notification.data.url))
})
