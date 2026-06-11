import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CosmicBackground from './components/CosmicBackground';
import ChitaForm from './components/ChitaForm';
import JourneyView from './components/JourneyView';

function App() {
  const [journeyData, setJourneyData] = useState(null);
  const [isWarping, setIsWarping] = useState(false);

  const handleStartJourney = (data) => {
    setIsWarping(true);
    
    // Simulate warp travel transition before showing results
    setTimeout(() => {
      setJourneyData(data);
      setTimeout(() => {
        setIsWarping(false);
      }, 500); // Ease out warp speed after data is set
    }, 1500); // 1.5 seconds of pure warp speed
  };

  const handleReset = () => {
    setIsWarping(true);
    setTimeout(() => {
      setJourneyData(null);
      setTimeout(() => {
        setIsWarping(false);
      }, 500);
    }, 1500);
  };

  return (
    <>
      <CosmicBackground isWarping={isWarping} />
      
      <main style={{ minHeight: '100vh', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {!journeyData ? (
            <ChitaForm key="form" onSubmit={handleStartJourney} />
          ) : (
            <JourneyView key="journey" data={journeyData} onReset={handleReset} />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
