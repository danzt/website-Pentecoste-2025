import React, { useState } from 'react';
import PentecostesHeader from './components/PentecostesHeader';
import PentecostesHero from './components/PentecostesHero';
import PentecostesLive from './components/PentecostesLive';
import MultivisionSection from './components/MultivisionSection';
import PentecostesCountdown from './components/PentecostesCountdown';
import PentecostesGallery from './components/PentecostesGallery';
import PentecostesFooter from './components/PentecostesFooter';

const App = () => {
  const [language, setLanguage] = useState('es');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="font-sans bg-black text-white">
      <div id="home">
        <PentecostesHeader onLanguageChange={handleLanguageChange} language={language} />
      </div>
      <div id="hero">
        <PentecostesHero language={language} />
      </div>
      <div id="live">
        <PentecostesLive language={language} />
      </div>
      <div id="multivision">
        <MultivisionSection language={language} />
      </div>
      <div id="countdown">
        <PentecostesCountdown language={language} />
      </div>
      <div id="gallery">
        <PentecostesGallery language={language} />
      </div>
      <PentecostesFooter language={language} />
    </div>
  );
};

export default App;