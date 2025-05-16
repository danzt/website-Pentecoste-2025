import React, { useState } from 'react';

const LayoutHeader = ({ onLanguageChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-purple-800">Pentecostés Global</h1>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#home" className="text-gray-800 hover:text-purple-600 transition">Inicio</a>
          <a href="#live" className="text-gray-800 hover:text-purple-600 transition">En Vivo</a>
          <a href="#gallery" className="text-gray-800 hover:text-purple-600 transition">Galería</a>
          <a href="#about" className="text-gray-800 hover:text-purple-600 transition">Acerca de</a>
        </div>

        <div className="flex items-center space-x-4">
          <select 
            onChange={onLanguageChange}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>

          <button 
            className="md:hidden text-gray-800"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-lg">
          <a href="#home" className="block py-2 text-gray-800 hover:text-purple-600">Inicio</a>
          <a href="#live" className="block py-2 text-gray-800 hover:text-purple-600">En Vivo</a>
          <a href="#gallery" className="block py-2 text-gray-800 hover:text-purple-600">Galería</a>
          <a href="#about" className="block py-2 text-gray-800 hover:text-purple-600">Acerca de</a>
        </div>
      )}
    </header>
  );
};

export default LayoutHeader;