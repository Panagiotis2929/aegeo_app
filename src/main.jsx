import { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --ocean:    #1a4d6e;
    --ocean2:   #2a6f9e;
    --sky:      #e8f4fd;
    --terra:    #c0622a;
    --terra2:   #e8906a;
    --sand:     #f5efdf;
    --sand2:    #ede4ce;
    --foam:     #b8d8e8;
    --white:    #fdfaf4;
    --ink:      #1a1a2e;
    --gray:     #6b7280;
    --nav-h:    64px;
    --radius:   16px;
    --radius-sm:10px;
    --transition: 0.38s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--white);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .font-display { font-family: 'Playfair Display', serif; }

  /* ── PAGE TRANSITIONS ── */
  .page-wrapper {
    padding-top: var(--nav-h);
    min-height: 100vh;
  }

  .page-enter {
    animation: pageIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .page-exit {
    animation: pageOut 0.25s ease-in forwards;
    pointer-events: none;
  }

  @keyframes pageIn {
    from { opacity: 0; transform: translateY(24px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes pageOut {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to   { opacity: 0; transform: translateY(-12px) scale(1.01); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideRight { from { width: 0; } to { width: 100%; } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }

  .stagger-1 { animation: fadeUp 0.5s 0.05s both; }
  .stagger-2 { animation: fadeUp 0.5s 0.15s both; }
  .stagger-3 { animation: fadeUp 0.5s 0.25s both; }
  .stagger-4 { animation: fadeUp 0.5s 0.35s both; }
  .stagger-5 { animation: fadeUp 0.5s 0.45s both; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: var(--nav-h);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px;
    background: rgba(253,250,244,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(26,77,110,0.07);
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700;
    color: var(--ocean); background: none; border: none; cursor: pointer;
    letter-spacing: -0.01em;
  }
  .nav-logo span { font-style: italic; color: var(--terra); }
  .nav-actions { display: flex; gap: 10px; align-items: center; }

  /* ── BUTTONS ── */
  .btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem; font-weight: 500;
    padding: 10px 22px; border-radius: 100px;
    border: none; cursor: pointer;
    transition: all 0.22s ease; display: inline-flex; align-items: center; gap: 6px;
    text-decoration: none; white-space: nowrap;
  }
  .btn:active { transform: scale(0.97); }
  .btn-ghost {
    background: transparent;
    color: var(--ocean);
    border: 1.5px solid var(--ocean);
  }
  .btn-ghost:hover { background: var(--sky); }
  .btn-ghost.active { background: var(--ocean); color: white; }
  .btn-primary {
    background: var(--ocean); color: white;
    box-shadow: 0 4px 20px rgba(26,77,110,0.25);
  }
  .btn-primary:hover { background: var(--ocean2); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(26,77,110,0.35); }
  .btn-secondary {
    background: var(--sand); color: var(--ocean);
    border: 1.5px solid var(--sand2);
  }
  .btn-secondary:hover { background: var(--sand2); }

  /* ── CARD ── */
  .card {
    background: white;
    border: 1px solid rgba(26,77,110,0.08);
    border-radius: var(--radius);
    padding: 28px;
    transition: box-shadow 0.22s ease;
  }
  .card:hover { box-shadow: 0 8px 32px rgba(26,77,110,0.08); }

  /* ── FORM ── */
  .form-label {
    display: block;
    font-size: 0.8rem; font-weight: 500;
    color: var(--gray); letter-spacing: 0.04em;
    text-transform: uppercase; margin-bottom: 8px;
  }
  .form-input {
    width: 100%; padding: 12px 16px;
    border: 1.5px solid var(--sand2);
    border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    background: var(--white); color: var(--ink);
    outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--ocean); }

  input[type="range"] {
    width: 100%; -webkit-appearance: none; height: 6px;
    border-radius: 3px; background: var(--sand2); outline: none;
    cursor: pointer;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 20px; height: 20px;
    border-radius: 50%; background: var(--ocean);
    box-shadow: 0 2px 8px rgba(26,77,110,0.3);
    cursor: pointer;
  }

  /* ── TAG ── */
  .tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--sky); color: var(--ocean);
    font-size: 0.75rem; font-weight: 500;
    padding: 5px 12px; border-radius: 100px;
    letter-spacing: 0.03em;
  }

  /* ── HERO ── */
  .hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 60% at 60% 40%, rgba(184,216,232,0.35) 0%, transparent 65%),
                radial-gradient(ellipse 50% 40% at 20% 70%, rgba(192,98,42,0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--foam); border-radius: 3px; }

  /* ── CHAT ── */
  .chat-bubble {
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 0.875rem;
    line-height: 1.55;
    max-width: 88%;
    animation: fadeIn 0.3s ease;
  }
  .bubble-ai {
    background: var(--sky);
    color: var(--ink);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }
  .bubble-user {
    background: var(--ocean);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  .typing-dot {
    display: inline-block; width: 6px; height: 6px;
    background: var(--ocean); border-radius: 50%;
    animation: pulse 1.2s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  /* ── ACTIVITY TIMELINE ── */
  .activity-item {
    display: flex; gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid var(--sand);
    transition: background 0.2s;
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-time {
    font-size: 0.75rem; font-weight: 500;
    color: var(--gray); min-width: 42px; padding-top: 3px;
  }
  .activity-icon {
    font-size: 1.3rem; min-width: 28px; text-align: center;
  }

  /* ── SCORE BADGE ── */
  .score-ring {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: conic-gradient(var(--ocean) var(--pct), var(--sand2) 0);
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .score-ring::after {
    content: ''; position: absolute;
    width: 56px; height: 56px;
    background: white; border-radius: 50%;
  }
  .score-num {
    position: relative; z-index: 1;
    font-size: 1rem; font-weight: 700; color: var(--ocean);
  }

  /* ── RESULT CARD HOVER ── */
  .day-card {
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }
  .day-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(26,77,110,0.1); }

  /* ── LOADING SPINNER ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 40px; height: 40px;
    border: 3px solid var(--sand2);
    border-top-color: var(--ocean);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .nav { padding: 0 20px; }
    .results-grid { grid-template-columns: 1fr !important; }
    .hero-title { font-size: 2.2rem !important; }
  }
`;

// ─── ANTHROPIC AI CALL ──────────────────────────────────────────────
async function callAegeoAI(messages, systemPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  const data = await response.json();
  return data.content.map(b => b.text || "").join("");
}

async function generateTripAI(departure, budget, days) {
  const prompt = `You are Aegeo, an expert travel planner for Mediterranean and European destinations.

Generate a complete ${days}-day trip itinerary as a JSON object. The traveler departs from ${departure} with a total budget of €${budget}.

Return ONLY valid JSON with this exact structure:
{
  "destination": "City Name",
  "country": "Country",
  "tagline": "Short poetic 8-word tagline",
  "match_score": 87,
  "budget_used": 540,
  "days": [
    {
      "day": 1,
      "title": "Day Title",
      "summary": "One sentence summary",
      "activities": [
        {
          "time": "10:00",
          "icon": "🏛️",
          "name": "Activity Name",
          "description": "2-sentence vivid description with local tips.",
          "cost": 15
        }
      ]
    }
  ]
}

Rules:
- Pick a destination reachable from ${departure} within the budget €${budget}
- Include 3-4 activities per day with realistic costs
- Mix iconic sights with local hidden gems
- Keep total costs under €${budget}
- Use evocative descriptions, mention smells, sounds, atmosphere
- Return ONLY the JSON, no markdown fences, no extra text`;

  const raw = await callAegeoAI([{ role: "user", content: prompt }], "You are a travel expert. Output only valid JSON.");
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── PAGE TRANSITION WRAPPER ────────────────────────────────────────
function PageTransition({ children, pageKey }) {
  const [phase, setPhase] = useState("enter");
  const prevKey = useRef(pageKey);

  useEffect(() => {
    if (prevKey.current !== pageKey) {
      setPhase("exit");
      const t = setTimeout(() => { setPhase("enter"); prevKey.current = pageKey; }, 280);
      return () => clearTimeout(t);
    }
  }, [pageKey]);

  return (
    <div key={prevKey.current} className={phase === "enter" ? "page-enter" : "page-exit"}>
      {children}
    </div>
  );
}

// ─── NAV ────────────────────────────────────────────────────────────
function Nav({ current, onNavigate }) {
  return (
    <nav className="nav">
      <button className="nav-logo" onClick={() => onNavigate("hero")}>
        Aeg<span>eo</span>
      </button>
      <div className="nav-actions">
        <button
          className={`btn btn-ghost ${current === "quiz" ? "active" : ""}`}
          onClick={() => onNavigate("quiz")}
        >
          Travel DNA 🧬
        </button>
        <button className="btn btn-primary" onClick={() => onNavigate("planner")}>
          Plan a Trip 🗺️
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────
function Hero({ onNavigate }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center" }}>
      <div className="hero-bg" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 48px", position: "relative" }}>
        <div className="stagger-1">
          <span className="tag">✨ AI-Powered Travel Planning</span>
        </div>
        <h1
          className="font-display hero-title stagger-2"
          style={{ fontSize: "3.8rem", lineHeight: 1.15, marginTop: 24, marginBottom: 20, color: "var(--ocean)" }}
        >
          Discover Your Perfect<br />
          <span style={{ color: "var(--terra)", fontStyle: "italic" }}>Mediterranean Escape</span>
        </h1>
        <p className="stagger-3" style={{ fontSize: "1.1rem", color: "var(--gray)", maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
          An AI travel companion that crafts hyper-personalised itineraries — tailored to your departure city, budget, and vibe.
        </p>
        <div className="stagger-4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }} onClick={() => onNavigate("quiz")}>
            Take the Quiz 🧬
          </button>
          <button className="btn btn-secondary" style={{ fontSize: "1rem", padding: "14px 32px" }} onClick={() => onNavigate("planner")}>
            Plan a Trip 🗺️
          </button>
        </div>
        <div className="stagger-5" style={{ display: "flex", gap: 32, marginTop: 56 }}>
          {[["🏝️", "Greek Islands"], ["🏛️", "Historic Cities"], ["🌊", "Coastal Escapes"]].map(([icon, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.4rem" }}>{icon}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--gray)", fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PLANNER ─────────────────────────────────────────────────────────
function Planner({ onGenerate, isLoading }) {
  const [departure, setDeparture] = useState("Athens");
  const [budget, setBudget] = useState(800);
  const [days, setDays] = useState(3);
  const [customDep, setCustomDep] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const cities = ["Athens", "Thessaloniki", "Heraklion", "Rhodes", "Patras", "Rome", "Barcelona", "Istanbul", "Bucharest"];
  const finalDep = useCustom ? customDep : departure;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px" }}>
      <div className="stagger-1" style={{ marginBottom: 32 }}>
        <span className="tag">🗺️ Trip Planner</span>
        <h2 className="font-display" style={{ fontSize: "2.2rem", color: "var(--ocean)", marginTop: 14 }}>
          Where shall we go?
        </h2>
        <p style={{ color: "var(--gray)", marginTop: 8 }}>
          Tell us your starting point and budget — our AI does the rest.
        </p>
      </div>

      <div className="card stagger-2" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Departure City */}
        <div>
          <label className="form-label">Departure City</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            {cities.map(c => (
              <button
                key={c}
                className={`btn ${!useCustom && departure === c ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: 100 }}
                onClick={() => { setDeparture(c); setUseCustom(false); }}
              >
                {c}
              </button>
            ))}
            <button
              className={`btn ${useCustom ? "btn-primary" : "btn-ghost"}`}
              style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: 100 }}
              onClick={() => setUseCustom(true)}
            >
              + Other
            </button>
          </div>
          {useCustom && (
            <input
              className="form-input"
              value={customDep}
              onChange={e => setCustomDep(e.target.value)}
              placeholder="Type your city..."
              autoFocus
            />
          )}
          <p style={{ fontSize: "0.8rem", color: "var(--terra)", marginTop: 6 }}>
            📍 Departing from: <strong>{finalDep || "—"}</strong>
          </p>
        </div>

        {/* Budget */}
        <div>
          <label className="form-label">
            Total Budget
            <span style={{ color: "var(--ocean)", fontWeight: 700, fontSize: "1rem", marginLeft: 8 }}>
              €{budget.toLocaleString()}
            </span>
          </label>
          <input
            type="range" min="200" max="4000" step="50"
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--gray)", marginTop: 4 }}>
            <span>€200 Budget</span><span>€4,000 Luxury</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {[400, 800, 1500, 2500].map(v => (
              <button
                key={v}
                className={`btn ${budget === v ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "5px 12px", fontSize: "0.78rem" }}
                onClick={() => setBudget(v)}
              >
                €{v}
              </button>
            ))}
          </div>
        </div>

        {/* Days */}
        <div>
          <label className="form-label">Duration</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[2, 3, 4, 5, 7].map(d => (
              <button
                key={d}
                className={`btn ${days === d ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "8px 16px", fontSize: "0.85rem", flex: 1 }}
                onClick={() => setDays(d)}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: "var(--sky)", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--gray)" }}>Your trip</div>
            <div style={{ fontWeight: 600, color: "var(--ocean)" }}>{finalDep || "—"} → Anywhere ✨</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--gray)" }}>Budget / Days</div>
            <div style={{ fontWeight: 600, color: "var(--ocean)" }}>€{budget} · {days} days</div>
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: 16, fontSize: "1rem" }}
          disabled={isLoading || (!finalDep.trim())}
          onClick={() => onGenerate({ departure: finalDep, budget, days })}
        >
          {isLoading ? (
            <>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Aegeo AI is planning your trip...
            </>
          ) : "Generate My Trip 🌊"}
        </button>
      </div>
    </div>
  );
}

// ─── LOADING SCREEN ──────────────────────────────────────────────────
function LoadingScreen({ departure }) {
  return (
    <div style={{ maxWidth: 560, margin: "100px auto", padding: "0 24px", textAlign: "center" }}>
      <div className="spinner" style={{ marginBottom: 24 }} />
      <h3 className="font-display" style={{ fontSize: "1.5rem", color: "var(--ocean)" }}>
        Σχεδιάζουμε το ταξίδι σας από {departure}...
      </h3>
      <p style={{ color: "var(--gray)", marginTop: 8, fontSize: "0.9rem" }}>
        Ο Aegeo AI αναλύει πτήσεις, διαμονή και τοπικά μυστικά για να δημιουργήσει το τέλειο δρομολόγιο.
      </p>
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────
function Results({ tripData, plannerParams }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Γεια! Είμαι ο Aegeo, ο ταξιδιωτικός σου σύμβουλος για ${tripData.destination}! 🌊 Ρώτησέ με για τον καιρό, το φαγητό, τις γειτονιές, το νυχτερινό τρόπο ζωή, τις μεταφορές — ό,τι θέλεις!`
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const systemPrompt = `You are Aegeo, a warm and knowledgeable travel guide specialising in ${tripData.destination}, ${tripData.country}.
The traveler is visiting for ${tripData.days?.length || 3} days on a €${plannerParams?.budget || 800} budget, departing from ${plannerParams?.departure || "Athens"}.
Their itinerary covers: ${tripData.days?.map(d => d.title).join(", ")}.

Speak in a friendly, enthusiastic tone. Mix Greek and English naturally (respond mainly in Greek if the user writes in Greek, in English if they write in English).
Give SPECIFIC, LOCAL recommendations: exact restaurant names, neighborhoods, times of day, insider tips.
Keep responses concise (2-4 sentences max) unless asked for detail.
Use relevant emojis naturally. Cover topics like: weather, local food & tavernas, hidden gems, nightlife, transport, beaches, day trips, culture, shopping, costs, safety, language tips.`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const reply = await callAegeoAI(history, systemPrompt);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Συγγνώμη, κάτι πήγε στραβά. Δοκίμασε ξανά! 🌊" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header */}
      <div className="stagger-1" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div
            className="score-ring"
            style={{ "--pct": `${(tripData.match_score || 88) * 3.6}deg` }}
          >
            <span className="score-num">{tripData.match_score || 88}%</span>
          </div>
          <div>
            <span className="tag">✨ AI Match Score</span>
            <h1 className="font-display" style={{ fontSize: "2.8rem", color: "var(--ocean)", lineHeight: 1.1, marginTop: 6 }}>
              {tripData.destination},<br />
              <span style={{ color: "var(--terra)", fontStyle: "italic" }}>{tripData.country}</span>
            </h1>
          </div>
        </div>
        <p style={{ color: "var(--gray)", fontStyle: "italic", fontSize: "1.05rem" }}>
          "{tripData.tagline}"
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <span className="tag">📍 From {plannerParams?.departure}</span>
          <span className="tag">💶 €{plannerParams?.budget} budget</span>
          <span className="tag">📅 {tripData.days?.length} days</span>
          {tripData.budget_used && <span className="tag">✅ €{tripData.budget_used} estimated</span>}
        </div>
      </div>

      {/* Grid */}
      <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 28, alignItems: "start" }}>
        {/* Itinerary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {tripData.days?.map((day, di) => (
            <div key={day.day} className="card day-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--terra)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Day {day.day}
                  </div>
                  <h3 className="font-display" style={{ fontSize: "1.35rem", color: "var(--ocean)", marginTop: 2 }}>
                    {day.title}
                  </h3>
                </div>
                <span style={{ fontSize: "1.8rem" }}>
                  {["🌅","🌞","🌆","🌃","🌠"][di % 5]}
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--gray)", marginBottom: 16, fontStyle: "italic" }}>
                {day.summary}
              </p>
              <div>
                {day.activities?.map((act, ai) => (
                  <div key={ai} className="activity-item">
                    <span className="activity-time">{act.time}</span>
                    <span className="activity-icon">{act.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: "0.92rem", marginBottom: 2 }}>{act.name}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--gray)", lineHeight: 1.5 }}>{act.description}</div>
                    </div>
                    {act.cost > 0 && (
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--terra)", whiteSpace: "nowrap", padding: "3px 8px", background: "rgba(192,98,42,0.08)", borderRadius: 20 }}>
                        €{act.cost}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--sand)", display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--gray)" }}>
                  Day total: <strong style={{ color: "var(--ocean)" }}>€{day.activities?.reduce((s, a) => s + (a.cost || 0), 0)}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div style={{ position: "sticky", top: 80 }}>
          <div className="card" style={{ padding: 0, overflow: "hidden", height: 560, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--sand)", background: "var(--sky)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--ocean)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                  🌊
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--ocean)" }}>Aegeo AI Guide</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--gray)" }}>Your {tripData.destination} expert</div>
                </div>
                <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 2px #dcfce7" }} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}>
                  {m.content}
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble bubble-ai" style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick prompts */}
            <div style={{ padding: "8px 12px", display: "flex", gap: 6, overflowX: "auto", borderTop: "1px solid var(--sand)", background: "var(--white)" }}>
              {["🌤️ Καιρός", "🍽️ Φαγητό", "🏖️ Παραλίες", "🌃 Νυχτερινή ζωή", "🚌 Μεταφορές", "💡 Insider tips"].map(q => (
                <button
                  key={q}
                  className="btn btn-ghost"
                  style={{ padding: "5px 10px", fontSize: "0.72rem", whiteSpace: "nowrap", borderRadius: 100 }}
                  onClick={() => { setInput(q); }}
                >
                  {q}
                </button>
              ))}
            </div>

            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--sand)", display: "flex", gap: 8 }}>
              <input
                className="form-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder={`Ask about ${tripData.destination}...`}
                style={{ flex: 1, padding: "10px 14px", fontSize: "0.85rem" }}
              />
              <button
                className="btn btn-primary"
                style={{ padding: "10px 16px", borderRadius: 10 }}
                onClick={handleSend}
                disabled={isTyping}
              >
                ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QUIZ ─────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: "Ποιο είναι το ιδανικό σου πρωινό στο νησί;",
    opts: [
      { icon: "☕", text: "Καφές με θέα την καλντέρα σε απόλυτη ηρεμία" },
      { icon: "🏄", text: "Ένα γρήγορο smoothie πριν πάρω τη σανίδα για σερφ" },
      { icon: "🥞", text: "Παραδοσιακή τυρόπιτα σε ένα καφενείο με ρεμπέτικα" }
    ]
  },
  {
    q: "Πώς φαντάζεσαι το τέλειο απόγευμα;",
    opts: [
      { icon: "🍷", text: "Wine tasting σε ένα πολυτελές οινοποιείο με υπέροχη θέα" },
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
  },
  {
    q: "Το ιδανικό σου κατάλυμα;",
    opts: [
      { icon: "🏨", text: "5 αστέρων boutique hotel με infinity pool" },
      { icon: "⛺", text: "Camping ή hostel — γνωρίζω ταξιδιώτες από όλο τον κόσμο" },
      { icon: "🏡", text: "Ένα παραδοσιακό σπίτι σε ένα ήσυχο χωριό" }
    ]
  }
];

const RESULTS_MAP = {
  luxury: { type: "The Jetsetter", emoji: "✨", desc: "Σου αρέσει η κομψότητα, η κυκλαδίτικη αρχιτεκτονική, τα εκπληκτικά ηλιοβασιλέματα και οι high-end εμπειρίες. Διαλέγεις πάντα ποιότητα έναντι ποσότητας.", dests: ["Σαντορίνη", "Μύκονος", "Σκιάθος"] },
  adventure: { type: "The Explorer", emoji: "🥾", desc: "Αναζητάς τη δράση, τις κρυφές παραλίες, τα θαλάσσια σπορ και το άγριο φυσικό τοπίο. Η λέξη 'ανιαρός' δεν υπάρχει στο λεξιλόγιό σου.", dests: ["Νάξος", "Κάρπαθος", "Σαμοθράκη"] },
  relax: { type: "The Slow-Traveler", emoji: "🌊", desc: "Για σένα διακοπές σημαίνει απόλυτη χαλάρωση, καλό φαγητό, ατελείωτες ώρες στην αμμουδιά και αυθεντική νησιώτικη ζωή.", dests: ["Ικαρία", "Αμοργός", "Σίφνος"] }
};

function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState({ luxury: 0, adventure: 0, relax: 0 });
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleAnswer = (idx) => {
    if (animating) return;
    setAnimating(true);
    const next = { ...score };
    if (idx === 0) next.luxury++;
    else if (idx === 1) next.adventure++;
    else next.relax++;
    setScore(next);

    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setCurrent(c => c + 1);
        setAnimating(false);
      } else {
        const top = Object.entries(next).sort((a, b) => b[1] - a[1])[0][0];
        setResult(RESULTS_MAP[top]);
      }
    }, 280);
  };

  if (result) return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px" }}>
      <div className="card page-enter" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: "4rem", marginBottom: 16 }}>{result.emoji}</div>
        <span className="tag" style={{ marginBottom: 12 }}>YOUR TRAVEL DNA TYPE</span>
        <h2 className="font-display" style={{ fontSize: "2.4rem", color: "var(--ocean)", marginBottom: 16 }}>
          {result.type}
        </h2>
        <p style={{ color: "var(--gray)", lineHeight: 1.6, marginBottom: 28 }}>
          {result.desc}
        </p>
        <div style={{ background: "var(--sky)", padding: "16px 20px", borderRadius: 12, textAlign: "left" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ocean)", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>
            Recommended Destinations:
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {result.dests.map(d => (
              <span key={d} className="tag" style={{ background: "white", border: "1px solid var(--foam)", fontSize: "0.85rem", padding: "6px 14px" }}>
                🏝️ {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const q = QUESTIONS[current];

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span className="tag">🧬 Quiz · Question {current + 1} of {QUESTIONS.length}</span>
        <span style={{ fontSize: "0.85rem", color: "var(--gray)" }}>
          {Math.round(((current) / QUESTIONS.length) * 100)}% Complete
        </span>
      </div>
      <div style={{ width: "100%", height: 4, background: "var(--sand2)", borderRadius: 2, marginBottom: 32, overflow: "hidden" }}>
        <div style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%`, height: "100%", background: "var(--ocean)", transition: "width 0.3s ease" }} />
      </div>

      <div className={animating ? "page-exit" : "page-enter"}>
        <h2 className="font-display" style={{ fontSize: "1.8rem", color: "var(--ocean)", marginBottom: 28, lineHeight: 1.3 }}>
          {q.q}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {q.opts.map((opt, i) => (
            <button
              key={i}
              className="card"
              style={{ display: "flex", alignItems: "center", gap: 16, textLeft: "left", cursor: "pointer", width: "100%", padding: "20px 24px", transition: "transform 0.2s" }}
              onClick={() => handleAnswer(i)}
            >
              <span style={{ fontSize: "1.8rem" }}>{opt.icon}</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--ink)", textAlign: "left" }}>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP COMPONENT ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("hero");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [plannerParams, setPlannerParams] = useState(null);

  const navigate = (target) => {
    setScreen(target);
  };

  const handleGenerate = async ({ departure, budget, days }) => {
    setPlannerParams({ departure, budget, days });
    setIsLoading(true);
    setError(null);
    setScreen("loading");

    try {
      const data = await generateTripAI(departure, budget, days);
      setTripData(data);
      setScreen("results");
    } catch (err) {
      setError("Υπήρξε πρόβλημα με το AI. Δοκίμασε ξανά.");
      setScreen("planner");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <Nav current={screen} onNavigate={navigate} />
      <div className="page-wrapper">
        <PageTransition pageKey={screen}>
          {screen === "hero" && <Hero onNavigate={navigate} />}
          {screen === "planner" && (
            <>
              {error && (
                <div style={{ maxWidth: 560, margin: "20px auto 0", padding: "0 24px" }}>
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: "0.875rem" }}>
                    ⚠️ {error}
                  </div>
                </div>
              )}
              <Planner onGenerate={handleGenerate} isLoading={isLoading} />
            </>
          )}
          {screen === "loading" && <LoadingScreen departure={plannerParams?.departure} />}
          {screen === "results" && tripData && <Results tripData={tripData} plannerParams={plannerParams} />}
          {screen === "quiz" && <Quiz />}
        </PageTransition>
      </div>
    </>
  );
}

// ─── DOM RENDER STEP ────────────────────────────────────────────────
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}