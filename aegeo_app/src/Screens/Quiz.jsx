import React, { useState } from 'react';

const Quiz = () => {
  const questions = [
    {
      q: "Ποιο είναι το ιδανικό σου πρωινό στο νησί;",
      opts: [
        { icon: "☕", text: "Καφές με θέα την καλντέρα σε απόλυτη ηρεμία" },
        { icon: "🏄", text: "Ένα γρήγορο smoothie πριν πάρω τη σανίδα για σερφ" },
        { icon: "🥞", text: "Παραδοσιακή τυρόπιτα σε ένα καφενείο που παίζει ρεμπέτικα" }
      ]
    },
    {
      q: "Πώς φαντάζεσαι το τέλειο απόγευμα;",
      opts: [
        { icon: "🍷", text: "Wine tasting σε ένα πολυτελές οινοποιείο" },
        { icon: "🥾", text: "Πεζοπορία σε ένα άγριο, ανεξερεύνητο μονοπάτι" },
        { icon: "💃", text: "Χορό σε ένα πανηγύρι μέχρι το επόμενο πρωί" }
      ]
    },
    {
      q: "Τι δεν αποχωρίζεσαι ποτέ στις διακοπές σου;",
      opts: [
        { icon: "🕶️", text: "Τα καλά μου γυαλιά ηλίου και stylish ρούχα" },
        { icon: "🎒", text: "Το σακίδιο πλάτης και τα αθλητικά μου παπούτσια" },
        { icon: "🃏", text: "Μια τράπουλα, καλή παρέα και μηδενικό άγχος" }
      ]
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ luxury: 0, adventure: 0, relax: 0 });
  const [result, setResult] = useState(null);

  const handleAnswer = (index) => {
    const nextScore = { ...score };
    if (index === 0) nextScore.luxury += 1;
    if (index === 1) nextScore.adventure += 1;
    if (index === 2) nextScore.relax += 1;
    
    setScore(nextScore);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      let finalType = "";
      let emoji = "🧬";
      let desc = "";
      let dests = [];

      if (nextScore.luxury >= nextScore.adventure && nextScore.luxury >= nextScore.relax) {
        finalType = "The Jetsetter";
        emoji = "✨";
        desc = "Σου αρέσει η κομψότητα, η κυκλαδίτικη αρχιτεκτονική, τα εκπληκτικά ηλιοβασιλέματα και οι high-end εμπειρίες.";
        dests = ["Σαντορίνη", "Μύκονος"];
      } else if (nextScore.adventure >= nextScore.luxury && nextScore.adventure >= nextScore.relax) {
        finalType = "The Explorer";
        emoji = "🥾";
        desc = "Αναζητάς τη δράση, τις κρυφές παραλίες, τα θαλάσσια σπορ και το άγριο φυσικό τοπίο.";
        dests = ["Νάξος", "Κάρπαθος"];
      } else {
        finalType = "The Slow-Traveler";
        emoji = "🌊";
        desc = "Για σένα διακοπές σημαίνει απόλυτη χαλάρωση, καλό φαγητό, ατελείωτες ώρες στην αμμουδιά και αυθεντική νησιώτικη ζωή.";
        dests = ["Ικαρία", "Αμοργός"];
      }

      setResult({ type: finalType, emoji, description: desc, destinations: dests });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore({ luxury: 0, adventure: 0, relax: 0 });
    setResult(null);
  };

  if (result) {
    return (
      <div className="container page-pad animate-fade-up">
        <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
          <span style={{ fontSize: '3.5rem' }}>{result.emoji}</span>
          <h2 className="font-display text-ocean" style={{ margin: '15px 0' }}>Το Travel DNA σου: {result.type}</h2>
          <p className="text-gray" style={{ marginBottom: '25px' }}>{result.description}</p>
          
          <div style={{ background: 'var(--sand)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '25px' }}>
            <h4 style={{ color: 'var(--ocean)', marginBottom: '10px' }}>🏝️ Προτεινόμενα Νησιά για Εσένα:</h4>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              {result.destinations.map((d, i) => (
                <span key={i} className="section-tag" style={{ fontSize: '1rem', padding: '8px 16px' }}>{d}</span>
              ))}
            </div>
          </div>

          <button className="btn btn-secondary" onClick={resetQuiz}>Ξεκίνα Ξανά 🔄</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-pad animate-fade-up">
      <div className="card" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ display: 'flex', justifycontent: 'space-between', color: 'var(--gray)', fontSize: '0.85rem', marginBottom: '15px' }}>
          <span>🧬 Travel DNA Quiz</span>
          <span>Ερώτηση {currentQuestion + 1} από {questions.length}</span>
        </div>
        
        <div style={{ background: 'var(--sand2)', height: '6px', borderRadius: '3px', marginBottom: '30px', overflow: 'hidden' }}>
          <div style={{ background: 'var(--ocean)', height: '100%', width: `${((currentQuestion + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }}></div>
        </div>

        <h2 className="font-display text-ocean" style={{ marginBottom: '25px', fontSize: '1.6rem' }}>
          {questions[currentQuestion].q}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {questions[currentQuestion].opts.map((opt, index) => (
            <button 
              key={index} 
              className="btn btn-secondary" 
              style={{ justifyContent: 'flex-start', textAlign: 'left', width: '100%', padding: '16px 24px', borderRadius: 'var(--radius-md)', background: 'var(--white)' }}
              onClick={() => handleAnswer(index)}
            >
              <span style={{ fontSize: '1.3rem', marginRight: '10px' }}>{opt.icon}</span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;