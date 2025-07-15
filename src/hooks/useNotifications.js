import { useState, useEffect, useCallback } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [isSupported, setIsSupported] = useState(false);
  const [registration, setRegistration] = useState(null);

  // Verificar soporte de notificaciones
  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
  }, []);

  // Registrar Service Worker
  useEffect(() => {
    if (isSupported) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('Service Worker registrado:', reg);
          setRegistration(reg);
        })
        .catch((error) => {
          console.error('Error registrando Service Worker:', error);
        });
    }
  }, [isSupported]);

  // Solicitar permisos de notificación
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error solicitando permisos:', error);
      return false;
    }
  }, [isSupported]);

  // Enviar notificación local
  const sendNotification = useCallback(async (title, options = {}) => {
    if (permission !== 'granted' || !registration) {
      return false;
    }

    try {
      await registration.showNotification(title, {
        body: options.body || 'Pentecostés 2025',
        icon: '/static/logo-pentecostes.png',
        badge: '/static/logo-pentecostes.png',
        vibrate: [100, 50, 100],
        requireInteraction: true,
        actions: [
          {
            action: 'view-live',
            title: 'Ver Transmisión'
          },
          {
            action: 'close',
            title: 'Cerrar'
          }
        ],
        data: {
          url: options.url || '/#live',
          type: options.type || 'general'
        },
        ...options
      });
      return true;
    } catch (error) {
      console.error('Error enviando notificación:', error);
      return false;
    }
  }, [permission, registration]);

  // Notificaciones específicas del evento
  const notifyEventStarting = useCallback(() => {
    return sendNotification('🔴 ¡Pentecostés 2025!', {
      body: 'El evento está comenzando ahora. ¡No te lo pierdas!',
      type: 'event-starting',
      url: '/#live'
    });
  }, [sendNotification]);

  const notifyEventLive = useCallback(() => {
    return sendNotification('🔴 ¡ESTAMOS EN VIVO!', {
      body: 'Pentecostés se está transmitiendo ahora. Únete a nosotros.',
      type: 'event-live',
      url: '/#live'
    });
  }, [sendNotification]);

  const notifyEventSoon = useCallback(() => {
    return sendNotification('⚡ ¡Pentecostés 2025!', {
      body: 'El evento empieza en 10 minutos. Prepárate.',
      type: 'event-soon',
      url: '/#countdown'
    });
  }, [sendNotification]);

  // Escuchar mensajes del Service Worker
  useEffect(() => {
    if (!isSupported) return;

    const handleMessage = (event) => {
      if (event.data?.type === 'scroll-to-live') {
        document.getElementById('live')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [isSupported]);

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    notifyEventStarting,
    notifyEventLive,
    notifyEventSoon,
    hasPermission: permission === 'granted'
  };
}; 