import React from 'react';

const Footer = ({ language }) => {
  const texts = {
    es: {
      aboutTitle: 'Acerca de Pentecostés',
      aboutText: 'Pentecostés es una celebración cristiana que conmemora la venida del Espíritu Santo sobre los apóstoles.',
      linksTitle: 'Enlaces rápidos',
      contactTitle: 'Contacto',
      copyright: '© 2023 Pentecostés Global. Todos los derechos reservados.'
    },
    en: {
      aboutTitle: 'About Pentecost',
      aboutText: 'Pentecost is a Christian celebration commemorating the coming of the Holy Spirit upon the apostles.',
      linksTitle: 'Quick links',
      contactTitle: 'Contact',
      copyright: '© 2023 Global Pentecost. All rights reserved.'
    }
  };

  return (
    <footer id="about" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{texts[language].aboutTitle}</h3>
            <p className="text-gray-400">{texts[language].aboutText}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{texts[language].linksTitle}</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition">{language === 'es' ? 'Inicio' : 'Home'}</a></li>
              <li><a href="#live" className="text-gray-400 hover:text-white transition">{language === 'es' ? 'En Vivo' : 'Live'}</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-white transition">{language === 'es' ? 'Galería' : 'Gallery'}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{texts[language].contactTitle}</h3>
            <p className="text-gray-400">info@pentecostesglobal.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{texts[language].copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;