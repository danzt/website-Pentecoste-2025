import React from 'react';

const LiveSection = ({ language }) => {
  const texts = {
    es: {
      title: 'Transmisión en Vivo',
      subtitle: 'Únete a esta experiencia espiritual',
      placeholder: 'Próximamente: Transmisión en vivo del evento',
      promoText: 'Mientras esperas, disfruta de nuestro video promocional'
    },
    en: {
      title: 'Live Stream',
      subtitle: 'Join this spiritual experience',
      placeholder: 'Coming soon: Live event stream',
      promoText: 'While you wait, enjoy our promotional video'
    }
  };

  return (
    <section id="live" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">{texts[language].title}</h2>
          <p className="text-xl text-gray-600">{texts[language].subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 bg-black flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-white text-xl mb-4">{texts[language].placeholder}</p>
              <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                <p className="text-white">{texts[language].promoText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveSection;