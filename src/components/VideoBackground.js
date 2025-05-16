import React from 'react';

const VideoBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <iframe 
        className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2"
        src="https://www.youtube.com/embed/ici2Mqop7eQ?autoplay=1&mute=1&loop=1&controls=0&playlist=ici2Mqop7eQ" 
        title="Background video"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoBackground;

// DONE