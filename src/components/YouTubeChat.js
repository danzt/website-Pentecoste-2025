import React, { useState, useEffect } from 'react';

const YouTubeChat = ({ youtubeId, language = 'es', isVisible = true, className = '' }) => {
  const [chatLoaded, setChatLoaded] = useState(false);
  const [chatError, setChatError] = useState(false);

  const texts = {
    es: {
      loading: 'Cargando chat...',
      error: 'No se pudo cargar el chat',
      noChat: 'Chat no disponible',
      retry: 'Reintentar',
      placeholder: 'El chat estará disponible cuando comience la transmisión en vivo'
    },
    en: {
      loading: 'Loading chat...',
      error: 'Could not load chat',
      noChat: 'Chat not available',
      retry: 'Retry',
      placeholder: 'Chat will be available when the live stream starts'
    }
  };

  // Construir URL del chat de YouTube
  const getChatUrl = () => {
    if (!youtubeId || youtubeId === 'TU_STREAM_ID_AQUI') {
      return null;
    }

    const domain = window.location.hostname;
    return `https://www.youtube.com/live_chat?v=${youtubeId}&embed_domain=${domain}`;
  };

  const chatUrl = getChatUrl();

  // Manejar carga del iframe
  const handleChatLoad = () => {
    setChatLoaded(true);
    setChatError(false);
  };

  const handleChatError = () => {
    setChatError(true);
    setChatLoaded(false);
  };

  // Reintentar carga del chat
  const retryChat = () => {
    setChatError(false);
    setChatLoaded(false);
    // Forzar recarga del iframe
    const iframe = document.querySelector('.youtube-chat-iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`youtube-chat-container h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Header del Chat */}
      <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-white font-bold text-sm">
            💬 Chat en Vivo
          </span>
        </div>
        
        {chatError && (
          <button
            onClick={retryChat}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200"
          >
            🔄 {texts[language].retry}
          </button>
        )}
      </div>

      {/* Contenedor del Chat */}
      <div className="flex-1 relative bg-gray-800">
        {/* Estado: Sin ID de YouTube - Mostrar demo del chat */}
        {!chatUrl ? (
          <div className="h-full flex flex-col">
            {/* Simulación de mensajes de chat para demo */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  J
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-blue-400 text-xs font-bold">Juan Carlos</span>
                    <span className="text-gray-500 text-xs">12:34</span>
                  </div>
                  <p className="text-gray-200 text-sm">¡Esperando con ansias el evento! 🙌</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  M
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-green-400 text-xs font-bold">María</span>
                    <span className="text-gray-500 text-xs">12:35</span>
                  </div>
                  <p className="text-gray-200 text-sm">Pentecostés 2025 va a ser increíble ✨</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  A
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-purple-400 text-xs font-bold">Ana</span>
                    <span className="text-gray-500 text-xs">12:36</span>
                  </div>
                  <p className="text-gray-200 text-sm">¡Saludos desde Colombia! 🇨🇴</p>
                </div>
              </div>
              
              <div className="text-center py-4">
                <p className="text-gray-400 text-xs">
                  Vista previa • El chat real estará disponible durante la transmisión
                </p>
              </div>
            </div>
            
            {/* Input simulado */}
            <div className="border-t border-gray-600 p-3">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-gray-700 text-gray-300 placeholder-gray-500 px-3 py-2 rounded-full text-sm border border-gray-600 focus:border-red-500 focus:outline-none"
                  disabled
                />
                <button className="bg-red-600 px-4 py-2 rounded-full text-white text-sm font-bold opacity-50 cursor-not-allowed">
                  📤
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Loading State */}
            {!chatLoaded && !chatError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-300 text-sm">{texts[language].loading}</p>
              </div>
            )}

            {/* Error State */}
            {chatError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-4xl mb-4">❌</div>
                <p className="text-gray-300 text-sm mb-4">
                  {texts[language].error}
                </p>
                <button
                  onClick={retryChat}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-white font-bold transition-all duration-200"
                >
                  {texts[language].retry}
                </button>
              </div>
            )}

            {/* YouTube Chat Iframe */}
            <iframe
              className="youtube-chat-iframe w-full h-full border-0"
              src={chatUrl}
              title="YouTube Live Chat"
              allow="autoplay; encrypted-media"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              onLoad={handleChatLoad}
              onError={handleChatError}
              style={{
                display: chatError ? 'none' : 'block'
              }}
            />
          </>
        )}
      </div>

      {/* Footer del Chat - Info adicional */}
      <div className="bg-gray-700 px-4 py-2 border-t border-gray-600">
        <p className="text-gray-400 text-xs text-center">
          {chatLoaded ? (
            <>🟢 Conectado • YouTube Live Chat</>
          ) : (
            <>🔄 Conectando...</>
          )}
        </p>
      </div>
    </div>
  );
};

export default YouTubeChat; 