import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const PentecostesHero = ({ language }) => {
  const [loaded, setLoaded] = useState(false);
  
  // Referencias para las animaciones
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const locationRef = useRef(null);
  const containerRef = useRef(null);

  const texts = {
    es: {
      title: 'PENTECOSTÉS',
      subtitle: 'La fiesta del Espíritu',
      date: 'SÁBADO 26 DE JULIO',
      time: '6:00 PM / ENTRADA GRATIS',
      location: 'ESTADIO JOSÉ DAVID UGARTE',
      cta: 'RESERVAR ENTRADA'
    },
    en: {
      title: 'PENTECOST',
      subtitle: 'The feast of the Spirit',
      date: 'SATURDAY JULY 26TH',
      time: '6:00 PM / FREE ENTRANCE',
      location: 'JOSÉ DAVID UGARTE STADIUM',
      cta: 'RESERVE TICKET'
    }
  };

  useEffect(() => {
    // Inicializar Lenis para smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Conectar Lenis con GSAP
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Reset inicial de los elementos
    gsap.set([titleRef.current, subtitleRef.current, dateRef.current, timeRef.current, locationRef.current], {
      y: 100,
      opacity: 0
    });

    // Crear timeline para las animaciones
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "center center",
        scrub: 1,
        markers: false,
      }
    });

    // Secuencia de animaciones
    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power4.out"
    })
    .to(subtitleRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
    }, "-=1")
    .to([dateRef.current, timeRef.current, locationRef.current], {
      y: 0,
      opacity: 1,
      stagger: 0.2,
      duration: 0.8,
    }, "-=0.8");

    // Efecto parallax en el contenedor
    gsap.to(containerRef.current, {
      y: 100,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    setLoaded(true);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="home" 
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-60"></div>
        {/* <div className="w-full h-full bg-[url('https://source.unsplash.com/random/1920x1080/?worship')] bg-cover bg-center filter brightness-75"></div> */}
      </div>

      <div 
        ref={containerRef}
        className="container mx-auto px-4 z-10 text-center"
      >
        <h1 
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-wider text-white transform px-2"
          style={{ 
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            letterSpacing: '0.05em'
          }}
        >
          {texts[language].title}
        </h1>
        <p 
          ref={subtitleRef}
          className="text-xl sm:text-2xl md:text-3xl mb-8 font-light tracking-wide text-white transform px-2"
          style={{ 
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            letterSpacing: '0.02em'
          }}
        >
          {texts[language].subtitle}
        </p>
        
        <div className="space-y-4 mt-8 px-2">
          <p 
            ref={dateRef}
            className="text-lg sm:text-xl md:text-2xl font-bold tracking-widest text-white transform"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            {texts[language].date}
          </p>
          <p 
            ref={timeRef}
            className="text-base sm:text-lg md:text-xl tracking-wider text-gray-300 transform"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}
          >
            {texts[language].time}
          </p>
          <p 
            ref={locationRef}
            className="text-base sm:text-lg md:text-xl tracking-wider text-gray-300 transform"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}
          >
            {texts[language].location}
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default PentecostesHero;