// Service Worker para Pentecostés
const CACHE_NAME = 'pentecostes-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/static/logo-pentecostes.png',
  '/static/pentecostes.2025.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
  const options = {
    body: 'El evento Pentecostés está comenzando ahora!',
    icon: '/static/logo-pentecostes.png',
    badge: '/static/logo-pentecostes.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/#live'
    },
    actions: [
      {
        action: 'view-live',
        title: 'Ver Transmisión',
        icon: '/static/logo-pentecostes.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/static/logo-pentecostes.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  let title = 'Pentecostés 2025';
  let body = 'El evento está comenzando ahora!';

  if (event.data) {
    const data = event.data.json();
    title = data.title || title;
    body = data.body || body;
    
    if (data.type === 'event-starting') {
      body = '🔴 ¡El evento Pentecostés está comenzando ahora!';
      options.body = body;
    } else if (data.type === 'event-live') {
      body = '🔴 ¡Estamos EN VIVO! Únete a la transmisión';
      options.body = body;
    } else if (data.type === 'event-soon') {
      body = '⚡ ¡El evento empieza en 10 minutos!';
      options.body = body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Manejar clicks en las notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view-live') {
    event.waitUntil(
      clients.openWindow('/#live')
    );
  } else if (event.action === 'close') {
    // Solo cerrar la notificación
    return;
  } else {
    // Click principal en la notificación
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            client.postMessage({ type: 'scroll-to-live' });
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/#live');
        }
      })
    );
  }
});

// Escuchar mensajes desde la aplicación principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_EVENT_STATUS') {
    // Verificar estado del evento y enviar notificación si es necesario
    const now = new Date();
    const eventDate = new Date('2025-08-10T18:00:00-04:00');
    const liveTime = new Date('2025-08-10T17:50:00-04:00');
    
    if (now >= liveTime && now <= eventDate) {
      // Enviar notificación de que el evento está en vivo
      self.registration.showNotification('Pentecostés 2025', {
        body: '🔴 ¡El evento está EN VIVO ahora!',
        icon: '/static/logo-pentecostes.png',
        badge: '/static/logo-pentecostes.png',
        data: { url: '/#live' },
        requireInteraction: true
      });
    }
  }
}); 