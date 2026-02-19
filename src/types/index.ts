export interface Product {
  id: number;
  name: string;
  stock: number;
  icon: string;
  color: string;
}

export interface Winner {
  id: number;
  name: string;
  product: Product;
  timestamp: Date;
}

export type Screen = 'landing' | 'wheel';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}
