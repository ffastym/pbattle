/**
 * @author Yuriy Matviyuk
 */
import axios from 'axios'
import store from './store'

const convertedVapidKey = urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY)

function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

/**
 * Add property subscription to the user model in database with current user subscription data
 *
 * @param subscription object
 */
function saveSubscription (subscription) {
  const serverApiPath = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
  const id = store.getState().user.id

  axios.post(serverApiPath + '/api/saveSubscription', { subscription, id })
    .then(res => {
      console.log('subscription saved ---> ', res.data)
    }).catch(err => {
      console.log('subscription saved ---> ', err)
    })
}

export function subscribeUser () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      if (!registration.pushManager) {
        console.log('Push manager unavailable.')
        return
      }

      registration.pushManager.getSubscription().then(function (existedSubscription) {
        if (existedSubscription === null) {
          console.log('No subscription detected, make a request.')
          registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true
          }).then(function (newSubscription) {
            console.log('New subscription added.')
            saveSubscription(newSubscription)
          }).catch(function (e) {
            if (Notification.permission !== 'granted') {
              console.log('Permission was not granted.')
            } else {
              console.error('An error ocurred during the subscription process.', e)
            }
          })
        } else {
          console.log('Existed subscription detected.')
        }
      })
    })
      .catch(function (e) {
        console.error('An error ocurred during Service Worker registration.', e)
      })
  }
}
