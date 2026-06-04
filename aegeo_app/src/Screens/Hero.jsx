import React from 'react';

const Hero = ({ onNavigate }) => (
  <div className="container page-pad animate-fade-up" style={{ textAlign: 'center', marginTop: '60px' }}>
    <span className="section-tag">Welcome to Aegeo</span>
    <h1 className="font-display text-ocean" style={{ fontSize: '3.2rem', margin: '20px 0', lineHeight: '1.2' }}>Discover the Travel DNA of the Aegean & Beyond</h1>
    <p className="text-gray" style={{ maxWidth: '600px', margin: '0 auto 40px auto', fontSize: '1.1rem' }}>An AI-powered travel companion that crafts perfect, realistic itineraries tailored exactly to your vibe and budget.</p>
    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
      <button className="btn btn-primary" onClick={() => onNavigate('quiz')}>Take the Quiz 🧬</button>
      <button className="btn btn-secondary" onClick={() => onNavigate('planner')}>Plan a Trip 🗺️</button>
    </div>
  </div>
);

export default Hero;