import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// Registrar el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const PentecostesHeader = ({ onLanguageChange, language }) => {
  // --- Configuración ---
  const VIMEO_VIDEO_ID = "1084753458";
  const MOBILE_VIMEO_VIDEO_ID = "1085025631";
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

  // --- Estados ---
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [showEventLogo, setShowEventLogo] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);

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
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // 5. CARGAR REPRODUCTOR VIMEO (SOLO DESKTOP)
  useEffect(() => {
    if (isMobile) {
      if (playerRef.current) {
        playerRef.current.destroy().catch(e => console.warn("Error destroying player on mobile", e));
        playerRef.current = null;
      }
      setPlayerReady(false);
      return;
    }

    if (window.Vimeo && !playerReady) {
      setPlayerReady(true);
      return;
    }
    
    if (!window.Vimeo && !document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.onload = () => {
        if (!isMobile) {
          setPlayerReady(true);
        }
      };
      script.onerror = () => {
        console.error("Failed to load Vimeo Player API.");
        setPlayerReady(false);
      }
      document.body.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
    } else if (window.Vimeo && !playerReady && !isMobile) {
      setPlayerReady(true);
    }
  }, [isMobile, playerReady]);

  // 6. EFECTO CINEMATOGRÁFICO PRINCIPAL
  useEffect(() => {
    if (!playerReady || isMobile || !window.Vimeo || !videoRef.current) {
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
        masterTimelineRef.current = null;
      }
      gsap.set([titleRef.current, subtitleRef.current, eventLogoRef.current], { clearProps: "all" });
      setShowTitle(true);
      setShowVideo(true);
      setShowEventLogo(false);
      setVideoStarted(false);
      return;
    }

    if (masterTimelineRef.current) masterTimelineRef.current.kill();
    gsap.killTweensOf([titleRef.current, subtitleRef.current, eventLogoRef.current]);

    const initPlayerAndTimeline = async () => {
      try {
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          await playerRef.current.destroy();
        }
        playerRef.current = new window.Vimeo.Player(videoRef.current);
        await playerRef.current.ready();

        const videoDuration = await playerRef.current.getDuration();
        if (!videoDuration || videoDuration <= 0) {
          console.error("Cinematic: Could not get valid video duration. Duration:", videoDuration);
          return;
        }

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

        masterTimelineRef.current
          .to(titleRef.current, { opacity: 1, y: "0px", duration: 0.8, ease: "power3.out" }, "textIn")
          .to(subtitleRef.current, { opacity: 1, y: "0px", duration: 0.6, ease: "power3.out" }, "textIn+=0.3")
          .to([titleRef.current, subtitleRef.current], { opacity: 0, duration: 0.5, ease: "power2.in", onComplete: () => setShowTitle(false) }, "+=2.5")
          .call(() => {
            setTimeout(() => {
              setVideoStarted(true);
              playerRef.current.play().catch(e => console.error("Error playing video via API:", e));
            }, 500); // Espera 0.5s antes de iniciar el video
          }, null, ">+0.1")
          .to({}, { duration: videoDuration + 0.5 }, ">")
          .call(() => {
            setShowVideo(false);
            setShowEventLogo(true);
            setShowTitle(true);
          })
          .to(eventLogoRef.current, { opacity: 1, scale: 1.2, y: "0px", duration: 1, ease: "power3.out" }, "logoIn")
          .to(titleRef.current, { opacity: 1, y: "0px", duration: 1, ease: "power3.out" }, "logoIn");

        masterTimelineRef.current.play();
      } catch (error) {
        console.error("Error initializing Vimeo player or timeline:", error);
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy().catch(e => console.warn("Destroy failed after error", e));
          playerRef.current = null;
        }
      }
    };

    initPlayerAndTimeline();

    // Cuando termina el video, NO lo repite, muestra el logo
    const handleEnded = () => {
      setShowVideo(false);
      setShowEventLogo(true);
      setShowTitle(false);
      setVideoStarted(false);
    };
    if (playerRef.current && typeof playerRef.current.on === 'function') {
      playerRef.current.on('ended', handleEnded);
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.off === 'function') {
        playerRef.current.off('ended', handleEnded);
      }
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
        masterTimelineRef.current = null;
      }
      gsap.killTweensOf([titleRef.current, subtitleRef.current, eventLogoRef.current]);
    };
  }, [playerReady, isMobile]);

  // 7. SCROLLTRIGGER PARA REINICIAR ANIMACIÓN DEL HEADER
  useEffect(() => {
    if (!headerRef.current || isMobile || !playerReady) return;

    const st = ScrollTrigger.create({
      trigger: headerRef.current,
      start: "top top",
      end: "bottom top",
      onEnter: () => {
        if (masterTimelineRef.current) {
          masterTimelineRef.current.restart(true);
          masterTimelineRef.current.play();
        }
        setShowTitle(true);
        setShowVideo(true);
        setShowEventLogo(false);
        setVideoStarted(false);
      },
      onEnterBack: () => {
        if (masterTimelineRef.current) {
          masterTimelineRef.current.restart(true);
          masterTimelineRef.current.play();
        }
        setShowTitle(true);
        setShowVideo(true);
        setShowEventLogo(false);
        setVideoStarted(false);
      },
      onLeave: () => {
        if (masterTimelineRef.current) {
          masterTimelineRef.current.pause();
        }
        setShowTitle(false);
        setShowVideo(false);
        setShowEventLogo(false);
        setVideoStarted(false);
      },
      onLeaveBack: () => {
        if (masterTimelineRef.current) {
          masterTimelineRef.current.pause();
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
      className="relative w-full h-screen overflow-hidden z-30"
    >
      {/* Video de fondo / Fallback para móviles */}
      {showVideo && (
        <div className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700" style={{ opacity: showVideo ? 1 : 0 }}>
          <iframe
            ref={videoRef}
            src={`https://player.vimeo.com/video/${isMobile ? MOBILE_VIMEO_VIDEO_ID : VIMEO_VIDEO_ID}?background=1&autoplay=1&loop=0&muted=1&autopause=0&controls=0&dnt=1`}
            className="absolute inset-0 w-full h-full object-cover"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={`Vimeo Video Background ${isMobile ? MOBILE_VIMEO_VIDEO_ID : VIMEO_VIDEO_ID}`}
            loading="eager"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
      )}
      {!isMobile && showEventLogo && (
        <div
          ref={eventLogoRef}
          className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
          style={{ opacity: showEventLogo ? 1 : 0, background: 'black' }}
        >
          <img
            src={EVENT_LOGO}
            alt="Logo Oficial Pentecostés Evento"
            className="w-64 md:w-96 h-auto"
            style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))' }}
          />
        
        </div>
      )}
      {isMobile && (
        <div className="absolute inset-0 w-full h-full">
          {/* <img
            src={BACKGROUND_IMAGE}
            alt="Background Pentecostes Event"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black opacity-70"></div> */}
        </div>
      )}

      {/* Navbar */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full px-6 py-1 flex justify-between items-center z-50`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', backdropFilter: 'none' }}
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
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-bold transition"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              EN VIVO
            </button>
          )}
          <select
            onChange={onLanguageChange}
            defaultValue="es"
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
              className="block w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-full font-bold mt-2 text-lg"
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
      <div className="header-content relative z-20 h-full flex flex-col justify-center items-center text-center px-6 pointer-events-none">
        {showTitle && (
          <>
            <h1
              ref={titleRef}
              className="text-white text-4xl md:text-6xl font-extrabold mb-4 opacity-0"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)', filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.9))' }}
            >
              Pentecostés
            </h1>
            <p
              ref={subtitleRef}
              className="text-white text-lg md:text-2xl font-medium opacity-0"
              style={{ textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}
            >
              La Fiesta del Espíritu
            </p>
          </>
        )}
      </div>
    </header>
  );
};

export default PentecostesHeader;