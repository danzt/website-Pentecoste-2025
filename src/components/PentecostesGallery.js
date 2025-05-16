import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const images = [
  'https://source.unsplash.com/random/800x600?sig=1',
  'https://source.unsplash.com/random/800x600?sig=2',
  'https://source.unsplash.com/random/800x600?sig=3',
  'https://source.unsplash.com/random/800x600?sig=4',
  'https://source.unsplash.com/random/800x600?sig=5',
  'https://source.unsplash.com/random/800x600?sig=6',
  'https://source.unsplash.com/random/800x600?sig=7',
  'https://source.unsplash.com/random/800x600?sig=8',
  'https://source.unsplash.com/random/800x600?sig=9',
  'https://source.unsplash.com/random/800x600?sig=10',
];

  const texts = {
    es: {
      title: 'GALERÍA',
      subtitle: 'Momentos de Pentecostés',
    up: 'Salir de galería',
    },
    en: {
      title: 'GALLERY',
      subtitle: 'Pentecost moments',
    up: 'Exit gallery',
    }
  };

const PentecostesGallery = ({ language }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [showUpBtn, setShowUpBtn] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const totalWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollLength = totalWidth - viewportWidth;

    // ScrollTrigger para scroll horizontal
    const st = gsap.to(track, {
      x: () => `-${scrollLength}`,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollLength}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => setShowUpBtn(true),
        onLeave: () => setShowUpBtn(false),
        onEnterBack: () => setShowUpBtn(true),
        onLeaveBack: () => setShowUpBtn(false),
      },
    });

    // Parallax y escala en imágenes
    if (st) {
      gsap.utils.toArray(track.querySelectorAll('.gallery-img')).forEach((img, i) => {
        gsap.to(img, {
          scale: 1.08,
          y: i % 2 === 0 ? -30 : 30,
          filter: 'brightness(1.1) saturate(1.2)',
          scrollTrigger: {
            trigger: img,
            containerAnimation: st,
            scrub: true,
            start: 'left center',
            end: 'right center',
          },
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleUpClick = () => {
    const countdown = document.getElementById('countdown');
    if (countdown) {
      countdown.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} id="gallery" className="relative w-full min-h-screen bg-black text-white flex flex-col justify-center items-center overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-wider">{texts[language].title}</h2>
          <p className="text-xl text-gray-300">{texts[language].subtitle}</p>
        </div>
      {prefersReducedMotion ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 md:px-8 w-full md:max-w-6xl md:mx-auto">
          {images.map((img, idx) => (
            <div key={img} className="rounded-2xl overflow-hidden shadow-lg bg-[#222]" style={{ minHeight: 320 }}>
            <img 
                src={img}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover"
                style={{ borderRadius: '1rem' }}
            />
          </div>
          ))}
        </div>
      ) : (
        <div className="w-full overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-8"
            style={{ 
              willChange: 'transform',
              paddingLeft: '16px',
              paddingRight: '16px'
            }}
          >
            {images.map((img, idx) => (
              <div 
                key={img} 
                className="flex-shrink-0 rounded-2xl overflow-hidden shadow-lg" 
                style={{ 
                  width: 'calc(100vw - 32px)', 
                  maxWidth: 500, 
                  height: '60vh', 
                  minHeight: 320, 
                  background: '#222'
                }}
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover gallery-img"
                  style={{ borderRadius: '1rem', transition: 'box-shadow 0.3s' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {showUpBtn && (
        <button
          onClick={handleUpClick}
          className="fixed bottom-8 right-8 bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-bounce hover:bg-purple-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          {texts[language].up}
          </button>
      )}
    </section>
  );
};

export default PentecostesGallery;