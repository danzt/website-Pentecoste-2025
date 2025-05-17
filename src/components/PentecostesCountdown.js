import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const PentecostesCountdown = ({ language }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const texts = {
    es: {
      title: 'CUENTA REGRESIVA',
      subtitle: 'El evento comienza en',
      days: 'DÍAS',
      hours: 'HORAS',
      minutes: 'MINUTOS',
      seconds: 'SEGUNDOS'
    },
    en: {
      title: 'COUNTDOWN',
      subtitle: 'Event starts in',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINUTES',
      seconds: 'SECONDS'
    }
  };

  const blocksRef = useRef([]);
  const sectionRef = useRef(null);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const eventDate = new Date('July 26, 2025 00:00:00');
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

  return (
    <section ref={sectionRef} id="countdown" className="relative py-20 bg-gradient-to-br from-purple-900 to-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x1080/?abstract')] bg-cover bg-center filter blur-sm"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-wider">{texts[language].title}</h2>
          <p className="text-xl">{texts[language].subtitle}</p>
        </div>

        {isEventStarted ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-green-300 mb-4">¡El evento ha comenzado!</p>
          </div>
        ) : (
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
              <div ref={el => blocksRef.current[0] = el} className="bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-sm border border-white border-opacity-20">
              <div className="text-4xl md:text-6xl font-bold mb-2">{timeLeft.days}</div>
              <div className="text-sm uppercase tracking-wider">{texts[language].days}</div>
            </div>
              <div ref={el => blocksRef.current[1] = el} className="bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-sm border border-white border-opacity-20">
              <div className="text-4xl md:text-6xl font-bold mb-2">{timeLeft.hours}</div>
              <div className="text-sm uppercase tracking-wider">{texts[language].hours}</div>
            </div>
              <div ref={el => blocksRef.current[2] = el} className="bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-sm border border-white border-opacity-20">
              <div className="text-4xl md:text-6xl font-bold mb-2">{timeLeft.minutes}</div>
              <div className="text-sm uppercase tracking-wider">{texts[language].minutes}</div>
            </div>
              <div ref={el => blocksRef.current[3] = el} className="bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-sm border border-white border-opacity-20">
              <div className="text-4xl md:text-6xl font-bold mb-2">{timeLeft.seconds}</div>
              <div className="text-sm uppercase tracking-wider">{texts[language].seconds}</div>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default PentecostesCountdown;