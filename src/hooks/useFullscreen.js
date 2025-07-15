import { useState, useEffect, useCallback, useRef } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const elementRef = useRef(null);

  // Verificar soporte de fullscreen
  useEffect(() => {
    const checkSupport = () => {
      return !!(
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled
      );
    };
    
    setIsSupported(checkSupport());
  }, []);

  // Funciones cross-browser para fullscreen
  const requestFullscreen = useCallback(async (element) => {
    if (!element || !isSupported) return false;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      return true;
    } catch (error) {
      console.error('Error al entrar en fullscreen:', error);
      return false;
    }
  }, [isSupported]);

  const exitFullscreen = useCallback(async () => {
    if (!isSupported) return false;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      return true;
    } catch (error) {
      console.error('Error al salir de fullscreen:', error);
      return false;
    }
  }, [isSupported]);

  // Obtener elemento en fullscreen actual
  const getFullscreenElement = useCallback(() => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async (element) => {
    const targetElement = element || elementRef.current;
    
    if (!targetElement) {
      console.warn('No hay elemento para fullscreen');
      return false;
    }

    const fullscreenElement = getFullscreenElement();
    
    if (fullscreenElement) {
      return await exitFullscreen();
    } else {
      return await requestFullscreen(targetElement);
    }
  }, [requestFullscreen, exitFullscreen, getFullscreenElement]);

  // Escuchar cambios de fullscreen
  useEffect(() => {
    if (!isSupported) return;

    const handleFullscreenChange = () => {
      const fullscreenElement = getFullscreenElement();
      setIsFullscreen(!!fullscreenElement);
    };

    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleFullscreenChange);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, [isSupported, getFullscreenElement]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, exitFullscreen]);

  // Funciones de conveniencia
  const enterFullscreen = useCallback((element) => {
    const targetElement = element || elementRef.current;
    return requestFullscreen(targetElement);
  }, [requestFullscreen]);

  return {
    isFullscreen,
    isSupported,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    elementRef,
    setElementRef: (element) => {
      elementRef.current = element;
    }
  };
}; 