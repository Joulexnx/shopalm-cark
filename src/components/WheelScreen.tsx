import { useState, useEffect } from 'react';
import type { Product, Winner } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Wheel } from './Wheel';
import { ResultModal } from './ResultModal';
import { WinnersList } from './WinnersList';
import { RotateCcw, LogOut } from 'lucide-react';

interface WheelScreenProps {
  userName: string;
  onReset: () => void;
}

// Çark sırası: OK'un altından başlayarak saat yönünde
// OK 0° pozisyonunda, çark saat yönünde dönüyor
const INITIAL_PRODUCTS: Product[] = [
  // 0° - OK'un altında (BAŞLANGIÇ)
  { id: 1, name: 'OfisWeb %50 İndirim', stock: 5, icon: '', color: '#1a237e' },
  // 45° - Saat yönünde bir sonraki
  { id: 2, name: 'Bukytalk İngilizce Öğrenim Seansı', stock: 5, icon: '', color: '#283593' },
  // 90°
  { id: 3, name: 'Shopalm 500₺ Kupon', stock: 5, icon: '', color: '#3949ab' },
  // 135°
  { id: 4, name: 'WhyNot %35 İndirim', stock: 5, icon: '', color: '#5c6bc0' },
  // 180°
  { id: 5, name: 'JBL Bluetooth Hoparlör', stock: 5, icon: '🔊', color: '#7986cb' },
  // 225°
  { id: 6, name: 'Shopalm 100₺ Kupon', stock: 20, icon: '💰', color: '#9fa8da' },
  // 270°
  { id: 7, name: 'Powerbank 20.000mAh', stock: 4, icon: '🔋', color: '#c5cae9' },
  // 315°
  { id: 8, name: 'Şanslı Çekiliş Hakkı', stock: 50, icon: '🍀', color: '#e8eaf6' },
];

// Sponsor data with real logos
const SPONSORS = [
  { name: 'Shopalm', logo: '/shopalm-white.png', isMain: true },
  { name: 'WHYNOT', logo: '/sponsor-whynot.jpg' },
  { name: 'Bukytalk', logo: '/sponsor-bukytalk.jpeg' },
  { name: 'OfisWeb', logo: '/sponsor-ofisweb.png' },
  { name: 'TechStore', logo: '/sponsor-techstore.png' },
  { name: 'MobilePlus', logo: '/sponsor-mobileplus.png' },
  { name: 'GameCenter', logo: '/sponsor-gamecenter.png' },
];

export function WheelScreen({ userName, onReset }: WheelScreenProps) {
  const [products, setProducts] = useLocalStorage<Product[]>('shopalm-products', INITIAL_PRODUCTS);
  const [winners, setWinners] = useLocalStorage<Winner[]>('shopalm-winners', []);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wonProduct, setWonProduct] = useState<Product | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSpinEnd = (product: Product) => {
    const currentProduct = products.find(p => p.id === product.id);
    
    if (!currentProduct || currentProduct.stock <= 0) {
      setIsSpinning(false);
      return;
    }

    setProducts(prev => 
      prev.map(p => 
        p.id === product.id 
          ? { ...p, stock: p.stock - 1 }
          : p
      )
    );

    const newWinner: Winner = {
      id: Date.now(),
      name: userName,
      product: currentProduct,
      timestamp: new Date(),
    };

    setWinners(prev => [newWinner, ...prev]);
    setWonProduct(currentProduct);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setWonProduct(null);
  };

  const handleResetAll = () => {
    if (confirm('Tüm verileri sıfırlamak istediğinize emin misiniz?')) {
      setProducts(INITIAL_PRODUCTS);
      setWinners([]);
    }
  };

  const availableProducts = products.filter(p => p.stock > 0);
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div 
      className={`min-h-screen flex flex-col transition-all duration-500 ease-expo-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Header - No Logo */}
      <header 
        className={`w-full px-4 md:px-8 py-4 flex items-center justify-end glass-card rounded-none border-x-0 border-t-0 transition-all duration-500 ease-expo-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
        style={{ transitionDelay: '400ms' }}
      >
        <div className="flex items-center gap-2">
          {winners.length > 0 && (
            <button
              onClick={handleResetAll}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-shopalm-accent hover:bg-white/20 transition-all duration-200"
              title="Tüm Verileri Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={onReset}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            title="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content with Sponsor Panel */}
      <main className="flex-1 flex">
        {/* Left Sponsor Panel */}
        <aside 
          className={`hidden lg:flex flex-col w-64 p-6 border-r border-white/10 transition-all duration-500 ease-expo-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-display font-bold text-white">Sponsorlar</h3>
          </div>
          
          <div className="space-y-3">
            {SPONSORS.map((sponsor) => (
              <div
                key={sponsor.name}
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group
                  ${sponsor.isMain 
                    ? 'bg-shopalm-accent/20 border border-shopalm-accent/40' 
                    : 'bg-white/5 hover:bg-white/10'
                  }
                `}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 overflow-hidden flex-shrink-0">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-lg font-bold text-white">${sponsor.name.charAt(0)}</span>`;
                      }
                    }}
                  />
                </div>
                <span className={`font-medium text-sm transition-colors ${sponsor.isMain ? 'text-shopalm-accent' : 'text-white/80 group-hover:text-white'}`}>
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {/* Wheel Section */}
          <div 
            className={`w-full flex flex-col items-center transition-all duration-800 ease-expo-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <Wheel
              products={products}
              onSpinEnd={handleSpinEnd}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />
          </div>

          {/* Available Products Info */}
          <div 
            className={`mt-6 text-center transition-all duration-500 ease-expo-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '700ms' }}
          >
            <p className="text-white/60 text-sm">
              <span className="text-shopalm-accent font-semibold">{availableProducts.length}</span> ürün çarkta,
              <span className="text-shopalm-accent font-semibold ml-1">
                {totalStock}
              </span>
              <span className="ml-1">toplam ödül kaldı</span>
            </p>
          </div>

          {/* Winners List */}
          <div 
            className={`w-full max-w-3xl transition-all duration-500 ease-expo-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <WinnersList winners={winners} products={products} />
          </div>
        </div>
      </main>

      {/* Result Modal */}
      <ResultModal
        product={wonProduct}
        userName={userName}
        isOpen={showModal}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="w-full py-4 text-center text-white/40 text-sm border-t border-white/5">
        <p>© 2026 Shopalm Çarkıfelek - Şansını dene, kazan!</p>
      </footer>
    </div>
  );
}
