import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFullscreen } from '../hooks/useFullscreen';
import YouTubeChat from './YouTubeChat';
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const PentecostesLive = ({ language, priority = 'normal', autoFocus = false }) => {
  // Configuración del evento
  const EVENT_DATE = new Date('2025-08-10T18:00:00-04:00');
  const SOON_TIME = new Date('2025-08-10T16:00:00-04:00');
  const LIVE_TIME = new Date('2025-08-10T17:50:00-04:00');
  const VIMEO_PROMO_ID = '1101559705';
  // Cambiar de X/Twitter a YouTube Live
  const YOUTUBE_LIVE_ID = 'TU_STREAM_ID_AQUI'; // Reemplaza con tu Stream ID de YouTube
  const YOUTUBE_LIVE_URL = `https://www.youtube.com/embed/${YOUTUBE_LIVE_ID}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`;

  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [streamStatus, setStreamStatus] = useState('promo');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const playerRef = useRef(null);
  const vimeoPlayerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  // Hook de fullscreen
  const { 
    isFullscreen, 
    isSupported: fullscreenSupported, 
    toggleFullscreen,
    setElementRef 
  } = useFullscreen();

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setShowChat(false); // Ocultar chat por defecto en móvil
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Configurar elemento para fullscreen
  useEffect(() => {
    if (videoContainerRef.current) {
      setElementRef(videoContainerRef.current);
    }
  }, [setElementRef]);

  const texts = {
    es: {
      title: priority === 'high' ? '🔴 TRANSMISIÓN EN VIVO' : 'TRANSMISIÓN EN VIVO',
      subtitle: priority === 'high' ? 'Sintoniza AHORA nuestra señal en directo' : 'Sintoniza nuestra señal en directo',
      placeholder: 'Pentecostés - La fiesta del Espíritu',
      description: priority === 'high' ? 'El evento Pentecostés está siendo transmitido EN VIVO.' : 'El evento Pentecostés será transmitido en vivo el 10 de Agosto.',
      playText: 'REPRODUCIR',
      pauseText: 'PAUSAR',
      watchPromo: 'VER VIDEO',
      startingSoon: 'EMPEZARÁ PRONTO',
      liveNow: 'EN VIVO AHORA',
      muteText: 'SILENCIAR',
      unmuteText: 'ACTIVAR SONIDO',
      volumeText: 'Volumen',
      showChat: 'Mostrar Chat',
      hideChat: 'Ocultar Chat',
      chatToggle: 'Chat'
    },
    en: {
      title: priority === 'high' ? '🔴 LIVE STREAM' : 'LIVE STREAM',
      subtitle: priority === 'high' ? 'Tune in NOW to our live broadcast' : 'Tune in to our live broadcast',
      placeholder: 'Pentecost - The feast of the Spirit',
      description: priority === 'high' ? 'The Pentecost event is being streamed LIVE now.' : 'The Pentecost event will be streamed live on August 10th.',
      playText: 'PLAY',
      pauseText: 'PAUSE',
      watchPromo: 'WATCH VIDEO',
      startingSoon: 'STARTING SOON',
      liveNow: 'LIVE NOW',
      muteText: 'MUTE',
      unmuteText: 'UNMUTE',
      volumeText: 'Volume',
      showChat: 'Show Chat',
      hideChat: 'Hide Chat',
      chatToggle: 'Chat'
    }
  };

  // Función para determinar el estado inicial
  const getInitialStreamStatus = () => {
    const now = new Date();
    const currentTime = now.getTime();
    
    // Si la fecha actual es posterior al evento, mostrar promo
    if (currentTime > EVENT_DATE.getTime()) {
      return 'promo';
    }

    // Durante el evento
    if (currentTime >= LIVE_TIME.getTime() && currentTime <= EVENT_DATE.getTime()) {
      return 'live';
    }

    // Próximo a comenzar
    if (currentTime >= SOON_TIME.getTime() && currentTime < LIVE_TIME.getTime()) {
      return 'soon';
    }

    // Estado por defecto - antes del evento
    return 'promo';
  };

  // Efecto para manejar el estado de la transmisión
  useEffect(() => {
    const checkStreamStatus = () => {
      const newStatus = getInitialStreamStatus();
      if (newStatus !== streamStatus) {
        setStreamStatus(newStatus);
      }
    };

    checkStreamStatus();

    // Actualizar cada minuto
    const timer = setInterval(checkStreamStatus, 60000);

    return () => clearInterval(timer);
  }, [streamStatus]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [isPlaying]);

  // Efecto adicional para manejar la visibilidad usando Intersection Observer
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Eliminar lógica de mute/unmute automático por visibilidad
      },
      {
        threshold: 0.3, // El video se silenciará cuando menos del 30% esté visible
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Efecto para inicializar el reproductor de Vimeo
  useEffect(() => {
    if (streamStatus !== 'promo' || !playerRef.current) return;

    const initVimeoPlayer = async () => {
      try {
        if (!window.Vimeo) {
          const script = document.createElement('script');
          script.src = 'https://player.vimeo.com/api/player.js';
          script.async = true;
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        if (vimeoPlayerRef.current) {
          vimeoPlayerRef.current.destroy();
        }

        // Configuración optimizada del reproductor
        vimeoPlayerRef.current = new window.Vimeo.Player(playerRef.current, {
          id: VIMEO_PROMO_ID,
          background: false,
          responsive: true,
          autoplay: false,
          controls: false,
          loop: false,
          muted: true, // Iniciar muteado para permitir autoplay
          playsinline: true,
          title: false,
          byline: false,
          portrait: false,
          speed: false,
          transparent: false,
          autopause: false,
          quality: 'auto',
          dnt: true
        });

        // Función de inicialización con reintentos
        const initializePlayer = async (retryCount = 0) => {
          try {
            await vimeoPlayerRef.current.ready();
            await vimeoPlayerRef.current.setVolume(0); // Siempre muteado al iniciar
            await vimeoPlayerRef.current.play();
            setVideoLoaded(true);
            setPlayerReady(true);
            setIsPlaying(true);
            setIsMuted(true); // Estado de mute siempre true al iniciar
            console.log('Video cargado y reproducción iniciada');
          } catch (error) {
            console.error('Error en la inicialización:', error);
            if (retryCount < 3) {
              setTimeout(() => initializePlayer(retryCount + 1), 1000);
            }
          }
        };

        // Configuración de eventos mejorada
        vimeoPlayerRef.current.on('loaded', () => initializePlayer());

        vimeoPlayerRef.current.on('play', () => {
          setIsPlaying(true);
          console.log('Video reproduciendo');
        });

        vimeoPlayerRef.current.on('pause', () => {
          setIsPlaying(false);
          console.log('Video pausado');
        });

        vimeoPlayerRef.current.on('ended', async () => {
          try {
            console.log('Video terminado, reiniciando...');
            await vimeoPlayerRef.current.setCurrentTime(0);
            await vimeoPlayerRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Error al reiniciar el video:', error);
            initializePlayer();
          }
        });

        vimeoPlayerRef.current.on('error', async (error) => {
          console.error('Error en el reproductor:', error);
          try {
            await vimeoPlayerRef.current.play();
          } catch (playError) {
            console.error('Error al reintentar reproducción:', playError);
            initializePlayer();
          }
        });

        // Iniciar reproducción inmediatamente
        initializePlayer();

      } catch (error) {
        console.error('Error al inicializar el reproductor de Vimeo:', error);
        setVideoLoaded(false);
        setPlayerReady(false);
        // Reintentar la inicialización
        setTimeout(initVimeoPlayer, 1000);
      }
    };

    initVimeoPlayer();

    return () => {
      if (vimeoPlayerRef.current) {
        try {
          vimeoPlayerRef.current.destroy();
        } catch (error) {
          console.warn('Error al destruir el reproductor:', error);
        }
      }
    };
  }, [streamStatus]);

  // Efecto para manejar la visibilidad de la página
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!vimeoPlayerRef.current) return;

      if (document.hidden) {
        await vimeoPlayerRef.current.pause();
      } else if (streamStatus === 'promo') {
        try {
          await vimeoPlayerRef.current.play();
          setIsPlaying(true);
          // No desmutear automáticamente
        } catch (error) {
          console.error('Error al reanudar la reproducción:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [streamStatus]);

  // Efecto para auto-focus cuando la prioridad es alta
  useEffect(() => {
    if (autoFocus && sectionRef.current) {
      const timer = setTimeout(() => {
        sectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // Efecto para manejar controles en fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
      return;
    }

    // Auto-hide controles después de 3 segundos en fullscreen
    const hideControls = () => {
      setShowControls(false);
    };

    const resetTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(hideControls, 3000);
    };

    const handleMouseMove = () => resetTimeout();
    const handleMouseLeave = () => hideControls();
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        resetTimeout();
      }
    };

    // Eventos para mostrar/ocultar controles
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    
    if (videoContainerRef.current) {
      videoContainerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    // Iniciar timeout
    resetTimeout();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      if (videoContainerRef.current) {
        videoContainerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  const togglePlay = () => {
    if (!vimeoPlayerRef.current) return;
    if (isPlaying) {
      vimeoPlayerRef.current.pause();
    } else {
      vimeoPlayerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = async () => {
    if (!vimeoPlayerRef.current) return;
    try {
      const currentVolume = await vimeoPlayerRef.current.getVolume();
      if (currentVolume === 0) {
        await vimeoPlayerRef.current.setVolume(1);
        setIsMuted(false);
      } else {
        await vimeoPlayerRef.current.setVolume(0);
        setIsMuted(true);
      }
    } catch (error) {
      console.error('Error al cambiar el sonido:', error);
    }
  };

  // Determinar clases CSS basadas en prioridad
  const getSectionClasses = () => {
    const baseClasses = "relative flex flex-col justify-center items-center bg-black text-white py-20";
    
    if (priority === 'high') {
      return `${baseClasses} min-h-screen border-4 border-red-600 border-opacity-50`;
    } else {
      return `${baseClasses} min-h-screen`;
    }
  };

  const getTitleClasses = () => {
    if (priority === 'high') {
      return "text-6xl md:text-8xl font-black mb-8 tracking-wider animate-pulse text-red-400";
    } else {
      return "text-5xl md:text-7xl font-bold mb-6 tracking-wider";
    }
  };

  const getVideoContainerClasses = () => {
    if (priority === 'high') {
      return "relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-red-600 border-opacity-70";
    } else {
      return "relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800";
    }
  };

  return (
    <section ref={sectionRef} id="live" className={getSectionClasses()}>
      {/* Indicador de alta prioridad */}
      {priority === 'high' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-600 px-6 py-2 rounded-full text-white font-bold animate-bounce shadow-lg">
            ⚡ SECCIÓN PRINCIPAL ⚡
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={getTitleClasses()}>{texts[language].title}</h2>
          <p className={`${priority === 'high' ? 'text-2xl md:text-3xl text-yellow-300' : 'text-xl md:text-2xl text-gray-300'} mb-4`}>
            {texts[language].subtitle}
          </p>
          <p className={`${priority === 'high' ? 'text-lg md:text-xl text-yellow-200' : 'text-md md:text-lg text-gray-400'}`}>
            {texts[language].description}
          </p>
        </div>

        {/* Layout principal: Video + Chat */}
        <div className="space-y-6">
          {/* Controles del layout (solo cuando hay live stream) */}
          {streamStatus === 'live' && (
            <div className="flex justify-center lg:justify-end">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold transition-all duration-200 ${
                  showChat 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{texts[language].chatToggle}</span>
                {showChat && <span className="text-xs bg-white/20 px-2 py-1 rounded-full">ON</span>}
              </button>
            </div>
          )}

          {/* Container principal con video y chat */}
          <div className={`${
            streamStatus === 'live' && showChat && !isMobile 
              ? 'grid grid-cols-1 lg:grid-cols-5 gap-6' 
              : 'flex justify-center'
          }`}>
            
            {/* Video Container */}
            <div 
              ref={videoContainerRef}
              className={`${
                streamStatus === 'live' && showChat && !isMobile 
                  ? 'lg:col-span-3' 
                  : 'w-full max-w-5xl'
              } ${getVideoContainerClasses()} ${isFullscreen ? 'fixed inset-0 z-[9999] bg-black rounded-none border-none' : ''}`}
            >
              {streamStatus === 'live' ? (
                // YouTube Live Stream
                <div className="w-full h-full relative">
                  <iframe
                    src={YOUTUBE_LIVE_URL}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Pentecostés 2025 - Transmisión en Vivo"
                  />
                  
                  {/* Controles overlay para fullscreen */}
                  {isFullscreen && (
                    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                      {/* Header en fullscreen */}
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6 pointer-events-auto">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-white font-bold text-lg">
                              🔴 {texts[language].liveNow}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => toggleFullscreen()}
                            className="bg-black/50 hover:bg-black/70 p-3 rounded-full transition-all duration-200 hover:scale-105"
                            title="Salir de pantalla completa (Esc)"
                          >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Footer en fullscreen */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pointer-events-auto">
                        <div className="text-center">
                          <h3 className="text-white text-2xl font-bold mb-2">Pentecostés 2025</h3>
                          <p className="text-white/80">La Fiesta del Espíritu</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Indicador de live normal */}
                  {!isFullscreen && (
                    <div className="absolute top-6 right-6">
                      <span className={`flex items-center ${priority === 'high' ? 'bg-red-600 px-8 py-4 text-lg' : 'bg-red-600 px-6 py-3 text-sm'} rounded-full font-bold`}>
                        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                        {texts[language].liveNow}
                      </span>
                    </div>
                  )}
                  
                  {/* Botón de fullscreen para live */}
                  {!isFullscreen && fullscreenSupported && (
                    <div className="absolute bottom-6 right-6">
                      <button
                        onClick={() => toggleFullscreen()}
                        className="bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
                        title="Pantalla completa"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Estados: Soon o Promo (sin cambios)
                <div className="w-full h-full">
                  {streamStatus === 'soon' ? (
                    // Pantalla de "Empezará pronto"
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-red-900/20 to-black">
                      <div className="text-center">
                        <div className="animate-pulse mb-4">
                          <span className="w-3 h-3 bg-red-600 rounded-full inline-block mr-2"></span>
                          <span className="w-3 h-3 bg-red-600 rounded-full inline-block mr-2 animate-pulse delay-100"></span>
                          <span className="w-3 h-3 bg-red-600 rounded-full inline-block animate-pulse delay-200"></span>
                        </div>
                        <h3 className={`${priority === 'high' ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'} font-bold text-red-600`}>
                          {texts[language].startingSoon}
                        </h3>
                        {priority === 'high' && (
                          <p className="text-xl mt-4 text-yellow-300">
                            ¡La transmisión comenzará en cualquier momento!
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Video promocional con controles mejorados
                    <>
                      {!videoLoaded && (
                        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center space-y-6">
                          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-xl text-gray-400">{texts[language].placeholder}</p>
                        </div>
                      )}
                      <div ref={playerRef} className="w-full h-full"></div>
                      <div 
                        className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-500 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                      >
                        {/* Indicador de sonido móvil */}
                        <div className="absolute top-4 right-4 sm:hidden">
                          <div className={`bg-black/50 p-2 rounded-full transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                            {isMuted ? (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between">
                          <button 
                            onClick={togglePlay}
                            className="flex items-center justify-center w-12 h-12 bg-red-600/90 hover:bg-red-700 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <div className="flex items-center justify-center">
                              {isPlaying ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                          </button>

                          <div className="flex items-center space-x-3">
                            <button
                              onClick={toggleMute}
                              className="hidden sm:flex items-center justify-center w-12 h-12 bg-black/30 hover:bg-black/40 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-105"
                            >
                              <div className="flex items-center justify-center">
                                {isMuted ? (
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                  </svg>
                                ) : (
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                  </svg>
                                )}
                              </div>
                            </button>

                            {/* Botón de fullscreen para video promocional */}
                            {fullscreenSupported && (
                              <button
                                onClick={() => toggleFullscreen()}
                                className="flex items-center justify-center w-12 h-12 bg-black/30 hover:bg-black/40 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-105"
                                title="Pantalla completa"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Chat Container - Solo visible durante live stream */}
            {streamStatus === 'live' && showChat && (
              <div className={`${
                isMobile 
                  ? 'fixed bottom-4 right-4 left-4 h-96 z-50' 
                  : 'lg:col-span-2 h-96 lg:h-full'
              }`}>
                <YouTubeChat 
                  youtubeId={YOUTUBE_LIVE_ID}
                  language={language}
                  isVisible={showChat}
                  className={isMobile ? 'shadow-2xl' : ''}
                />
                
                {/* Botón para cerrar chat en móvil */}
                {isMobile && (
                  <button
                    onClick={() => setShowChat(false)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full text-white transition-all duration-200 z-10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PentecostesLive;