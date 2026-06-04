import React, { useState } from 'react';
import Nav from './components/Nav';
import Hero from './screens/Hero';
import Planner from './screens/Planner';
import Quiz from './screens/Quiz';
import Results from './screens/Results';

// Mock Data
const mockTripData = {
  destination: 'Lisbon',
  country: 'Portugal',
  tagline: 'Sun-drenched tiles, fado echoes, and Atlantic soul',
  match_score: 93,
  days: [
    {
      day: 1,
      title: 'Arrival & Alfama Discovery',
      summary: 'Settle in, explore the ancient Moorish quarter, catch a golden sunset',
      activities: [
        { time: '14:00', icon: '✈️', name: 'Arrival & Check-in', description: 'Arrive at Humberto Delgado Airport. Take the Metro to Alfama.', cost: 2 },
        { time: '16:30', icon: '🏰', name: 'São Jorge Castle', description: "Lisbon's iconic hilltop fortress with sweeping views over terracotta rooftops.", cost: 10 },
        { time: '20:30', icon: '🎵', name: 'Live Fado at Tasca do Chico', description: 'A tiny atmospheric fado house where locals still outnumber tourists.', cost: 25 },
      ],
    },
    {
      day: 2,
      title: 'Belém & Maritime History',
      summary: 'Follow the Age of Discovery along the waterfront',
      activities: [
        { time: '09:00', icon: '🥐', name: 'Pastéis de Belém', description: 'The original custard tart bakery since 1837. Order them hot with cinnamon.', cost: 3 },
        { time: '10:30', icon: '🗺️', name: 'Jerónimos Monastery', description: 'UNESCO Manueline masterpiece — the cloister is extraordinary.', cost: 10 },
      ],
    }
  ]
};

function App() {
  const [screen, setScreen] = useState('hero');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setData(mockTripData);
      setScreen('results');
    }, 1500);
  };

  return (
    <div>
      <Nav onNavigate={setScreen} current={screen} />
      {screen === 'hero' && <Hero onNavigate={setScreen} />}
      {screen === 'planner' && <Planner onGenerate={handleGenerate} isLoading={isLoading} />}
      {screen === 'quiz' && <Quiz />}
      {screen === 'results' && data && <Results tripData={data} />}
    </div>
  );
}

export default App;