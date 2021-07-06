self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

const CACHE = 'pwabuilder-offline-page'

const offlineFallbackPage = '/offline.html'

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('install', async event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.add(offlineFallbackPage))
  )
})

// self.addEventListener('activate', async function (event) {
//   try {
//     //Web Push Notifications//
//     checkNotifications()
//   } catch (err) {
//     console.log('Error', err)
//   }
// })

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable()
}

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE,
  })
)

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse

          if (preloadResp) {
            return preloadResp
          }

          const networkResp = await fetch(event.request)
          return networkResp
        } catch (error) {
          const cache = await caches.open(CACHE)
          const cachedResp = await cache.match(offlineFallbackPage)
          return cachedResp
        }
      })()
    )
  }
})

let click_open_url
self.addEventListener('push', function (event) {
  let push_message = event.data.json()
  click_open_url =
    push_message.notification.data?.url || 'https://www.octacle.app/matches'
  const options = {
    body: push_message.notification.body,
    icon: push_message.notification.icon || '/logo.png',
    image: push_message.notification.image,
    tag: 'alert',
  }
  event.waitUntil(
    self.registration.showNotification(
      push_message.notification.title || 'Octacle',
      options
    )
  )
})

self.addEventListener('notificationclick', function (event) {
  const clickedNotification = event.notification
  clickedNotification.close()
  if (click_open_url) {
    const promiseChain = clients.openWindow(click_open_url)
    event.waitUntil(promiseChain)
  }
})
