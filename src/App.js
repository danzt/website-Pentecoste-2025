import React, { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import PentecostesHeader from './components/PentecostesHeader';
import PentecostesHero from './components/PentecostesHero';
import PentecostesLive from './components/PentecostesLive';
import MultivisionSection from './components/MultivisionSection';
import PentecostesCountdown from './components/PentecostesCountdown';
import PentecostesGallery from './components/PentecostesGallery';
import PentecostesFooter from './components/PentecostesFooter';
import { useNotifications } from './hooks/useNotifications';

const App = () => {
  const [language, setLanguage] = useState('es');
  const [eventStatus, setEventStatus] = useState('NORMAL');
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const prevEventStatusRef = useRef('NORMAL');

  // Hook de notificaciones
  const {
    isSupported,
    hasPermission,
    requestPermission,
    notifyEventStarting,
    notifyEventLive,
    notifyEventSoon
  } = useNotifications();

  // Configuración de fechas del evento
  const EVENT_DATE = new Date('2025-08-10T18:00:00-04:00');
  const SOON_TIME = new Date('2025-08-10T16:00:00-04:00');
  const LIVE_TIME = new Date('2025-08-10T17:50:00-04:00');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Función para determinar el estado del evento
  const getEventStatus = () => {
    const now = new Date();
    const currentTime = now.getTime();
    
    // Durante el evento en vivo
    if (currentTime >= LIVE_TIME.getTime() && currentTime <= EVENT_DATE.getTime()) {
      return 'LIVE';
    }
    
    // Día del evento (desde las 6:00 AM hasta que empiece el live)
    const eventDayStart = new Date(EVENT_DATE);
    eventDayStart.setHours(6, 0, 0, 0); // 6:00 AM del día del evento
    
    if (currentTime >= eventDayStart.getTime() && currentTime < LIVE_TIME.getTime()) {
      return 'EVENT_DAY';
    }
    
    // Estado normal - antes del evento
    return 'NORMAL';
  };

  // Efecto para actualizar el estado del evento y enviar notificaciones
  useEffect(() => {
    const updateEventStatus = () => {
      const newStatus = getEventStatus();
      const prevStatus = prevEventStatusRef.current;
      
      if (newStatus !== eventStatus) {
        setEventStatus(newStatus);
        
        // Enviar notificaciones cuando cambie el estado (solo si tenemos permisos)
        if (hasPermission && newStatus !== prevStatus) {
          if (newStatus === 'LIVE' && prevStatus !== 'LIVE') {
            notifyEventLive();
          } else if (newStatus === 'EVENT_DAY' && prevStatus === 'NORMAL') {
            notifyEventSoon();
          }
        }
        
        prevEventStatusRef.current = newStatus;
      }
    };

    // Actualizar inmediatamente
    updateEventStatus();

    // Actualizar cada 30 segundos para mayor precisión
    const timer = setInterval(updateEventStatus, 30000);

    return () => clearInterval(timer);
  }, [eventStatus, hasPermission, notifyEventLive, notifyEventSoon]);

  // Mostrar banner de notificaciones si no tenemos permisos
  useEffect(() => {
    if (isSupported && !hasPermission && eventStatus !== 'NORMAL') {
      setShowNotificationBanner(true);
    } else {
      setShowNotificationBanner(false);
    }
  }, [isSupported, hasPermission, eventStatus]);

  // Manejar solicitud de permisos
  const handleRequestNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowNotificationBanner(false);
      // Enviar notificación de confirmación
      if (eventStatus === 'LIVE') {
        notifyEventLive();
      } else if (eventStatus === 'EVENT_DAY') {
        notifyEventSoon();
      }
    }
  };

  // Renderizar componentes según el estado del evento
  const renderLayout = () => {
    switch (eventStatus) {
      case 'LIVE':
        // Durante el live: Countdown urgente → Live prominente
        return (
          <>
            <div id="countdown" className="order-1">
              <PentecostesCountdown language={language} isLive={true} priority="urgent" />
            </div>
            <div id="live" className="order-2">
              <PentecostesLive language={language} priority="high" autoFocus={true} />
            </div>
            <div id="hero" className="order-3">
              <PentecostesHero language={language} />
            </div>
            <div id="multivision" className="order-4">
              <MultivisionSection language={language} />
            </div>
            <div id="gallery" className="order-5">
              <PentecostesGallery language={language} />
            </div>
          </>
        );

      case 'EVENT_DAY':
        // Día del evento: Countdown → Live
        return (
          <>
            <div id="countdown" className="order-1">
              <PentecostesCountdown language={language} isEventDay={true} priority="high" />
            </div>
            <div id="live" className="order-2">
              <PentecostesLive language={language} priority="high" />
            </div>
            <div id="hero" className="order-3">
              <PentecostesHero language={language} />
            </div>
            <div id="multivision" className="order-4">
              <MultivisionSection language={language} />
            </div>
            <div id="gallery" className="order-5">
              <PentecostesGallery language={language} />
            </div>
          </>
        );

      default:
        // Estado normal: Orden original
        return (
          <>
            <div id="hero" className="order-1">
              <PentecostesHero language={language} />
            </div>
            <div id="live" className="order-2">
              <PentecostesLive language={language} />
            </div>
            <div id="multivision" className="order-3">
              <MultivisionSection language={language} />
            </div>
            <div id="countdown" className="order-4">
              <PentecostesCountdown language={language} />
            </div>
            <div id="gallery" className="order-5">
              <PentecostesGallery language={language} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="font-sans bg-black text-white">
      {/* NAVBAR SIEMPRE ARRIBA */}
      <PentecostesHeader 
        onLanguageChange={handleLanguageChange} 
        language={language} 
        compact={eventStatus === 'LIVE' || eventStatus === 'EVENT_DAY'} 
      />

      {/* Banner de solicitud de notificaciones */}
      {showNotificationBanner && (
        <div className="fixed top-20 left-4 right-4 z-[70]">
          <div className="bg-gradient-to-r from-blue-600/95 to-purple-700/95 backdrop-blur-lg border border-blue-500/30 rounded-xl px-4 py-3 shadow-2xl max-w-md mx-auto">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔔</div>
              <div className="flex-1">
                <div className="text-white font-bold text-sm">
                  ¡Activa las Notificaciones!
                </div>
                <div className="text-white/90 text-xs">
                  Te avisaremos cuando empiece el evento
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleRequestNotifications}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200"
                >
                  Activar
                </button>
                <button
                  onClick={() => setShowNotificationBanner(false)}
                  className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs transition-all duration-200"
                >
                  Después
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner informativo para usuarios - solo cuando es relevante */}
      {eventStatus !== 'NORMAL' && (
        <div className="fixed top-20 right-4 z-[60]">
          <div className="bg-gradient-to-r from-red-600/90 to-purple-800/90 backdrop-blur-lg border border-red-500/30 rounded-xl px-4 py-3 shadow-2xl max-w-sm">
            <div className="flex items-center space-x-3">
              {/* Ícono pulsante */}
              <div className="flex-shrink-0">
                {eventStatus === 'LIVE' ? (
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg"></div>
                ) : (
                  <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                )}
              </div>
              
              {/* Mensaje principal */}
              <div className="flex-1">
                <div className="text-white font-bold text-sm">
                  {eventStatus === 'LIVE' ? (
                    '🔴 ¡ESTAMOS EN VIVO!'
                  ) : (
                    '⚡ ¡HOY ES EL DÍA!'
                  )}
                </div>
                <div className="text-white/90 text-xs">
                  {eventStatus === 'LIVE' ? (
                    'Pentecostés transmitiendo ahora'
                  ) : (
                    'El evento empieza pronto'
                  )}
                </div>
              </div>
              
              {/* Botón de acción */}
              <button
                onClick={() => {
                  const targetSection = eventStatus === 'LIVE' ? 'live' : 'countdown';
                  document.getElementById(targetSection)?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105"
              >
                {eventStatus === 'LIVE' ? 'VER AHORA' : 'VER COUNTDOWN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug info técnico - solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-[60]">
          <div className="bg-black/80 text-gray-400 px-2 py-1 rounded text-xs border border-gray-700">
            Debug: {eventStatus} | Notifications: {hasPermission ? '✅' : '❌'}
          </div>
        </div>
      )}
      
      <div className="flex flex-col">
        {renderLayout()}
      </div>
      <PentecostesFooter language={language} />
      <Analytics />
    </div>
  );
};

export default App;