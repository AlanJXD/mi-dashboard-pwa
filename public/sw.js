// Service Worker para Push Notifications Reales
self.addEventListener('push', function(event) {
    console.log('📬 Evento push recibido:', event);
    
    if (!event.data) {
      console.log('❌ Push event sin data');
      return;
    }
  
    let data = {};
    try {
      data = event.data.json();
      console.log('📊 Datos push parseados:', data);
    } catch (e) {
      console.log('❌ Error parseando push data:', e);
      data = {
        title: 'Mi Dashboard',
        body: event.data.text() || 'Tienes una nueva notificación',
        icon: '/icon-192x192.png'
      };
    }
  
    const options = {
      body: data.body || 'Notificación del dashboard',
      icon: data.icon || '/icon-192x192.png',
      badge: '/icon-192x192.png',
      image: data.image,
      data: data.url || '/',
      actions: [
        {
          action: 'open',
          title: 'Abrir Dashboard'
        },
        {
          action: 'close', 
          title: 'Cerrar'
        }
      ],
      tag: data.tag || 'general',
      requireInteraction: true, // Mantener visible hasta interacción
      vibrate: [200, 100, 200, 100, 200]
    };
  
    console.log('🔔 Mostrando notificación push');
    event.waitUntil(
      self.registration.showNotification(data.title || 'Mi Dashboard', options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    console.log('👆 Notificación clickeada:', event.notification.tag);
    event.notification.close();
  
    if (event.action === 'close') {
      console.log('❌ Usuario cerró notificación');
      return;
    }
  
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(function(clientList) {
          // Buscar ventana existente
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              console.log('🎯 Enfocando ventana existente');
              return client.focus();
            }
          }
          
          // Abrir nueva ventana
          console.log('🆕 Abriendo nueva ventana');
          if (clients.openWindow) {
            return clients.openWindow(event.notification.data || '/');
          }
        })
    );
  });
  
  // Background Sync para cuando recupera conexión
  self.addEventListener('sync', function(event) {
    console.log('🔄 Background sync triggered:', event.tag);
    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });
  
  async function doBackgroundSync() {
    console.log('🔄 Sincronizando datos en background...');
    // Aquí puedes sincronizar datos pendientes
  }
  
  // Manejar instalación
  self.addEventListener('install', function(event) {
    console.log('🔧 Service Worker instalado');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', function(event) {
    console.log('🎯 Service Worker activado');
    event.waitUntil(self.clients.claim());
  });