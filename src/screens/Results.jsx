import React, { useState } from 'react';

const Results = ({ tripData }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm your Aegeo companion for ${tripData.destination}! 🌊 Ask me about weather, food, or changes.` }
  ]);
  const [input, setInput] = useState('');

  const getMockReply = (msg) => {
    const m = msg.toLowerCase();
    if (m.includes('weather')) return "Lisbon has beautiful weather in spring/summer — pack a light layer for evenings! ☀️";
    if (m.includes('food') || m.includes('eat')) return "For local food, I recommend finding side-street spots in Alfama — that's where the locals go! 🍽️";
    return "Great question about your trip! I'd love to help you make it even better. What else can I check? 🌊";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply = getMockReply(input);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    }, 1000);
  };

  return (
    <div className="container page-pad" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
      <div>
        <span className="section-tag">✨ Match Score: {tripData.match_score}%</span>
        <h1 className="font-display text-ocean" style={{ fontSize: '2.5rem', margin: '10px 0' }}>{tripData.destination}, {tripData.country}</h1>
        <p className="text-terra" style={{ fontStyle: 'italic', marginBottom: '30px' }}>"{tripData.tagline}"</p>
        
        {tripData.days.map(day => (
          <div key={day.day} className="card" style={{ marginBottom: '20px', padding: '20px' }}>
            <h3 className="text-ocean" style={{ marginBottom: '5px' }}>Day {day.day}: {day.title}</h3>
            <p className="text-gray" style={{ fontSize: '0.9rem', marginBottom: '15px' }}>{day.summary}</p>
            {day.activities.map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: '15px', margin: '12px 0', paddingLeft: '10px', borderLeft: '2px solid var(--foam)' }}>
                <span style={{ fontSize: '1.2rem' }}>{act.icon}</span>
                <div>
                  <strong>{act.time} - {act.name}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#555' }}>{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '500px', position: 'sticky', top: '90px' }}>
          <h3 className="text-ocean" style={{ marginBottom: '15px' }}>Chat with Aegeo 🌊</h3>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', 
                background: m.role === 'user' ? 'var(--ocean)' : 'var(--sand2)', 
                color: m.role === 'user' ? 'white' : 'var(--ink)', 
                padding: '10px 14px', borderRadius: '14px', maxWidth: '85%', fontSize: '0.9rem' 
              }}>
                {m.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
            <input className="form-input" value={input} onChange={e => setInput(e.target.value)} placeholder="Type 'weather' or 'food'..." style={{ padding: '10px' }} />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Results;