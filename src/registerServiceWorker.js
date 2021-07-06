/* eslint-disable no-console */

import { config } from '@/constants'
import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    register(`${process.env.BASE_URL}service-worker.js`, {
      ready() {
        console.log(
          'App is being served from cache by a service worker.\n' +
            'For more details, visit https://goo.gl/AFskqB'
        )
      },
      registered(registration) {
        console.log('Service worker has been registered.')
        checkPermission(registration)
      },
      cached() {
        console.log('Content has been cached for offline use.')
      },
      updatefound() {
        console.log('New content is downloading.')
      },
      updated() {
        console.log('New content is available; please refresh.')
      },
      offline() {
        console.log(
          'No internet connection found. App is running in offline mode.'
        )
      },
      error(error) {
        console.error('Error during service worker registration:', error)
      },
    })
  } else {
    console.error('This browser does not support desktop notification')
  }
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const checkPermission = registration => {
  // Let's check whether notification permissions have already been granted
  if (Notification.permission === 'granted') {
    console.log('Permission to receive notifications has been granted')
    getKeys(registration)
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        getKeys(registration)
      } else {
        throw new Error('Permission not granted for Notification')
      }
    })
  }
}

const getKeys = async registration => {
  let subscription = registration.pushManager.getSubscription()
  console.log(subscription)
  if (subscription) return subscription

  subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(config.vapidPublicKey),
  })
  console.log(JSON.stringify(subscription))
}
