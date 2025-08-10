import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFullscreen } from "../hooks/useFullscreen";
import YouTubeChat from "./YouTubeChat";
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const PentecostesLive = ({
  language,
  priority = "normal",
  autoFocus = false,
}) => {
  // Configuración del evento
  const EVENT_DATE = new Date("2025-08-10T18:00:00-04:00");
  const SOON_TIME = new Date("2025-08-10T16:00:00-04:00");
  const LIVE_TIME = new Date("2025-08-10T17:50:00-04:00");
  // Videos - ID estático directo
  const YOUTUBE_LIVE_ID = "fxJ1IMMnyVM"; // Cambiar este ID cuando sea necesario
  const YOUTUBE_LIVE_URL = `https://www.youtube.com/embed/${YOUTUBE_LIVE_ID}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
  const VIMEO_PROMO_ID = "1101559705"; // Video promocional de Vimeo
  
  // Variable para mostrar información del evento (cambiar a true el día del evento)
  const SHOW_EVENT_INFO = false; // Cambiar a true para mostrar información del evento

  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [streamStatus, setStreamStatus] = useState("promo");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Hook de fullscreen
  const {
    isFullscreen,
    isSupported: fullscreenSupported,
    toggleFullscreen,
    setElementRef,
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
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Configurar elemento para fullscreen
  useEffect(() => {
    if (videoContainerRef.current) {
      setElementRef(videoContainerRef.current);
    }
  }, [setElementRef]);

  const texts = {
    es: {
      title:
        priority === "high" ? "🔴 TRANSMISIÓN EN VIVO" : "TRANSMISIÓN EN VIVO",
      subtitle:
        priority === "high"
          ? "Sintoniza AHORA nuestra señal en directo"
          : "Sintoniza nuestra señal en directo",
      placeholder: "Pentecostés - La fiesta del Espíritu",
      description:
        priority === "high"
          ? "El evento Pentecostés está siendo transmitido EN VIVO."
          : "El evento Pentecostés será transmitido en vivo el 10 de Agosto.",
      playText: "REPRODUCIR",
      pauseText: "PAUSAR",
      watchPromo: "VER VIDEO",
      startingSoon: "EMPEZARÁ PRONTO",
      liveNow: "EN VIVO AHORA",
      muteText: "SILENCIAR",
      unmuteText: "ACTIVAR SONIDO",
      volumeText: "Volumen",
      showChat: "Mostrar Chat",
      hideChat: "Ocultar Chat",
      chatToggle: "Chat",
    },
    en: {
      title: priority === "high" ? "🔴 LIVE STREAM" : "LIVE STREAM",
      subtitle:
        priority === "high"
          ? "Tune in NOW to our live broadcast"
          : "Tune in to our live broadcast",
      placeholder: "Pentecost - The feast of the Spirit",
      description:
        priority === "high"
          ? "The Pentecost event is being streamed LIVE now."
          : "The Pentecost event will be streamed live on August 10th.",
      playText: "PLAY",
      pauseText: "PAUSE",
      watchPromo: "WATCH VIDEO",
      startingSoon: "STARTING SOON",
      liveNow: "LIVE NOW",
      muteText: "MUTE",
      unmuteText: "UNMUTE",
      volumeText: "Volume",
      showChat: "Show Chat",
      hideChat: "Hide Chat",
      chatToggle: "Chat",
    },
  };

  // Variable para forzar modo live durante pruebas
  const FORCE_LIVE_MODE = YOUTUBE_LIVE_ID ? true : false; // Solo forzar live si hay ID

  // Función para determinar el estado inicial
  const getInitialStreamStatus = () => {
    const now = new Date();
    const currentTime = now.getTime();

    // Para pruebas: siempre mostrar live si FORCE_LIVE_MODE es true
    if (FORCE_LIVE_MODE) {
      return "live";
    }

    // Si la fecha actual es posterior al evento, mostrar promo
    if (currentTime > EVENT_DATE.getTime()) {
      return "promo";
    }

    // Durante el evento
    if (
      currentTime >= LIVE_TIME.getTime() &&
      currentTime <= EVENT_DATE.getTime()
    ) {
      return "live";
    }

    // Próximo a comenzar
    if (
      currentTime >= SOON_TIME.getTime() &&
      currentTime < LIVE_TIME.getTime()
    ) {
      return "soon";
    }

    // Estado por defecto - antes del evento
    return "promo";
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
    if (priority === 'high') return undefined; // Evitar animación cuando es la sección principal
    if (prefersReducedMotion) return undefined;
    const element = sectionRef.current;
    if (!element) return undefined;
    let animation;
    try {
      animation = gsap.fromTo(
        element,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          // Evitar ScrollTrigger cuando priority es high para no necesitar scrollear
          ...(priority === 'high' ? {} : {
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            }
          }),
        },
      );
    } catch (e) {
      console.error("GSAP animation error:", e, element);
    }
    return () => {
      if (animation) {
        try {
          if (animation.scrollTrigger) {
            animation.scrollTrigger.kill();
          }
          animation.kill();
        } catch (e) {
          // noop
        }
      }
    };
  }, [isPlaying]);

  // Efecto adicional para manejar la visibilidad usando Intersection Observer
  useEffect(() => {
    if (!sectionRef.current) return;

    // Verificar que el elemento existe antes de crear el observer
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Eliminar lógica de mute/unmute automático por visibilidad
      },
      {
        threshold: 0.3, // El video se silenciará cuando menos del 30% esté visible
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Eliminar referencias a VIMEO_PROMO_ID y lógica promo/soon

  // Efecto para manejar la visibilidad de la página (removido - ya no necesario sin Vimeo)

  // Efecto para auto-focus cuando la prioridad es alta
  useEffect(() => {
    if (autoFocus && sectionRef.current) {
      const timer = setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
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
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        resetTimeout();
      }
    };

    // Eventos para mostrar/ocultar controles
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);

    if (videoContainerRef.current) {
      videoContainerRef.current.addEventListener(
        "mouseleave",
        handleMouseLeave,
      );
    }

    // Iniciar timeout
    resetTimeout();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
      if (videoContainerRef.current) {
        videoContainerRef.current.removeEventListener(
          "mouseleave",
          handleMouseLeave,
        );
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  // Funciones togglePlay y toggleMute removidas - no necesarias para YouTube Live

  // Determinar clases CSS basadas en prioridad
  const getSectionClasses = () => {
    const baseClasses =
      "relative flex flex-col justify-center items-center bg-black text-white py-20";

    if (priority === "high") {
      return `${baseClasses} min-h-screen border-4 border-red-600 border-opacity-50`;
    } else {
      return `${baseClasses} min-h-screen`;
    }
  };

  const getTitleClasses = () => {
    if (priority === "high") {
      return "text-6xl md:text-8xl font-black mb-8 tracking-wider animate-pulse text-red-400";
    } else {
      return "text-5xl md:text-7xl font-bold mb-6 tracking-wider";
    }
  };

  const getVideoContainerClasses = () => {
    if (priority === "high") {
      return "relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-red-600 border-opacity-70";
    } else {
      return "relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800";
    }
  };

  // Render principal: solo el live de YouTube y el chat
  return (
    <section ref={sectionRef} id="live" className={getSectionClasses()}>
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
        <div className="w-full">
          {/* Video Container */}
          <div 
            ref={videoContainerRef}
            className={`w-full ${getVideoContainerClasses()} ${isFullscreen ? 'fixed inset-0 z-[9999] bg-black rounded-none border-none' : ''}`}
          >
            <div className="w-full h-full relative">
              {streamStatus === "live" ? (
                // Video en vivo de YouTube
                <iframe
                  key={`yt-${YOUTUBE_LIVE_ID}-${streamStatus}`}
                  src={YOUTUBE_LIVE_URL}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Pentecostés 2025 - Transmisión en Vivo"
                  onLoad={() => setVideoLoaded(true)}
                />
              ) : (
                // Video promocional de Vimeo
                <iframe
                  key={`vimeo-promo-${VIMEO_PROMO_ID}`}
                  src={`https://player.vimeo.com/video/${VIMEO_PROMO_ID}?h=1234567890&autoplay=1&loop=1&muted=1&controls=0&background=1&title=0&byline=0&portrait=0`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  title="Pentecostés 2025 - Video Promocional"
                />
              )}
              {/* Controles overlay para fullscreen */}
              {isFullscreen && (
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6 pointer-events-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${streamStatus === "live" ? "bg-red-500" : "bg-blue-500"}`}></div>
                        <span className="text-white font-bold text-lg">
                          {streamStatus === "live" ? `🔴 ${texts[language].liveNow}` : "🎬 Video Promocional"}
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pointer-events-auto">
                    <div className="text-center">
                      <h3 className="text-white text-2xl font-bold mb-2">Pentecostés 2025</h3>
                      <p className="text-white/80">La Fiesta del Espíritu</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Indicador de live normal */}
              {!isFullscreen && streamStatus === "live" && (
                <div className="absolute top-6 right-6">
                  {/* <span className={`flex items-center ${priority === 'high' ? 'bg-red-600 px-8 py-4 text-lg' : 'bg-red-600 px-6 py-3 text-sm'} rounded-full font-bold`}>
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                    {texts[language].liveNow}
                  </span> */}
                </div>
              )}
              {/* Botón de fullscreen para live */}
              {!isFullscreen && fullscreenSupported && streamStatus === "live" && (
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
              {/* Indicador de cargando para live */}
              {streamStatus === 'live' && !videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PentecostesLive;
