
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, SecretSantaData } from './types';
import Snowfall from './components/Snowfall';
import ChristmasGame from './components/ChristmasGame';
import { getFestiveMessage } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [santaData, setSantaData] = useState<SecretSantaData>({ recipientName: '' });
  const [finalMessage, setFinalMessage] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState(false);

  const startGameSetup = (name: string) => {
    if (name.trim()) {
      setSantaData({ recipientName: name });
      setGameState('intro');
    }
  };

  const handleWin = useCallback(async () => {
    setGameState('revealing');
    setLoadingMessage(true);
    const msg = await getFestiveMessage(santaData.recipientName);
    setFinalMessage(msg);
    setLoadingMessage(false);
    setGameState('finished');
  }, [santaData.recipientName]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-red-900 via-red-800 to-green-900 px-4">
      <Snowfall />
      
      <div className="z-10 w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
        
        {gameState === 'setup' && (
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-christmas text-white drop-shadow-lg">
              Amigo Invisible Mágico
            </h1>
            <p className="text-white/80 text-lg">
              Configura tu aventura navideña...
            </p>
            <div className="space-y-4 max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Nombre del Amigo Invisible..."
                className="w-full px-6 py-4 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-xl font-semibold"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') startGameSetup((e.target as HTMLInputElement).value);
                }}
                id="name-input"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('name-input') as HTMLInputElement;
                  startGameSetup(input.value);
                }}
                className="w-full py-4 rounded-full bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold text-xl transition-transform hover:scale-105 active:scale-95 shadow-lg"
              >
                ¡Comenzar Historia!
              </button>
            </div>
            <p className="text-xs text-white/50 italic">
              *Ingresa el nombre de la persona a quien le darás el regalo*
            </p>
          </div>
        )}

        {gameState === 'intro' && (
          <div className="text-center space-y-8 animate-in fade-in duration-1000">
             <div className="text-7xl mb-4">❄️📜❄️</div>
             <h2 className="text-4xl font-christmas text-yellow-300">¡Emergencia en el Polo Norte!</h2>
             <div className="space-y-4 text-white text-xl leading-relaxed italic font-light">
               <p>
                 ¡Oh no! Una tormenta de nieve mágica ha borrado los nombres de la lista de Santa.
               </p>
               <p>
                 Tu <strong>Amigo Invisible</strong> se ha perdido entre los glaciares y solo tú puedes rescatar su identidad siguiendo el rastro de la magia navideña.
               </p>
               <p className="text-yellow-200 font-semibold">
                 ¿Aceptarás la misión para salvar la Navidad?
               </p>
             </div>
             <button
                onClick={() => setGameState('playing')}
                className="px-12 py-4 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold text-xl transition-all hover:scale-105 shadow-xl"
              >
                ¡Aceptar Misión!
              </button>
          </div>
        )}

        {gameState === 'playing' && (
          <ChristmasGame onWin={handleWin} />
        )}

        {(gameState === 'revealing' || gameState === 'finished') && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <h2 className="text-5xl font-christmas text-yellow-400">¡MISIÓN COMPLETADA!</h2>
            
            {loadingMessage ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400"></div>
                <p className="text-white animate-pulse">Consultando con los duendes de Santa...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-8 bg-green-800/50 rounded-2xl border-2 border-yellow-500 shadow-inner">
                   <h3 className="text-3xl font-bold text-white mb-4">Tu amigo invisible es...</h3>
                   <div className="text-5xl font-christmas text-yellow-300 animate-bounce">
                     {santaData.recipientName}
                   </div>
                </div>
                
                <p className="text-xl text-white italic max-w-md mx-auto leading-relaxed">
                  "{finalMessage}"
                </p>

                <button
                  onClick={() => setGameState('setup')}
                  className="px-8 py-3 rounded-full bg-white text-red-800 font-bold hover:bg-red-100 transition-colors"
                >
                  Jugar de nuevo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="absolute bottom-4 text-white/40 text-sm z-10">
        Hecho con ✨ y magia navideña
      </footer>
    </div>
  );
};

export default App;
