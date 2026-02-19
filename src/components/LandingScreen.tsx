import { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';

interface LandingScreenProps {
  onStart: (name: string) => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Trigger entrance animations
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Lütfen adınızı girin');
      return;
    }

    // Create ripple effect
    if (buttonRef.current) {
      const button = buttonRef.current;
      const ripple = document.createElement('span');
      ripple.className = 'absolute inset-0 bg-white rounded-full animate-ping';
      ripple.style.animationDuration = '0.5s';
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    }

    setIsExiting(true);
    setTimeout(() => {
      onStart(name.trim());
    }, 400);
  };

  const titleChars = 'Şansını Dene!'.split('');

  return (
    <div 
      className={`min-h-screen flex items-center justify-center relative z-10 transition-all duration-400 ease-expo-out ${
        isExiting ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="w-full max-w-md px-6 py-12">
        {/* Logo */}
        <div 
          className={`flex justify-center mb-8 transition-all duration-800 ease-bounce ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-24'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-shopalm-navy to-shopalm-blue flex items-center justify-center shadow-neon animate-breathe p-4">
              <img 
                src="./shopalm-white.png" 
                alt="Shopalm" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-shopalm-accent opacity-20 blur-xl animate-pulse-glow" />
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`text-5xl md:text-6xl font-display font-bold text-center mb-4 transition-all duration-600 ease-expo-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <span className="text-gradient">
            {titleChars.map((char, i) => (
              <span
                key={i}
                className={`inline-block transition-all duration-600 ease-expo-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${600 + i * 30}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className={`text-lg text-white/70 text-center mb-10 transition-all duration-500 ease-smooth ${
            isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          Shopalm Çarkıfelek ile harika hediyeler kazan
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div 
            className={`relative transition-all duration-500 ease-expo-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            }`}
            style={{ transitionDelay: '1100ms' }}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Adınızı girin..."
              className={`w-full bg-white/10 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/50 transition-all duration-200 focus:bg-white/15 ${
                error 
                  ? 'border-red-500 shadow-[0_0_10px_rgba(244,67,54,0.4)]' 
                  : 'border-white/20 focus:border-shopalm-accent/60 focus:shadow-[0_0_20px_rgba(244,208,63,0.3)]'
              }`}
              maxLength={30}
            />
            {error && (
              <p className="absolute -bottom-6 left-0 text-red-400 text-sm animate-slide-in-up">
                {error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div 
            className={`transition-all duration-500 ease-expo-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
            style={{ transitionDelay: '1200ms' }}
          >
            <button
              ref={buttonRef}
              type="submit"
              className="relative w-full py-4 px-8 rounded-full font-display font-semibold text-lg text-white overflow-hidden group transition-all duration-200 hover:scale-105 hover:shadow-button-hover active:scale-95"
            >
              <span className="absolute inset-0 gradient-button" />
              <span className="absolute inset-0 bg-gradient-to-r from-shopalm-accent/0 via-shopalm-accent/30 to-shopalm-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center justify-center gap-2">
                BAŞLA
              </span>
              <span className="absolute inset-0 rounded-full shadow-button group-hover:shadow-neon-intense transition-shadow duration-200" />
            </button>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-shopalm-accent/40 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-16 w-2 h-2 rounded-full bg-shopalm-blue/50 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-4 h-4 rounded-full bg-white/20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-2 h-2 rounded-full bg-shopalm-accent/30 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
}
