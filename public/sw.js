const CACHE_NAME = 'haniya-cache-v2'
const SHELL = [
  '/',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png'
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).catch(() => null)
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
      await self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  // only same-origin
  if (url.origin !== self.location.origin) return

  // network-first for navigations; stale-while-revalidate for static assets
  const isNav = req.mode === 'navigate'
  const isStatic = /\.(?:png|jpg|jpeg|gif|webp|svg|css|js|woff2?)$/i.test(url.pathname)
  if (!isNav && !isStatic) return

  if (isNav) {
    // Network-first for HTML/navigation to avoid serving stale ISR pages
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => null)
          return res
        })
        .catch(async () => (await caches.match(req)) || new Response('', { status: 504 }))
    )
    return
  }

  if (isStatic) {
    // Stale-while-revalidate for static assets
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            const copy = res.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => null)
            return res
          })
          .catch(() => null)
        return cached || fetchPromise || new Response('', { status: 504 })
      })
    )
    return
  }
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    if (event.data) data = event.data.json()
  } catch (_) {}
  const title = data.title || 'Update from HANIYA.PK'
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    data: { url: data.url || '/' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow(url)
    })
  )
})
