import { useRef, useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';

interface WheelProps {
  products: Product[];
  onSpinEnd: (product: Product) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

export function Wheel({ products, onSpinEnd, isSpinning, setIsSpinning }: WheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [displayRotation, setDisplayRotation] = useState(0);
  const animationRef = useRef<number | null>(null);

  const itemCount = products.length;
  const anglePerItem = 360 / itemCount;

  // OK'un üzerindeki ürünü hesapla
  // OK sabit, çark saat yönünde dönüyor
  // Çark X° dönerse, OK (360-X)°'deki ürünü gösterir
  const getProductAtPointer = (currentRotation: number): Product => {
    // Normalize rotation
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    
    // Çark saat yönünde dönerken, OK saat yönünün tersindeki açıyı gösterir
    const angleAtPointer = (360 - normalizedRotation) % 360;
    
    // Hangi segment ortasında? 
    // angleAtPointer 22.5° ise -> iPhone (index 0)
    // angleAtPointer 67.5° ise -> AirPods (index 1)
    // Yani: (angleAtPointer - 22.5) / 45 = index
    const adjustedAngle = (angleAtPointer - anglePerItem / 2 + 360) % 360;
    let winnerIndex = Math.floor(adjustedAngle / anglePerItem);
    
    // Bounds check
    if (winnerIndex >= itemCount) winnerIndex = 0;
    if (winnerIndex < 0) winnerIndex = itemCount - 1;
    
    return products[winnerIndex];
  };

  const spin = useCallback(() => {
    if (isSpinning || !wheelRef.current) return;

    setIsSpinning(true);
    
    // Stokta olan ürünleri filtrele
    const availableProducts = products.filter(p => p.stock > 0);
    
    if (availableProducts.length === 0) {
      setIsSpinning(false);
      return;
    }
    
    // Rastgele bir ürün seç
    const winningProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    const winningIndex = products.findIndex(p => p.id === winningProduct.id);
    
    // Hedef ürünün ORTA açısı (segment ortası)
    // OK ürünün tam ortasında dursun diye + anglePerItem/2 ekliyoruz
    const targetItemCenter = winningIndex * anglePerItem + anglePerItem / 2;
    
    // OK bu açıyı gösterdiğinde, çark ne kadar dönmüş olmalı?
    // angleAtPointer = (360 - rotation) % 360 = targetItemCenter
    // rotation = (360 - targetItemCenter) % 360
    const targetRotationMod = (360 - targetItemCenter) % 360;
    const currentNormalized = ((rotation % 360) + 360) % 360;
    
    let rotationNeeded = targetRotationMod - currentNormalized;
    if (rotationNeeded < 0) rotationNeeded += 360;
    
    // 5-7 tam tur + gerekli dönüş
    const spins = 5 + Math.floor(Math.random() * 3);
    const targetRotationValue = rotation + spins * 360 + rotationNeeded;
    
    const startRotation = rotation;
    const totalRotation = targetRotationValue - startRotation;
    const duration = 5500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Yumuşak yavaşlama
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentRotation = startRotation + totalRotation * easedProgress;
      setDisplayRotation(currentRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Son pozisyon
        setRotation(targetRotationValue);
        setDisplayRotation(targetRotationValue);
        
        // OK'un üzerindeki gerçek ürünü hesapla
        const actualProduct = getProductAtPointer(targetRotationValue);
        
        setTimeout(() => {
          setIsSpinning(false);
          onSpinEnd(actualProduct);
        }, 200);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, products, anglePerItem, itemCount, rotation, onSpinEnd, setIsSpinning]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Segment yolunu hesapla
  // Her ürünün başlangıç açısı: index * anglePerItem
  const getSegmentPath = (index: number) => {
    const startAngle = index * anglePerItem;
    const endAngle = (index + 1) * anglePerItem;
    const radius = 200;
    const centerX = 200;
    const centerY = 200;
    
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  // Metin pozisyonunu hesapla - segment ortası
  const getTextPosition = (index: number) => {
    const angle = index * anglePerItem + anglePerItem / 2 - 90;
    const radius = 140;
    const centerX = 200;
    const centerY = 200;
    
    const rad = angle * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
      rotation: angle + 90,
    };
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Çark Konteyneri */}
      <div 
        className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px]"
      >
        {/* OK İşareti - ÜSTTE */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-30">
          <div className="relative">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-shopalm-accent drop-shadow-[0_0_10px_rgba(244,208,63,0.8)]" />
            <div className="absolute inset-0 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-shopalm-accent blur-md opacity-60" />
          </div>
        </div>

        {/* Çark */}
        <div 
          ref={wheelRef}
          className="w-full h-full rounded-full relative"
          style={{
            transform: `rotate(${displayRotation}deg)`,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(0, 0, 0, 0.2)',
          }}
        >
          <svg 
            viewBox="0 0 400 400" 
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}
          >
            {/* Segmentler */}
            {products.map((product, index) => (
              <g key={product.id}>
                <path
                  d={getSegmentPath(index)}
                  fill={product.color}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                <path
                  d={getSegmentPath(index)}
                  fill={`url(#gradient-${index})`}
                  opacity="0.3"
                />
              </g>
            ))}
            
            <defs>
              {products.map((_, index) => (
                <linearGradient 
                  key={index}
                  id={`gradient-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="black" stopOpacity="0.2" />
                </linearGradient>
              ))}
            </defs>
            
            {/* Merkez */}
            <circle cx="200" cy="200" r="55" fill="#1a237e" stroke="#f4d03f" strokeWidth="3" />
            <circle cx="200" cy="200" r="48" fill="#283593" />
            
            <text 
              x="200" 
              y="208" 
              textAnchor="middle" 
              className="fill-white font-bold"
              style={{ fontFamily: 'Poppins', fontSize: '18px' }}
            >
              Shopalm
            </text>
          </svg>

          {/* Ürün Etiketleri */}
          <div className="absolute inset-0">
            {products.map((product, index) => {
              const pos = getTextPosition(index);
              return (
                <div
                  key={`label-${product.id}`}
                  className="absolute flex flex-col items-center justify-center"
                  style={{
                    left: `${(pos.x / 400) * 100}%`,
                    top: `${(pos.y / 400) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    width: '80px',
                  }}
                >
                  <span className="text-2xl md:text-3xl mb-1 drop-shadow-lg">{product.icon}</span>
                  <span 
                    className="text-[8px] md:text-[10px] font-semibold text-white text-center leading-tight drop-shadow-md"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)', fontFamily: 'Inter' }}
                  >
                    {product.name.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dış Çerçeve */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #f4d03f 0%, #5c6bc0 50%, #f4d03f 100%)',
              padding: '4px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        </div>
      </div>

      {/* Çevir Butonu */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`
          relative mt-8 w-28 h-28 md:w-32 md:h-32 rounded-full 
          flex items-center justify-center
          font-display font-bold text-xl md:text-2xl text-white
          transition-all duration-200
          ${isSpinning 
            ? 'opacity-50 cursor-not-allowed scale-95' 
            : 'hover:scale-110 hover:shadow-neon-intense active:scale-95 cursor-pointer'
          }
        `}
        style={{
          background: 'linear-gradient(135deg, #1a237e 0%, #5c6bc0 50%, #1a237e 100%)',
          backgroundSize: '200% 200%',
          animation: isSpinning ? 'none' : 'gradient-shift 3s linear infinite',
          boxShadow: '0 0 30px rgba(244, 208, 63, 0.4), inset 0 0 20px rgba(255,255,255,0.1)',
          border: '3px solid rgba(244, 208, 63, 0.6)',
        }}
      >
        <span className="relative z-10">
          {isSpinning ? <span className="animate-spin text-2xl">⟳</span> : 'ÇEVİR'}
        </span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-shopalm-accent/20 to-shopalm-blue/20 blur-md" />
      </button>

      {isSpinning && (
        <p className="mt-4 text-white/70 text-sm animate-pulse">Şansın dönüyor...</p>
      )}
    </div>
  );
}
