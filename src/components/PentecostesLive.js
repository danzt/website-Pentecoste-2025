import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const PentecostesLive = ({ language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef(null);
  
  const texts = {
    es: {
      title: 'TRANSMISIÓN EN VIVO',
      subtitle: 'Sintoniza nuestra señal en directo',
      placeholder: '¡Mira el video promocional mientras llega el evento!',
      description: 'El evento Pentecostés será transmitido en vivo el 28 de Julio. Mientras tanto, disfruta este video.',
      playText: 'VER VIDEO EN GRANDE',
      liveText: 'EN VIVO AHORA'
    },
    en: {
      title: 'LIVE STREAM',
      subtitle: 'Tune in to our live broadcast',
      placeholder: 'Watch the promo video while the event starts!',
      description: 'The Pentecost event will be streamed live on July 28th. Meanwhile, enjoy this video.',
      playText: 'WATCH VIDEO',
      liveText: 'LIVE NOW'
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

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

  return (
    <section ref={sectionRef} id="live" className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="text-center mt-12 mb-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-wider">{texts[language].title}</h2>
          <p className="text-xl text-gray-300">{texts[language].subtitle}</p>
        </div>
        <div className="flex justify-center items-center w-full" style={{flex: 1}}>
          <div className="relative flex flex-col items-center justify-center w-full" style={{height: '60vh'}}>
            <div className="flex justify-center items-center w-full h-full">
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl w-[90vw] max-w-4xl h-full aspect-video flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/ZIutr-hwwpM?autoplay=0"
                  title="Promo video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
                <button 
                  onClick={togglePlay}
              className="mt-6 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition flex items-center z-10"
              style={{ pointerEvents: 'auto' }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  {texts[language].playText}
                </button>
            {isPlaying && (
              <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                <div className="relative w-full max-w-4xl aspect-w-16 aspect-h-9">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/ZIutr-hwwpM?autoplay=1"
                    title="Promo video big"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <button onClick={togglePlay} className="absolute top-2 right-2 bg-white text-black rounded-full px-4 py-2 font-bold">X</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PentecostesLive;