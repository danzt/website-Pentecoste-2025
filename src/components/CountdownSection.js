import React, { useState, useEffect } from 'react';

const CountdownSection = ({ language }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const texts = {
    es: {
      title: 'Cuenta Regresiva',
      subtitle: 'El evento comienza en:',
      days: 'Días',
      hours: 'Horas',
      minutes: 'Minutos',
      seconds: 'Segundos'
    },
    en: {
      title: 'Countdown',
      subtitle: 'Event starts in:',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds'
    }
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const eventDate = new Date('June 4, 2023 00:00:00'); // Fecha de Pentecostés 2023
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-blue-800 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{texts[language].title}</h2>
          <p className="text-xl">{texts[language].subtitle}</p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
              <div className="text-4xl md:text-6xl font-bold">{timeLeft.days}</div>
              <div>{texts[language].days}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
              <div className="text-4xl md:text-6xl font-bold">{timeLeft.hours}</div>
              <div>{texts[language].hours}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
              <div className="text-4xl md:text-6xl font-bold">{timeLeft.minutes}</div>
              <div>{texts[language].minutes}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
              <div className="text-4xl md:text-6xl font-bold">{timeLeft.seconds}</div>
              <div>{texts[language].seconds}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;