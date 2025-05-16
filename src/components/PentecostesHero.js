import React, { useEffect, useState } from 'react';

const PentecostesHero = ({ language }) => {
  const [loaded, setLoaded] = useState(false);
  const texts = {
    es: {
      title: 'PENTECOSTÉS 2023',
      subtitle: 'Una experiencia espiritual transformadora',
      cta: 'VER TRANSMISIÓN'
    },
    en: {
      title: 'PENTECOST 2023',
      subtitle: 'A transformative spiritual experience',
      cta: 'WATCH LIVE'
    }
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-60"></div>
        <div className="w-full h-full bg-[url('https://source.unsplash.com/random/1920x1080/?worship')] bg-cover bg-center filter brightness-75"></div>
      </div>

      <div className={`container mx-auto px-4 z-10 text-center transform transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-wider">
          {texts[language].title}
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
          {texts[language].subtitle}
        </p>
        <a 
          href="#live" 
          className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300"
        >
          {texts[language].cta}
        </a>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default PentecostesHero;