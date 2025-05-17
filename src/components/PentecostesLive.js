import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const PentecostesLive = ({ language }) => {
  // Configuración del evento
  const EVENT_DATE = new Date('2024-07-26T18:00:00-04:00');
  const SOON_TIME = new Date('2024-07-26T16:00:00-04:00');
  const LIVE_TIME = new Date('2024-07-26T17:50:00-04:00');
  const VIMEO_PROMO_ID = '1084753458';
  const X_EMBED_URL = 'https://platform.twitter.com/embed/Tweet.html?id=YOUR_TWEET_ID';

  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [streamStatus, setStreamStatus] = useState('promo');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const sectionRef = useRef(null);
  const playerRef = useRef(null);
  const vimeoPlayerRef = useRef(null);
  
  const texts = {
    es: {
      title: 'TRANSMISIÓN EN VIVO',
      subtitle: 'Sintoniza nuestra señal en directo',
      placeholder: 'Pentecostés - La fiesta del Espíritu',
      description: 'El evento Pentecostés será transmitido en vivo el 26 de Julio.',
      playText: 'REPRODUCIR',
      pauseText: 'PAUSAR',
      watchPromo: 'VER VIDEO',
      startingSoon: 'EMPEZARÁ PRONTO',
      liveNow: 'EN VIVO AHORA',
      muteText: 'SILENCIAR',
      unmuteText: 'ACTIVAR SONIDO',
      volumeText: 'Volumen'
    },
    en: {
      title: 'LIVE STREAM',
      subtitle: 'Tune in to our live broadcast',
      placeholder: 'Pentecost - The feast of the Spirit',
      description: 'The Pentecost event will be streamed live on July 26th.',
      playText: 'PLAY',
      pauseText: 'PAUSE',
      watchPromo: 'WATCH VIDEO',
      startingSoon: 'STARTING SOON',
      liveNow: 'LIVE NOW',
      muteText: 'MUTE',
      unmuteText: 'UNMUTE',
      volumeText: 'Volume'
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
          onEnter: () => {
            if (vimeoPlayerRef.current && isPlaying) {
              vimeoPlayerRef.current.setVolume(1);
              setIsMuted(false);
            }
          },
          onLeave: () => {
            if (vimeoPlayerRef.current) {
              vimeoPlayerRef.current.setVolume(0);
              setIsMuted(true);
            }
          },
          onEnterBack: () => {
            if (vimeoPlayerRef.current && isPlaying) {
              vimeoPlayerRef.current.setVolume(1);
              setIsMuted(false);
            }
          },
          onLeaveBack: () => {
            if (vimeoPlayerRef.current) {
              vimeoPlayerRef.current.setVolume(0);
              setIsMuted(true);
            }
          }
        },
      }
    );
  }, [isPlaying]);

  // Efecto adicional para manejar la visibilidad usando Intersection Observer
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && vimeoPlayerRef.current) {
            vimeoPlayerRef.current.setVolume(0);
            setIsMuted(true);
          }
        });
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
            await vimeoPlayerRef.current.play();
            setVideoLoaded(true);
            setPlayerReady(true);
            setIsPlaying(true);
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

  return (
    <section ref={sectionRef} id="live" className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white py-20">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-wider">{texts[language].title}</h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">{texts[language].subtitle}</p>
          <p className="text-md md:text-lg text-gray-400">{texts[language].description}</p>
        </div>

        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          {streamStatus === 'live' ? (
            // Embed de X para la transmisión en vivo
            <div className="w-full h-full">
              <iframe
                src={X_EMBED_URL}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen"
              ></iframe>
              <div className="absolute top-6 right-6">
                <span className="flex items-center bg-red-600 px-6 py-3 rounded-full text-sm font-bold">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  {texts[language].liveNow}
                </span>
              </div>
            </div>
          ) : streamStatus === 'soon' ? (
            // Pantalla de "Empezará pronto"
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-red-900/20 to-black">
              <div className="text-center">
                <div className="animate-pulse mb-4">
                  <span className="w-3 h-3 bg-red-600 rounded-full inline-block mr-2"></span>
                  <span className="w-3 h-3 bg-red-600 rounded-full inline-block mr-2 animate-pulse delay-100"></span>
                  <span className="w-3 h-3 bg-red-600 rounded-full inline-block animate-pulse delay-200"></span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-red-600">
                  {texts[language].startingSoon}
                </h3>
              </div>
            </div>
          ) : (
            // Video promocional
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
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PentecostesLive;