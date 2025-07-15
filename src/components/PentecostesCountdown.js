import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const PentecostesCountdown = ({ language, isLive = false, isEventDay = false, priority = 'normal' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const texts = {
    es: {
      title: priority === 'urgent' ? '¡YA COMENZÓ!' : priority === 'high' ? 'CUENTA REGRESIVA' : 'CUENTA REGRESIVA',
      subtitle: priority === 'urgent' ? 'El evento está en vivo ahora' : isEventDay ? '¡Hoy es el día! El evento comienza en' : 'El evento comienza en',
      days: 'DÍAS',
      hours: 'HORAS',
      minutes: 'MINUTOS',
      seconds: 'SEGUNDOS',
      liveNow: '¡EN VIVO AHORA!',
      eventStarted: '¡El evento ha comenzado!'
    },
    en: {
      title: priority === 'urgent' ? 'IT HAS STARTED!' : priority === 'high' ? 'COUNTDOWN' : 'COUNTDOWN',
      subtitle: priority === 'urgent' ? 'The event is live now' : isEventDay ? 'Today is the day! Event starts in' : 'Event starts in',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINUTES',
      seconds: 'SECONDS',
      liveNow: 'LIVE NOW!',
      eventStarted: 'The event has started!' 
    }
  };

  const blocksRef = useRef([]);
  const sectionRef = useRef(null);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const eventDate = new Date('August 10, 2025 18:00:00');
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // WOW: Animación de entrada para los bloques del contador
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!blocksRef.current) return;
    gsap.fromTo(
      blocksRef.current,
      { opacity: 0, scale: 0.7, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '#countdown',
          start: 'top 80%',
        },
      }
    );
  }, []);

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
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  const isEventStarted =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  // Determinar clases CSS basadas en prioridad
  const getSectionClasses = () => {
    const baseClasses = "relative py-20 text-white overflow-hidden";
    
    if (priority === 'urgent') {
      return `${baseClasses} bg-gradient-to-br from-red-900 via-red-800 to-purple-900 min-h-screen flex items-center`;
    } else if (priority === 'high') {
      return `${baseClasses} bg-gradient-to-br from-purple-900 to-blue-900 min-h-[80vh] flex items-center`;
    } else {
      return `${baseClasses} bg-gradient-to-br from-purple-900 to-blue-900`;
    }
  };

  const getTitleClasses = () => {
    if (priority === 'urgent') {
      return "text-4xl md:text-8xl font-black mb-8 tracking-wider animate-pulse";
    } else if (priority === 'high') {
      return "text-4xl md:text-6xl font-bold mb-6 tracking-wider";
    } else {
      return "text-3xl md:text-5xl font-bold mb-4 tracking-wider";
    }
  };

  const getTimeBlockClasses = () => {
    if (priority === 'urgent') {
      return "bg-white bg-opacity-20 rounded-xl p-8 text-center backdrop-blur-sm border-2 border-red-400 shadow-2xl";
    } else if (priority === 'high') {
      return "bg-white bg-opacity-15 rounded-lg p-6 text-center backdrop-blur-sm border border-white border-opacity-30 shadow-xl";
    } else {
      return "bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-sm border border-white border-opacity-20";
    }
  };

  const getTimeTextClasses = () => {
    if (priority === 'urgent') {
      return "text-5xl md:text-8xl font-black mb-3";
    } else if (priority === 'high') {
      return "text-4xl md:text-7xl font-bold mb-2";
    } else {
      return "text-4xl md:text-6xl font-bold mb-2";
    }
  };

  return (
    <section ref={sectionRef} id="countdown" className={getSectionClasses()}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x1080/?abstract')] bg-cover bg-center filter blur-sm"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className={getTitleClasses()}>{texts[language].title}</h2>
          {priority === 'urgent' && isLive ? (
            <div className="mb-8">
              <span className="inline-flex items-center bg-red-600 px-8 py-4 rounded-full text-xl md:text-2xl font-bold animate-bounce">
                <span className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></span>
                {texts[language].liveNow}
              </span>
            </div>
          ) : (
            <p className={`${priority === 'urgent' ? 'text-2xl' : priority === 'high' ? 'text-xl' : 'text-xl'}`}>
              {texts[language].subtitle}
            </p>
          )}
        </div>

        {isEventStarted && priority === 'urgent' ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-3xl md:text-5xl font-bold text-green-300 mb-4 animate-pulse">
              {texts[language].eventStarted}
            </p>
            <div className="text-xl md:text-2xl text-center">
              <p>¡Ve a la sección de transmisión en vivo!</p>
            </div>
          </div>
        ) : (
        <div className="flex justify-center">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 ${priority === 'urgent' ? 'max-w-6xl' : 'max-w-4xl'} mx-auto`}>
              <div ref={el => blocksRef.current[0] = el} className={getTimeBlockClasses()}>
              <div className={getTimeTextClasses()}>{timeLeft.days}</div>
              <div className="text-sm uppercase tracking-wider">{texts[language].days}</div>
            </div>
              <div ref={el => blocksRef.current[1] = el} className={getTimeBlockClasses()}>
              <div className={getTimeTextClasses()}>{timeLeft.hours}</div>
              <div className="text-sm uppercase tracking-wider">{texts[language].hours}</div>
            </div>
              <div ref={el => blocksRef.current[2] = el} className={getTimeBlockClasses()}>
              <div className={getTimeTextClasses()}>{timeLeft.minutes}</div>
              <div className="text-sm uppercase tracking-wider">{texts[language].minutes}</div>
            </div>
              <div ref={el => blocksRef.current[3] = el} className={getTimeBlockClasses()}>
              <div className={getTimeTextClasses()}>{timeLeft.seconds}</div>
              <div className="text-sm uppercase tracking-wider">{texts[language].seconds}</div>
            </div>
          </div>
        </div>
        )}

        {/* Indicador de urgencia para el día del evento */}
        {isEventDay && priority === 'high' && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-yellow-600 bg-opacity-80 px-6 py-3 rounded-full text-lg font-bold animate-pulse">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              ¡Hoy es el día del evento!
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PentecostesCountdown;