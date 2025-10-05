// Service Worker para notificaciones push
self.addEventListener('push', function(event) {
    if (!event.data) return;
  
    const data = event.data.json();
    const options = {
      body: data.body || 'Notificación del dashboard',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: data.tag || 'general',
      data: data.url || '/'
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title || 'Dashboard', options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  });