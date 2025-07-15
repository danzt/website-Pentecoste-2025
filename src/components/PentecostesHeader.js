import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// Registrar el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const PentecostesHeader = ({ onLanguageChange, language, compact = false }) => {
  // --- Configuración ---
  const VIMEO_VIDEO_ID = "1101559705";
  const MOBILE_VIMEO_VIDEO_ID = "1101559705";
  const BACKGROUND_IMAGE = "/static/logo-pentecostes.png";
  const LOGO_URL = "/static/logo-pentecostes.png";
  const EVENT_LOGO = "/static/pentecostes.2025.png";
  const EVENT_DATE = new Date("July 28, 2025 00:00:00");

  // --- Referencias ---
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const eventLogoRef = useRef(null);
  const videoRef = useRef(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const playerRef = useRef(null);
  const masterTimelineRef = useRef(null);
  const lenisRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const showEventLogoStateRef = useRef(false);
  const preloadTimeoutRef = useRef(null);

  // --- Estados ---
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [showEventLogo, setShowEventLogo] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);

  // Sincronizar estado con ref
  useEffect(() => {
    showEventLogoStateRef.current = showEventLogo;
  }, [showEventLogo]);

  // 1. INICIALIZACIÓN DE LENIS Y SCROLLTRIGGER
  useEffect(() => {
    // Inicializar Lenis
    lenisRef.current = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true
    });

    // Función de animación
    const raf = (time) => {
      lenisRef.current?.raf(time);
      animationFrameIdRef.current = requestAnimationFrame(raf);
    };
    animationFrameIdRef.current = requestAnimationFrame(raf);

    // Configurar ScrollTrigger para trabajar con Lenis
    const handleLenisScroll = () => {
      ScrollTrigger.update();
    };
    lenisRef.current.on('scroll', handleLenisScroll);

    // Configuración simplificada del scrollerProxy
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenisRef.current?.scrollTo(value, { immediate: true });
        }
        return lenisRef.current?.scroll || window.pageYOffset;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed"
    });

    // Forzar un refresh después de configurar el proxy
    ScrollTrigger.refresh();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.off('scroll', handleLenisScroll);
        lenisRef.current.destroy();
      }
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      ScrollTrigger.clearMatchMedia();
      ScrollTrigger.refresh();
    };
  }, []);

  // 2. DETECCIÓN DE DISPOSITIVO MÓVIL
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && playerRef.current) {
        playerRef.current.destroy().catch(e => console.warn("Error destroying player on mobile switch", e));
        playerRef.current = null;
        setPlayerReady(false);
      }
    };
    
    // Detectar la calidad de conexión
    const checkConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === '4g') {
          return 'auto';
        } else if (connection.effectiveType === '3g') {
          return '540p';
        } else {
          return '360p';
        }
      }
      return isMobile ? '540p' : 'auto';
    };

    // Actualizar calidad cuando cambia la conexión
    const handleConnectionChange = () => {
      if (playerRef.current) {
        const quality = checkConnectionSpeed();
        playerRef.current.setQuality(quality).catch(console.warn);
      }
    };

    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  // Función auxiliar para determinar la calidad inicial del video
  const getInitialVideoQuality = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType === '4g') {
        return isMobile ? '720p' : 'auto';
      } else if (connection.effectiveType === '3g') {
        return '540p';
      } else {
        return '360p';
      }
    }
    return isMobile ? '540p' : 'auto';
  };

  // 3. EFECTO DE SCROLL PARA NAVBAR
  useEffect(() => {
    const handleNavScroll = () => {
      const scrollThreshold = 50;
      const currentScrollY = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
      const opacity = Math.min(currentScrollY / (scrollThreshold * 2.5), 0.9);

      if (navRef.current) {
        gsap.to(navRef.current, {
          backgroundColor: `rgba(0, 0, 0, ${currentScrollY > scrollThreshold ? opacity : 0})`,
          backdropFilter: currentScrollY > scrollThreshold ? "blur(10px)" : "none",
          duration: 0.3,
          ease: "power1.out"
        });
      }
    };

    if (lenisRef.current) {
      lenisRef.current.on('scroll', handleNavScroll);
    } else {
      window.addEventListener("scroll", handleNavScroll, { passive: true });
    }

    return () => {
      if (lenisRef.current) {
        lenisRef.current.off('scroll', handleNavScroll);
      } else {
        window.removeEventListener("scroll", handleNavScroll);
      }
    };
  }, []);

  // 4. VERIFICAR TRANSMISIÓN EN VIVO
  useEffect(() => {
    const checkLive = () => setIsLive(new Date() >= EVENT_DATE);
    checkLive();
    const timer = setInterval(checkLive, 60000);
    return () => clearInterval(timer);
  }, [EVENT_DATE]);

  // Efecto para precargar el SDK de Vimeo
  useEffect(() => {
    const preloadVimeoSDK = async () => {
      try {
        if (!window.Vimeo) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://player.vimeo.com/api/player.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
      } catch (error) {
        console.warn('Error precargando SDK de Vimeo:', error);
      }
    };

    preloadVimeoSDK();
  }, []);

  // Efecto para precargar el video
  useEffect(() => {
    const preloadVideo = () => {
      const videoId = isMobile ? MOBILE_VIMEO_VIDEO_ID : VIMEO_VIDEO_ID;
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'video';
      preloadLink.href = `https://player.vimeo.com/video/${videoId}/config`;
      document.head.appendChild(preloadLink);

      // Iniciar precarga después de un breve delay
      preloadTimeoutRef.current = setTimeout(() => {
        setIsPreloading(false);
      }, 1000);
    };

    preloadVideo();

    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, [isMobile]);

  // 5. INICIALIZAR REPRODUCTOR DE VIMEO
  useEffect(() => {
    const initVimeoPlayer = async () => {
      try {
        // 1. Limpiar cualquier instancia previa
        if (playerRef.current) {
          try {
            await playerRef.current.destroy();
          } catch (e) {
            console.warn('Error al destruir el reproductor anterior:', e);
          }
          playerRef.current = null;
        }

        // 2. Asegurarse de que el elemento contenedor existe
        if (!videoRef.current) {
          throw new Error('El elemento contenedor del video no existe');
        }

        // 3. Cargar el SDK de Vimeo si no está disponible
        if (isPreloading) return; // No inicializar hasta que la precarga esté lista

        // 4. Crear el iframe y configurar el reproductor inmediatamente
        const videoId = isMobile ? MOBILE_VIMEO_VIDEO_ID : VIMEO_VIDEO_ID;
        
        // Crear el iframe con todos los parámetros optimizados para carga rápida
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&quality=auto&dnt=1&muted=1&preload=metadata&loading=eager&playsinline=1`);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'autoplay; fullscreen');
        iframe.setAttribute('loading', 'eager');
        iframe.style.cssText = 'width:100%;height:100%;position:absolute;top:0;left:0;';
        
        // Limpiar el contenedor y agregar el iframe
        videoRef.current.innerHTML = '';
        videoRef.current.appendChild(iframe);

        // 5. Inicializar el reproductor con configuración optimizada
        playerRef.current = new window.Vimeo.Player(iframe, {
          id: videoId,
          background: true,
          autoplay: true,
          loop: true,
          muted: true,
          controls: false,
          responsive: true,
          dnt: true,
          playsinline: true,
          autopause: false,
          transparent: false,
          quality: getInitialVideoQuality(),
          speed: true,
          preload: 'metadata',
          pip: false,
          portrait: false,
          title: false,
          byline: false
        });

        // 6. Configurar eventos con manejo de errores mejorado
        const initializePlayer = async () => {
          try {
            await playerRef.current.ready();
            await playerRef.current.play();
            setVideoLoaded(true);
            setPlayerReady(true);
          } catch (error) {
            console.error('Error en la inicialización del reproductor:', error);
            // Reintentar la inicialización después de un breve delay
            setTimeout(initializePlayer, 1000);
          }
        };

        playerRef.current.on('loaded', initializePlayer);
        
        playerRef.current.on('error', async (error) => {
          console.error('Error en el reproductor:', error);
          // Reintentar la reproducción en caso de error
          try {
            await playerRef.current.play();
          } catch (playError) {
            console.error('Error al reintentar reproducción:', playError);
            setTimeout(initializePlayer, 1000);
          }
        });

        // 7. Iniciar reproducción inmediatamente
        initializePlayer();

      } catch (error) {
        console.error('Error al inicializar el reproductor de Vimeo:', error);
        setVideoLoaded(false);
        setPlayerReady(false);
        // Reintentar la inicialización después de un delay más corto
        setTimeout(initVimeoPlayer, 1000);
      }
    };

    initVimeoPlayer();

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.unload();
          playerRef.current.destroy();
        } catch (e) {
          console.warn('Error al limpiar el reproductor:', e);
        }
      }
    };
  }, [isMobile, isPreloading]);

  // 6. EFECTO CINEMATOGRÁFICO PRINCIPAL
  useEffect(() => {
    if (!playerReady && !isMobile) return;

    if (masterTimelineRef.current) masterTimelineRef.current.kill();
    gsap.killTweensOf([titleRef.current, subtitleRef.current, eventLogoRef.current]);

    const initPlayerAndTimeline = async () => {
      try {
        const videoId = isMobile ? MOBILE_VIMEO_VIDEO_ID : VIMEO_VIDEO_ID;
        const videoDuration = isMobile ? 8 : await playerRef.current?.getDuration() || 8;
        
        setShowTitle(true);
        setShowVideo(true);
        setShowEventLogo(false);
        setVideoStarted(false);

        masterTimelineRef.current = gsap.timeline({
          paused: true,
          onStart: () => {
            setShowTitle(true);
            setShowVideo(true);
            setShowEventLogo(false);
            setVideoStarted(false);
            gsap.set(eventLogoRef.current, { opacity: 0, scale: 0.5, y: "50px" });
            gsap.set(titleRef.current, { opacity: 0, y: "30px" });
            gsap.set(subtitleRef.current, { opacity: 0, y: "20px" });
          },
        });

        // Animación común para móvil y desktop
        masterTimelineRef.current
          .to(titleRef.current, { opacity: 1, y: "0px", duration: 0.8, ease: "power3.out" }, "textIn")
          .to(subtitleRef.current, { opacity: 1, y: "0px", duration: 0.6, ease: "power3.out" }, "textIn+=0.3")
          .to([titleRef.current, subtitleRef.current], { 
            opacity: 0, 
            y: "-20px",
            duration: 0.5, 
            ease: "power2.in",
            onComplete: () => {
              setShowTitle(false);
              gsap.set([titleRef.current, subtitleRef.current], { display: "none" });
            }
          }, "+=2.5");

        // Resto de la animación específica para cada plataforma
        if (!isMobile) {
          masterTimelineRef.current
            .call(() => {
              setTimeout(() => {
                setVideoStarted(true);
                playerRef.current?.play().catch(e => console.error("Error playing video via API:", e));
              }, 500);
            }, null, ">+0.1")
            .to({}, { duration: videoDuration }, ">")
            .call(() => {
              setShowVideo(false);
              setShowEventLogo(true);
              setShowTitle(true);
              gsap.set([titleRef.current, subtitleRef.current], { display: "block", opacity: 0 });
            })
            .to(eventLogoRef.current, { opacity: 1, scale: 1.2, y: "0px", duration: 1, ease: "power3.out" }, "logoIn")
            .to(titleRef.current, { opacity: 1, y: "0px", duration: 1, ease: "power3.out" }, "logoIn");
        }

        masterTimelineRef.current.play();

      } catch (error) {
        console.error("Error initializing timeline:", error);
      }
    };

    initPlayerAndTimeline();

    return () => {
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
        masterTimelineRef.current = null;
      }
      gsap.killTweensOf([titleRef.current, subtitleRef.current, eventLogoRef.current]);
    };
  }, [playerReady, isMobile]);

  // 7. SCROLLTRIGGER PARA REINICIAR ANIMACIÓN DEL HEADER
  useEffect(() => {
    if (!headerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: headerRef.current,
      start: "top top",
      end: "bottom top",
      onEnter: () => {
        if (
          masterTimelineRef.current &&
          titleRef.current &&
          subtitleRef.current
        ) {
          gsap.set([titleRef.current, subtitleRef.current], { display: "block", opacity: 0 });
          masterTimelineRef.current.restart(true);
          masterTimelineRef.current.play();
        }
        setShowTitle(true);
        setShowVideo(true);
        setShowEventLogo(false);
        setVideoStarted(false);
      },
      onEnterBack: () => {
        if (
          masterTimelineRef.current &&
          titleRef.current &&
          subtitleRef.current
        ) {
          gsap.set([titleRef.current, subtitleRef.current], { display: "block", opacity: 0 });
          masterTimelineRef.current.restart(true);
          masterTimelineRef.current.play();
        }
        setShowTitle(true);
        setShowVideo(true);
        setShowEventLogo(false);
        setVideoStarted(false);
      },
      onLeave: () => {
        if (
          masterTimelineRef.current &&
          titleRef.current &&
          subtitleRef.current
        ) {
          masterTimelineRef.current.pause();
          gsap.set([titleRef.current, subtitleRef.current], { display: "none" });
        }
        setShowTitle(false);
        setShowVideo(false);
        setShowEventLogo(false);
        setVideoStarted(false);
      },
      onLeaveBack: () => {
        if (
          masterTimelineRef.current &&
          titleRef.current &&
          subtitleRef.current
        ) {
          masterTimelineRef.current.pause();
          gsap.set([titleRef.current, subtitleRef.current], { display: "none" });
        }
        setShowTitle(false);
        setShowVideo(false);
        setShowEventLogo(false);
        setVideoStarted(false);
      }
    });

    return () => {
      if (st) st.kill();
    };
  }, [playerReady, isMobile]);

  // --- FUNCIONES DE NAVEGACIÓN ---
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const targetElement = document.getElementById(id);
    if (targetElement && lenisRef.current) {
      lenisRef.current.scrollTo(targetElement, { offset: 0 });
    } else if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
    if (menuOpen) setMenuOpen(false);
  };

  const handleLiveClick = (e) => {
    scrollToSection(e, "live");
  };

  // Implement multilingual support for section navigation
  const sectionNames = {
    es: ['Inicio', 'Pentecostes', 'Transmisión', 'Multivisión', 'Cuenta Regresiva', 'Galería'],
    en: ['Home', 'Hero', 'Live', 'Multivision', 'Countdown', 'Gallery']
  };

  // --- JSX DEL COMPONENTE ---
  return (
    <header
      ref={headerRef}
      className={`relative w-full ${compact ? 'h-32' : 'h-screen'} overflow-hidden z-30`}
    >
      {/* Video de fondo - solo si no es compacto */}
      {!compact && (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div
            ref={videoRef}
            className="absolute inset-0 w-full h-full"
          />
          {!videoLoaded && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      {/* Fondo sólido para modo compacto */}
      {compact && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900" />
      )}

      {/* Navbar */}
      <nav
        ref={navRef}
        className={`${compact ? 'relative' : 'fixed'} top-0 left-0 w-full px-6 py-1 flex justify-between items-center z-50`}
        style={{ backgroundColor: compact ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0)', backdropFilter: compact ? 'blur(10px)' : 'none' }}
      >
        <div className="flex items-center">
          <img
            src={LOGO_URL}
            alt="Pentecostés Main Logo"
            className="h-10 w-auto"
            style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.7))' }}
          />
        </div>

        {/* Menú de navegación Desktop */}
        <div className="hidden md:flex space-x-8 lg:space-x-10 items-center">
          {sectionNames[language].map((item, index) => (
            <a
              key={item}
              href={`#${['home', 'hero', 'live', 'multivision', 'countdown', 'gallery'][index]}`}
              onClick={(e) => scrollToSection(e, ['home', 'hero', 'live', 'multivision', 'countdown', 'gallery'][index])}
              className="text-white font-medium hover:text-purple-300 transition-colors duration-200"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
            >
              {item}
            </a>
          ))}
          {isLive && (
            <button
              onClick={handleLiveClick}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold transition animate-pulse"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              EN VIVO
            </button>
          )}
          <select
            onChange={onLanguageChange}
            defaultValue={language}
            className="bg-transparent text-white border border-white rounded px-2 py-1 ml-4 focus:outline-none focus:ring-1 focus:ring-purple-300 cursor-pointer"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
          >
            <option value="es" className="text-black">ES</option>
            <option value="en" className="text-black">EN</option>
          </select>
        </div>

        {/* Botón menú móvil */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.7))' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div
          className="md:hidden fixed top-16 left-0 w-full py-4 px-6 space-y-2 z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)' }}
        >
          {sectionNames[language].map((item, index) => (
             <a 
               key={item} 
               href={`#${['home', 'hero', 'live', 'multivision', 'countdown', 'gallery'][index]}`} 
               onClick={(e) => scrollToSection(e, ['home', 'hero', 'live', 'multivision', 'countdown', 'gallery'][index])} 
               className="block text-white hover:text-purple-300 py-2 text-lg"
             >
               {item}
             </a>
          ))}
          {isLive && (
            <button
              onClick={(e) => { handleLiveClick(e); setMenuOpen(false); }}
              className="block w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-full font-bold mt-2 text-lg animate-pulse"
            >
              EN VIVO
            </button>
          )}
          <select
            onChange={(e) => { onLanguageChange(e); setMenuOpen(false); }}
            defaultValue="es"
            className="bg-transparent text-white border border-white rounded px-2 py-2.5 mt-3 w-full text-lg"
          >
            <option value="es" className="text-black">Español</option>
            <option value="en" className="text-black">English</option>
          </select>
        </div>
      )}

      {/* Contenido principal del Header */}
      {/* Solo mostrar el contenido principal si no es compacto */}
      {!compact && showTitle && (
        <div className="header-content relative z-20 h-full flex flex-col justify-center items-center text-center px-6 pointer-events-none">
          <h1
            ref={titleRef}
            className="text-white text-4xl md:text-6xl font-extrabold mb-4"
            style={{ 
              textShadow: '0 2px 10px rgba(0,0,0,0.8)', 
              filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.9))'
            }}
          >
            Pentecostés
          </h1>
          <p
            ref={subtitleRef}
            className="text-white text-lg md:text-2xl font-medium"
            style={{ 
              textShadow: '0 1px 5px rgba(0,0,0,0.8)'
            }}
          >
            La Fiesta del Espíritu
          </p>
        </div>
      )}

      {/* Contenido compacto para el día del evento */}
      {compact && (
        <div className="header-content relative z-20 h-full flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-white text-2xl md:text-3xl font-bold">
            Pentecostés 2025
          </h1>
          <p className="text-white text-sm md:text-base opacity-80">
            La Fiesta del Espíritu
          </p>
        </div>
      )}
    </header>
  );
};

export default PentecostesHeader;