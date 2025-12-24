
import React, { useState, useEffect } from 'react';

interface ChristmasGameProps {
  onWin: () => void;
}

interface Riddle {
  question: string;
  answer: string;
  narrative: string;
}

const RIDDLES: Riddle[] = [
  {
    question: "Blanco como la sal, frío como el hielo, caigo del cielo sin alas y cubro todo en silencio.",
    answer: "nieve",
    narrative: "El primer obstáculo es una densa niebla blanca que nos impide avanzar. Adivina qué es para despejar el camino."
  },
  {
    question: "No como ni bebo, pero crezco sin parar; me adornan con luces y me dejan brillar.",
    answer: "arbol",
    narrative: "¡Mira! Hemos llegado a un claro en el bosque, pero falta algo central para que la magia fluya."
  },
  {
    question: "Tengo barba y gorro, visto siempre de rojo, entro por la chimenea aunque no tenga antojo.",
    answer: "papa noel",
    narrative: "Unas huellas gigantes de botas rojas aparecen en la nieve. ¿Quién habrá pasado por aquí?"
  },
  {
    question: "No soy estrella del cielo, pero brillo sin igual; me ponen en lo más alto del árbol de Navidad.",
    answer: "estrella",
    narrative: "El camino está casi despejado, pero necesitamos una luz guía en la cima de nuestra esperanza."
  },
  {
    question: "Voy de casa en casa, saltando de portal en portal, llevo regalos y alegría en la noche más especial.",
    answer: "papa noel",
    narrative: "¡Ya casi estamos! El último sello mágico protege la identidad de tu amigo invisible."
  }
];

const ChristmasGame: React.FC<ChristmasGameProps> = ({ onWin }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentRiddle = RIDDLES[currentStage];

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const normalizedUser = normalizeText(userAnswer);
    const normalizedAnswer = normalizeText(currentRiddle.answer);

    // Simple inclusion check to be user-friendly (e.g. "el arbol de navidad" contains "arbol")
    if (normalizedUser.includes(normalizedAnswer)) {
      setIsSuccess(true);
      setError(false);
      
      setTimeout(() => {
        setIsSuccess(false);
        setUserAnswer('');
        if (currentStage < RIDDLES.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          onWin();
        }
      }, 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-white/60 font-bold uppercase tracking-widest">
          <span>Progreso de la Misión</span>
          <span>{currentStage + 1} / {RIDDLES.length}</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-700 ease-out"
            style={{ width: `${((currentStage + 1) / RIDDLES.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="min-h-[350px] flex flex-col items-center justify-center space-y-8">
        {/* Narrative Box */}
        <div className="p-4 bg-yellow-400/10 border-l-4 border-yellow-400 text-left w-full rounded-r-lg">
          <p className="text-white italic text-lg leading-snug">
            "{currentRiddle.narrative}"
          </p>
        </div>

        {/* Riddle Display */}
        <div className={`w-full p-8 bg-white/5 rounded-2xl border transition-all duration-300 ${isSuccess ? 'border-green-500 bg-green-500/10' : 'border-white/10'}`}>
          <h3 className="text-yellow-400 font-christmas text-2xl mb-4 text-center">Acertijo #{currentStage + 1}</h3>
          <p className="text-xl text-white text-center leading-relaxed font-medium italic">
            {currentRiddle.question}
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="relative">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              disabled={isSuccess}
              className={`w-full px-6 py-4 rounded-full bg-black/40 border-2 text-white text-center text-xl transition-all outline-none
                ${error ? 'border-red-500 animate-shake' : isSuccess ? 'border-green-500' : 'border-white/20 focus:border-yellow-400'}
              `}
              autoFocus
            />
            {isSuccess && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-green-400 text-3xl animate-bounce">✨ ¡Correcto! ✨</span>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSuccess || !userAnswer.trim()}
            className={`w-full py-4 rounded-full font-bold text-xl transition-all shadow-xl active:scale-95
              ${isSuccess ? 'bg-green-600 cursor-default' : 'bg-red-600 hover:bg-red-500 text-white'}
              ${!userAnswer.trim() ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            `}
          >
            {isSuccess ? 'Desbloqueando...' : 'Resolver Acertijo'}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}} />
    </div>
  );
};

export default ChristmasGame;
