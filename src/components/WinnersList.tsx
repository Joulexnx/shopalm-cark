import { useRef, useEffect } from 'react';
import type { Winner, Product } from '@/types';
import { Trophy, Clock, Ban } from 'lucide-react';

interface WinnersListProps {
  winners: Winner[];
  products: Product[];
}

export function WinnersList({ winners, products }: WinnersListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const newItemRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new winner added
  useEffect(() => {
    if (newItemRef.current && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [winners.length]);

  const formatTime = (date: Date | string) => {
    // Handle both Date objects and ISO strings from localStorage
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(dateObj);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 px-4">
      <div className="glass-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-shopalm-accent to-shopalm-accent-orange flex items-center justify-center">
              <Trophy className="w-5 h-5 text-shopalm-navy" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white">
                Kazananlar
              </h3>
              <p className="text-white/50 text-sm">
                {winners.length} kazanan
              </p>
            </div>
          </div>
          
          {/* Live Indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-400 text-sm font-medium">Canlı</span>
          </div>
        </div>

        {/* Winners List */}
        <div 
          ref={listRef}
          className="max-h-[300px] overflow-y-auto space-y-2 pr-2"
        >
          {winners.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Henüz kazanan yok</p>
              <p className="text-sm mt-1">İlk çarkıfelek çeviren sen ol!</p>
            </div>
          ) : (
            winners.map((winner, index) => {
              const isNew = index === 0;
              const isOutOfStock = winner.product.stock <= 0;
              
              return (
                <div
                  key={winner.id}
                  ref={isNew ? newItemRef : null}
                  className={`
                    relative grid grid-cols-[40px_1fr_auto] md:grid-cols-[50px_1fr_50px_140px_80px] gap-3 items-center p-3 rounded-xl
                    transition-all duration-300 ease-expo-out
                    ${isNew ? 'animate-slide-in-left bg-shopalm-accent/10' : 'bg-white/5'}
                    ${isOutOfStock ? 'opacity-50' : 'hover:bg-white/10'}
                  `}
                >
                  {/* Rank */}
                  <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Name */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-shopalm-blue to-shopalm-navy flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {winner.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={`font-medium truncate ${isOutOfStock ? 'line-through text-white/50' : 'text-white'}`}>
                      {winner.name}
                    </span>
                  </div>

                  {/* Product Icon (mobile hidden) */}
                  <div className="hidden md:flex justify-center">
                    <span className="text-xl">{winner.product.icon}</span>
                  </div>

                  {/* Product Name */}
                  <div className="flex items-center gap-2">
                    <span className="md:hidden text-lg">{winner.product.icon}</span>
                    <span className={`text-sm truncate ${isOutOfStock ? 'line-through text-white/50' : 'text-white/80'}`}>
                      {winner.product.name}
                    </span>
                  </div>

                  {/* Time & Status */}
                  <div className="flex items-center justify-end gap-2">
                    {isOutOfStock ? (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                        <Ban className="w-3 h-3" />
                        <span className="hidden sm:inline">TÜKENDİ</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-white/50 text-sm">
                        <Clock className="w-3 h-3" />
                        {formatTime(winner.timestamp)}
                      </span>
                    )}
                  </div>

                  {/* Strikethrough animation for out of stock */}
                  {isOutOfStock && (
                    <div 
                      className="absolute bottom-3 left-0 h-px bg-red-400/50"
                      style={{
                        animation: 'strikethrough 0.4s ease-out forwards',
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Stock Indicators */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-white/50 text-sm mb-3">Kalan Stoklar:</p>
          <div className="flex flex-wrap gap-2">
            {products.map((product) => (
              <div 
                key={`stock-${product.id}`}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                  transition-all duration-300
                  ${product.stock > 0 ? 'bg-white/5' : 'bg-red-500/10 opacity-50'}
                `}
                title={`${product.name}: ${product.stock} adet kaldı`}
              >
                <span className="text-lg">{product.icon}</span>
                <div className="flex flex-col">
                  <span className={`text-xs ${product.stock > 0 ? 'text-white/70' : 'text-red-400 line-through'}`}>
                    {product.name.split(' ').slice(0, 2).join(' ')}
                  </span>
                  <span className={`text-xs font-medium ${product.stock > 0 ? 'text-shopalm-accent' : 'text-red-400'}`}>
                    {product.stock > 0 ? `${product.stock} adet` : 'TÜKENDİ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes strikethrough {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
