import React from 'react';

const GallerySection = ({ language }) => {
  const texts = {
    es: {
      title: 'Galería',
      subtitle: 'Momentos de Pentecostés',
      viewMore: 'Ver más'
    },
    en: {
      title: 'Gallery',
      subtitle: 'Pentecost moments',
      viewMore: 'View more'
    }
  };

  // Imágenes de ejemplo (deberías reemplazarlas con tus propias imágenes)
  const images = [
    'https://source.unsplash.com/random/600x400/?church',
    'https://source.unsplash.com/random/600x400/?worship',
    'https://source.unsplash.com/random/600x400/?bible',
    'https://source.unsplash.com/random/600x400/?prayer',
    'https://source.unsplash.com/random/600x400/?christian',
    'https://source.unsplash.com/random/600x400/?faith'
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">{texts[language].title}</h2>
          <p className="text-xl text-gray-600">{texts[language].subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-64 object-cover" />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-purple-900 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-800 transition">
            {texts[language].viewMore}
          </button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;