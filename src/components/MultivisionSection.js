import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const MultivisionSection = ({ language }) => {
  const sectionRef = useRef(null);

  const texts = {
    es: {
      title: 'MULTIVISIÓN',
      subtitle: 'Vive Pentecostés en 360°',
      viewMore: 'VER MÁS VIDEOS'
    },
    en: {
      title: 'MULTIVISION', 
      subtitle: 'Experience Pentecost in 360°',
      viewMore: 'VIEW MORE VIDEOS'
    }
  };

  const videos = [
    {
      id: 'x60ZLH-9tbY',
      title: 'Adoración'
    },
    {
      id: 'Jx2sqrw7hB4',
      title: 'Biblia'
    },
    {
      id: '4JX-yNm_z7w',
      title: 'Oración'
    },
    {
      id: '3YtNlPssmgY',
      title: 'Iglesia'
    },
    {
      id: 'Pm3fS4lg0jI',
      title: 'Alabanza'
    },
    {
      id: '7XeX5_Sg3Ag',
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
            <div key={index} className="relative group">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-900">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&controls=0`}
                  title={`Video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-2 text-center">
                <p className="text-white">{video.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition">
            {texts[language].viewMore}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MultivisionSection;