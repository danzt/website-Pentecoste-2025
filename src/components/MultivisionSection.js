import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MultivisionSection = ({ language }) => {
  const sectionRef = useRef(null);

  const texts = {
    es: {
      title: 'Recuerdos de Pentecostés',
      subtitle: 'Pentecostes, mas que una fecha, es un acontecimiento',
      viewMore: 'VER MÁS VIDEOS'
    },
    en: {
      title: 'Pentecost memories', 
      subtitle: 'Pentecost is more than a date, it is an event',
      viewMore: 'VIEW MORE VIDEOS'
    }
  };

  const videos = [
    {
      id: '1084753419',
      title: 'Adoración'
    },
    {
      id: '1084753341',
      title: 'Biblia'
    },
    {
      id: '1084753302',
      title: 'Oración'
    },
    {
      id: '1084753260',
      title: 'Iglesia'
    },
    {
      id: '1084753188',
      title: 'Alabanza'
    },
    {
      id: '1084753229',
      title: 'Espíritu Santo'
    }
  ];

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
    <section ref={sectionRef} id="multivision" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-wider">{texts[language].title}</h2>
          <p className="text-xl text-gray-300">{texts[language].subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div key={index} className="relative group w-full">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={`https://player.vimeo.com/video/${video.id}?autoplay=1&loop=1&background=1&muted=1`}
                  title={`Video ${index + 1}`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                {/* <p className="text-white text-lg font-medium">{video.title}</p> */}
              </div>
            </div>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition">
            {texts[language].viewMore}
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default MultivisionSection;