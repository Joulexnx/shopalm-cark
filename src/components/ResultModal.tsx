import { useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { Product } from '@/types';
import { X, Gift, Sparkles } from 'lucide-react';

interface ResultModalProps {
  product: Product | null;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ResultModal({ product, userName, isOpen, onClose }: ResultModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const confettiTriggered = useRef(false);

  const triggerConfetti = useCallback(() => {
    if (confettiTriggered.current) return;
    confettiTriggered.current = true;

    const duration = 4000;
    const end = Date.now() + duration;

    const colors = ['#f4d03f', '#5c6bc0', '#1a237e', '#ffffff', '#f39c12'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 8,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
        disableForReducedMotion: true,
        gravity: 0.8,
        scalar: 1.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true,
    });

    frame();
  }, []);

  useEffect(() => {
    if (isOpen && product) {
      confettiTriggered.current = false;
      // Delay confetti slightly for dramatic effect
      const timer = setTimeout(triggerConfetti, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product, triggerConfetti]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with ripple effect */}
      <div 
        className="absolute inset-0 bg-shopalm-navy/85 backdrop-blur-xl animate-in fade-in duration-400"
        style={{
          animation: 'ripple-expand 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      />

      {/* Modal Card */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md animate-in zoom-in-95 duration-500 ease-expo-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glass Card */}
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-shopalm-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-shopalm-blue/20 rounded-full blur-3xl" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Celebration Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl animate-scale-pop"
                  style={{ 
                    background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}dd 100%)`,
                    boxShadow: `0 0 40px ${product.color}80`,
                    animationDelay: '0.5s',
                  }}
                >
                  {product.icon}
                </div>
                {/* Halo effect */}
                <div 
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ 
                    background: product.color,
                    opacity: 0.3,
                    animationDuration: '2s',
                  }}
                />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-shopalm-accent animate-pulse" />
                <Sparkles className="absolute -bottom-1 -left-2 w-5 h-5 text-shopalm-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            {/* Congratulations Text */}
            <div className="space-y-3 mb-6">
              <p 
                className="text-shopalm-accent font-display font-semibold text-lg animate-slide-in-up"
                style={{ animationDelay: '0.7s' }}
              >
                🎉 Tebrikler {userName}! 🎉
              </p>
              <h2 
                className="text-2xl md:text-3xl font-display font-bold text-white animate-slide-in-up"
                style={{ animationDelay: '0.8s' }}
              >
                {product.name}
              </h2>
              <p 
                className="text-white/70 animate-slide-in-up"
                style={{ animationDelay: '0.9s' }}
              >
                Kazandın!
              </p>
            </div>

            {/* Product Details */}
            <div 
              className="bg-white/5 rounded-xl p-4 mb-6 animate-slide-in-up"
              style={{ animationDelay: '1s' }}
            >
              <div className="flex items-center gap-3 justify-center">
                <Gift className="w-5 h-5 text-shopalm-accent" />
                <span className="text-white/80 text-sm">
                  Ürün stoktan düşürüldü ve kazananlar listesine eklendi
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-shopalm-accent to-shopalm-accent-orange text-shopalm-navy font-display font-semibold hover:scale-105 hover:shadow-neon transition-all duration-200 animate-slide-in-up"
              style={{ animationDelay: '1.1s' }}
            >
              Harika!
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ripple-expand {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
