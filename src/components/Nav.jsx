import React from 'react';

const Nav = ({ onNavigate, current }) => {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: 'var(--nav-h)', background: 'rgba(245,239,224,0.88)',
      backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(26,77,110,0.08)'
    }}>
      <button onClick={() => onNavigate('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ocean)' }}>
        Aeg<span style={{ fontStyle: 'italic', color: 'var(--terracotta)' }}>eo</span>
      </button>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="btn" style={{ padding: '8px 18px', fontSize: '0.85rem', background: current === 'quiz' ? 'var(--ocean)' : 'transparent', color: current === 'quiz' ? 'white' : 'var(--ocean)', border: '1.5px solid var(--ocean)' }} onClick={() => onNavigate('quiz')}>Travel DNA</button>
        <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }} onClick={() => onNavigate('planner')}>Plan a Trip</button>
      </div>
    </nav>
  );
};

export default Nav;