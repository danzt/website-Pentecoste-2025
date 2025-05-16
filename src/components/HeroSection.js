import React from 'react';

const HeroSection = ({ language }) => {
  const texts = {
    es: {
      title: 'Pentecostés 2023',
      subtitle: 'Una experiencia transformadora',
      cta: 'Ver transmisión en vivo'
    },
    en: {
      title: 'Pentecost 2023',
      subtitle: 'A transformative experience',
      cta: 'Watch live stream'
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">{texts[language].title}</h1>
        <p className="text-xl md:text-2xl mb-8">{texts[language].subtitle}</p>
        <a 
          href="#live" 
          className="inline-block bg-white text-purple-900 px-8 py-3 rounded-full font-bold hover:bg-purple-100 transition duration-300"
        >
          {texts[language].cta}
        </a>
      </div>
    </section>
  );
};

export default HeroSection;