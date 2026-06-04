import React, { useState } from 'react';

const Planner = ({ onGenerate, isLoading }) => {
  const [departure, setDeparture] = useState('Athens');
  const [budget, setBudget] = useState(600);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <div className="container page-pad">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="font-display text-ocean" style={{ marginBottom: '20px' }}>Plan Your Itinerary</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label className="form-label">Departure City</label>
            <input className="form-input" value={departure} onChange={e => setDeparture(e.target.value)} />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label className="form-label">Budget (€): {budget}</label>
            <input type="range" min="200" max="3000" step="50" value={budget} onChange={e => setBudget(Number(e.target.value))} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? 'Generating with Aegeo AI...' : 'Generate Trip 🌊'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Planner;