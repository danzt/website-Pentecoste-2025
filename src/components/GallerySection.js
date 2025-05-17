import React, { useState, useEffect } from 'react';

const GallerySection = ({ language }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const texts = {
    es: {
      title: 'Galería',
      subtitle: 'Momentos de Pentecostés',
      viewMore: 'Ver más',
      close: 'Cerrar'
    },
    en: {
      title: 'Gallery',
      subtitle: 'Pentecost moments',
      viewMore: 'View more',
      close: 'Close'
    }
  };

  const images = [
    {
      src: '/galery/image-02.jpg',
      span: 'col-span-1 row-span-1'
    },
    {
      src: '/galery/image-03.jpg',
      span: 'col-span-1 row-span-2'
    },
    {
      src: '/galery/image-04.jpg',
      span: 'col-span-1 row-span-1'
    },
    {
      src: '/galery/image-05.jpg',
      span: 'col-span-1 row-span-1'
    },
    {
      src: '/galery/image-06.jpg',
      span: 'col-span-1 row-span-1'
    },
    {
      src: '/galery/image-07.jpg',
      span: 'col-span-1 row-span-1'
    },
    {
      src: '/galery/image-08.jpg',
      span: 'col-span-1 row-span-1'
    }
  ];

  // Función para manejar la carga de imágenes
  const handleImageLoad = (src) => {
    setImagesLoaded(prev => ({
      ...prev,
      [src]: true
    }));
  };

  // Función para manejar errores de carga de imágenes
  const handleImageError = (src) => {
    console.error(`Error al cargar la imagen: ${src}`);
  };

  useEffect(() => {
  }, []);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">{texts[language].title}</h2>
          <p className="text-xl text-gray-600">{texts[language].subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`${image.span} relative group cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl`}
              onClick={() => setSelectedImage(image.src)}
            >
              <img 
                src={image.src} 
                alt={`Gallery ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onLoad={() => handleImageLoad(image.src)}
                onError={() => handleImageError(image.src)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-purple-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <span className="sr-only">{texts[language].close}</span>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Selected gallery image" 
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <div className="text-center mt-12">
          <button className="bg-purple-900 text-white px-8 py-4 rounded-full font-bold hover:bg-purple-800 transition-colors duration-300 hover:shadow-lg transform hover:-translate-y-1">
            {texts[language].viewMore}
          </button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;