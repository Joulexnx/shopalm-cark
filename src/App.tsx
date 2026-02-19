import { useState } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { LandingScreen } from './components/LandingScreen';
import { WheelScreen } from './components/WheelScreen';
import type { Screen } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userName, setUserName] = useState('');

  const handleStart = (name: string) => {
    setUserName(name);
    setTimeout(() => {
      setCurrentScreen('wheel');
    }, 400);
  };

  const handleReset = () => {
    setUserName('');
    setCurrentScreen('landing');
  };

  return (
    <div className="relative min-h-screen">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        {currentScreen === 'landing' ? (
          <LandingScreen onStart={handleStart} />
        ) : (
          <WheelScreen userName={userName} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;
