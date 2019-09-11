self.addEventListener('push', event => {
  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title, data)
  )
})

self.addEventListener('notificationclick', event => {
  if (event.action === 'open') {
    // eslint-disable-next-line no-undef
    clients.openWindow('https://pbattle.herokuapp.com/my_battles')
  }

  event.notification.close()
})
