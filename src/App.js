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
  // Live control via keyboard shortcut
  const [isLiveIdModalOpen, setIsLiveIdModalOpen] = useState(false);
  const [pendingLiveId, setPendingLiveId] = useState('');
  const [liveId, setLiveId] = useState('');
  const [forceLive, setForceLive] = useState(false);

  // Init from environment (Vercel) once on mount
  useEffect(() => {
    const envId = process.env.REACT_APP_YOUTUBE_LIVE_ID;
    const envForce = process.env.REACT_APP_FORCE_LIVE;

    if (envId && typeof envId === 'string' && envId.trim()) {
      setLiveId(envId.trim());
      setForceLive(true);
      setEventStatus('LIVE');
      // Scroll to live after mount
      setTimeout(() => {
        document.getElementById('live')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    } else if (envForce === 'true') {
      setForceLive(true);
      setEventStatus('LIVE');
    }
  }, []);

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

  // Global keyboard shortcut: Ctrl+. / Cmd+.
  useEffect(() => {
    const handleKeydown = (e) => {
      const key = e.key;
      const isModifier = e.ctrlKey || e.metaKey;
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;

      // Shortcut should work even while typing
      if (isModifier && key === '.') {
        e.preventDefault();
        setIsLiveIdModalOpen(true);
        // Select existing text for quick replace
        setTimeout(() => {
          const input = document.getElementById('live-id-input');
          if (input) {
            input.focus();
            input.select();
          }
        }, 0);
        return;
      }

      // Close modal with Escape
      if (isLiveIdModalOpen && key === 'Escape') {
        e.preventDefault();
        setIsLiveIdModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeydown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeydown, { capture: true });
  }, [isLiveIdModalOpen]);

  const applyLiveId = () => {
    const id = pendingLiveId.trim();
    if (!id) return;
    setLiveId(id);
    setForceLive(true);
    setEventStatus('LIVE');
    setIsLiveIdModalOpen(false);
    // Scroll to live section shortly after DOM updates
    setTimeout(() => {
      document.getElementById('live')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const closeModal = () => {
    setIsLiveIdModalOpen(false);
    setPendingLiveId('');
    // Reset forceLive after a delay to allow component to re-mount cleanly
    setTimeout(() => {
      setForceLive(false);
      setLiveId('');
    }, 100);
  };

  // Función para determinar el estado del evento
  const getEventStatus = () => {
    // Si hay override manual, siempre LIVE
    if (forceLive) return 'LIVE';

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
            <div className="order-2">
              <PentecostesLive 
                key={`live-${liveId}-${forceLive}`}
                language={language} 
                priority="high" 
                autoFocus={true} 
                liveId={liveId} 
                forceLive={forceLive} 
              />
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
            <div className="order-2">
              <PentecostesLive 
                key={`live-${liveId}-${forceLive}`}
                language={language} 
                priority="high" 
                liveId={liveId} 
                forceLive={forceLive} 
              />
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
            <div className="order-2">
              <PentecostesLive 
                key={`live-${liveId}-${forceLive}`}
                language={language} 
                liveId={liveId} 
                forceLive={forceLive} 
              />
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

      {/* Modal para ingresar ID de YouTube Live (Ctrl+. / Cmd+.) */}
      {isLiveIdModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={closeModal} />
          <div className="relative z-[81] w-full max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white text-lg font-bold">Activar Live manualmente</h3>
                <p className="text-gray-400 text-sm">Pega el ID del stream de YouTube y presiona Enter</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <input
              id="live-id-input"
              type="text"
              autoComplete="off"
              placeholder="Ej: fxJ1IMMnyVM"
              value={pendingLiveId}
              onChange={(e) => setPendingLiveId(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyLiveId(); } }}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none text-white placeholder-gray-500"
            />
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <span>Atajo: Ctrl+. / Cmd+.</span>
              <button onClick={applyLiveId} className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500">Activar</button>
            </div>
          </div>
        </div>
      )}

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