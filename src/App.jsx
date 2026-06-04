import { useState, useEffect, useRef, useCallback } from "react";

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
    background: var(--ocean); border-radius: 50;
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

// ─── MOCK DATA ──────────────────────────────────────────────────────

const MOCK_DESTINATIONS = [
  {
    destination: "Σαντορίνη", country: "Ελλάδα",
    tagline: "Καλντέρα, ηλιοβασιλέματα και αιώνια ομορφιά",
    match_score: 94,
    days: [
      { day: 1, title: "Άφιξη & Φήρα", summary: "Εξερεύνησε την πρωτεύουσα του νησιού με τα λευκά σοκάκια",
        activities: [
          { time: "15:00", icon: "✈️", name: "Άφιξη στο Αεροδρόμιο Θήρας", description: "Το ταξί σε 15 λεπτά σε πηγαίνει στο Φήρα. Οι πρώτες ματιές στην καλντέρα είναι συγκλονιστικές.", cost: 15 },
          { time: "17:00", icon: "🚶", name: "Βόλτα στη Φηρά", description: "Χαμένος στα κυκλαδίτικα σοκάκια, μεταξύ μπουτίκ και εκκλησιών. Μην χάσεις την Ορθόδοξη Μητρόπολη.", cost: 0 },
          { time: "20:30", icon: "🍷", name: "Δείπνο στο Ναουσαλιά", description: "Μεζεδοπωλείο με τοπικό κρασί Assyrtiko και φρέσκο ψάρι. Κράτηση απαραίτητη το καλοκαίρι.", cost: 35 },
        ]
      },
      { day: 2, title: "Οία & Ηλιοβασίλεμα", summary: "Το διασημότερο ηλιοβασίλεμα του κόσμου σε περιμένει",
        activities: [
          { time: "09:00", icon: "🥐", name: "Πρωινό με θέα", description: "Καφές και κρουασάν σε ταράτσα με πανοραμική θέα στην καλντέρα. Μαγική αρχή.", cost: 12 },
          { time: "11:00", icon: "🏊", name: "Παραλία Κόκκινης Άμμου", description: "Η ηφαιστειογενής παραλία με την ερυθρή άμμο — μοναδικό τοπίο. Τα νερά είναι δροσερά και κρυστάλλινα.", cost: 0 },
          { time: "19:30", icon: "🌅", name: "Ηλιοβασίλεμα Οίας", description: "Φτάσε νωρίς για καλή θέση. Τα χρώματα του ουρανού αλλάζουν σε πορτοκαλί, ροζ και μοβ. Αξέχαστο.", cost: 0 },
          { time: "21:00", icon: "🐙", name: "Χταπόδι στου Σκαλά", description: "Παραδοσιακή ταβέρνα στο λιμάνι της Οίας. Φρεσκότατα θαλασσινά, τιμές λογικές για Σαντορίνη.", cost: 28 },
        ]
      },
      { day: 3, title: "Ακρωτήρι & Αναχώρηση", summary: "Προϊστορικά ερείπια και τελευταίες αναμνήσεις",
        activities: [
          { time: "09:30", icon: "🏛️", name: "Αρχαιολογικός Χώρος Ακρωτηρίου", description: "Η 'Πομπηία του Αιγαίου'. Πόλη θαμμένη από ηφαίστειο πριν 3.600 χρόνια, εξαιρετικά διατηρημένη.", cost: 12 },
          { time: "12:00", icon: "🏖️", name: "Παραλία Περίσσα", description: "Μαύρη ηφαιστειογενής άμμος, καλοκαλοστρωμένη παραλία με beach bars και ηλιοκρέβατα.", cost: 8 },
          { time: "15:30", icon: "🛍️", name: "Ψώνια στη Φήρα", description: "Τοπικά προϊόντα — κρασί Vinsanto, τοματάκια Σαντορίνης, κάππαρη. Αυθεντικά δώρα για το σπίτι.", cost: 30 },
        ]
      }
    ]
  },
  {
    destination: "Θεσσαλονίκη", country: "Ελλάδα",
    tagline: "Βυζαντινή ψυχή, νυχτερινή ζωή, γεύσεις που μένουν",
    match_score: 91,
    days: [
      { day: 1, title: "Ιστορικό Κέντρο & Βυζαντινά", summary: "Χιλιάδες χρόνια ιστορίας σε μία βόλτα",
        activities: [
          { time: "10:00", icon: "🏛️", name: "Αγία Σοφία & Ροτόντα", description: "Βυζαντινοί ναοί του 4ου αιώνα, λιγότερο γνωστοί από την Κωνσταντινούπολη αλλά εξίσου εντυπωσιακοί.", cost: 8 },
          { time: "12:30", icon: "🥙", name: "Αγορά Μοδιάνο", description: "Η πιο ζωντανή αγορά της πόλης. Δοκίμασε μπουγάτσα, σουβλάκι Θεσσαλονίκης και φρέσκα μπαχαρικά.", cost: 10 },
          { time: "15:00", icon: "⚓", name: "Παραλιακή Νίκης", description: "Η εμβληματική βόλτα της πόλης. Ο Λευκός Πύργος, η Μπάρα, ο Αριστοτέλους. Ζωή παντού.", cost: 0 },
          { time: "21:00", icon: "🍻", name: "Νυχτερινή ζωή Λαδάδικα", description: "Το ιστορικό τέταρτο με μπαράκια και μεζεδοπωλεία. Τσίπουρο με μεζέ — η αυθεντική Θεσσαλονίκη.", cost: 20 },
        ]
      },
      { day: 2, title: "Άνω Πόλη & Γαστρονομία", summary: "Μεσαιωνικά τείχη και οι καλύτερες γεύσεις της Ελλάδας",
        activities: [
          { time: "09:00", icon: "☕", name: "Καφές στο Εξάγωνο", description: "Το πιο trendy coffee shop της πόλης. Espresso tonic με θέα στον Θερμαϊκό — αξέχαστο πρωινό.", cost: 6 },
          { time: "10:30", icon: "🏰", name: "Βυζαντινά Τείχη & Επταπύργιο", description: "Η μεσαιωνική Θεσσαλονίκη ανακαλύπτεται εδώ. Κάστρο, πανοραμική θέα, γαλήνη μέσα στη πόλη.", cost: 5 },
          { time: "13:30", icon: "🥧", name: "Μπουγάτσα Χατζής", description: "Η πιο διάσημη μπουγάτσα της Ελλάδας, στην Καμάρα από το 1908. Κρέμα ή τυρί; Πάρε και τις δύο.", cost: 4 },
          { time: "20:00", icon: "🍽️", name: "Δείπνο στο Κριτικόν", description: "Παραδοσιακή κρητική κουζίνα στη Θεσσαλονίκη. Ντακός, αντίκρυστο αρνί, κρητικά τυριά.", cost: 30 },
        ]
      }
    ]
  },
  {
    destination: "Αθήνα", country: "Ελλάδα",
    tagline: "Αρχαία φιλοσοφία, street food και ροφτοπ μπαράκια",
    match_score: 89,
    days: [
      { day: 1, title: "Ακρόπολη & Πλάκα", summary: "Το σύμβολο του δυτικού πολιτισμού από κοντά",
        activities: [
          { time: "08:30", icon: "🏛️", name: "Ακρόπολη — Πρωί", description: "Φτάσε πριν τα tour groups. Ο Παρθενώνας στο πρωινό φως είναι μαγικός. Άδεια ποδιών αξίζει εδώ.", cost: 20 },
          { time: "11:00", icon: "🏺", name: "Μουσείο Ακρόπολης", description: "Κρατά 2 ώρες εύκολα. Τα γλυπτά του Παρθενώνα, η Πεπλοφόρος, τα αρχαϊκά κούροι. Εντυπωσιακό.", cost: 10 },
          { time: "14:00", icon: "🥙", name: "Σουβλάκι Πλάκας", description: "Το παλιό Σουβλατζίδικο απέναντι από τη Μητρόπολη — πιτόγυρος 2€, τα καλύτερα της πόλης.", cost: 6 },
          { time: "19:00", icon: "🌇", name: "Ηλιοβασίλεμα Φιλοπάππου", description: "Ο λόφος Φιλοπάππου δίνει εντυπωσιακή θέα Ακρόπολης στο ηλιοβασίλεμα. Φέρε κρασί.", cost: 0 },
        ]
      },
      { day: 2, title: "Μοναστηράκι & Εξάρχεια", summary: "Street food, vintage και η εναλλακτική πλευρά της Αθήνας",
        activities: [
          { time: "10:00", icon: "☕", name: "Freddo στο Μοναστηράκι", description: "Freddo espresso — η αθηναϊκή εφεύρεση που κατέκτησε τον κόσμο. Πιε το στην πλατεία, παρέα με τα περιστέρια.", cost: 3 },
          { time: "11:00", icon: "🛒", name: "Παζάρι Αβυσσηνίας", description: "Vintage ρολόγια, παλιά βινύλια, αντίκες. Κάθε Σαββατοκύριακο — ο παράδεισος του vintage shopper.", cost: 0 },
          { time: "14:30", icon: "🍔", name: "Street food Αθήνας", description: "Κουλούρι Θεσσαλονίκης, τυρόπιτα σπανακόπιτα από φούρνο Κεκρωπίδης, και γλυκό από το Κελλάρι.", cost: 8 },
          { time: "21:00", icon: "🍹", name: "Rooftop The Clumsies", description: "Από τα 50 καλύτερα μπαρ του κόσμου. Cocktails με ελληνικά υλικά, θέα Ακρόπολης. Κράτηση must.", cost: 22 },
        ]
      },
      { day: 3, title: "Πειραιάς & Παράκτια", summary: "Φρέσκο ψάρι, θάλασσα και μικρά νησιά",
        activities: [
          { time: "09:00", icon: "🐟", name: "Ψαραγορά Πειραιά", description: "Η μεγαλύτερη ψαραγορά της Ελλάδας. Οι ψαράδες ξεφορτώνουν από τα χαράματα — φρεσκάδα εγγυημένη.", cost: 0 },
          { time: "11:30", icon: "⛵", name: "Φέρι για Αίγινα", description: "40 λεπτά ταξίδι, νησί Σαρωνικού. Ναός Αφαίας, φιστικιές Αίγινας, ησυχία μακριά από τα τουρκικά.", cost: 18 },
          { time: "14:00", icon: "🦞", name: "Ψαροταβέρνα Βαγγέλης", description: "Στο λιμανάκι της Αίγινας, φρέσκος μπακαλιάρος και αστακομακαρονάδα. Τιμές πριν την Αθήνα.", cost: 25 },
        ]
      }
    ]
  },
  {
    destination: "Κέρκυρα", country: "Ελλάδα",
    tagline: "Βενετσιάνικα κάστρα, ελαιώνες και κρυστάλλινα νερά",
    match_score: 88,
    days: [
      { day: 1, title: "Κέρκυρα Πόλη & Παλιό Φρούριο", summary: "UNESCO πόλη με ιταλική ψυχή",
        activities: [
          { time: "10:00", icon: "🏰", name: "Παλαιό Φρούριο", description: "Βενετσιάνικο φρούριο του 16ου αιώνα. Θέα στη θάλασσα, στα κανάλια και στην Αλβανία. Εντυπωσιακό.", cost: 6 },
          { time: "12:00", icon: "🚶", name: "Liston & Πλατεία Σπιανάδα", description: "Η μεγαλύτερη πλατεία Ελλάδας, χτισμένη από τους Γάλλους. Καφές κάτω από τους θόλους.", cost: 4 },
          { time: "20:30", icon: "🍝", name: "Sofrito στο Παλιό Φρούριο", description: "Το τοπικό πιάτο — μοσχάρι με λευκή σάλτσα σκόρδου. Μόνο στην Κέρκυρα το βρίσκεις αυθεντικό.", cost: 22 },
        ]
      },
      { day: 2, title: "Παλαιοκαστρίτσα & Δυτικές Ακτές", summary: "Τα πιο όμορφα νερά της Μεσογείου",
        activities: [
          { time: "09:30", icon: "🏖️", name: "Παλαιοκαστρίτσα", description: "Σμαραγδένιες λιμνοθάλασσες και βραχώδεις σπηλιές. Νοίκιασε βαρκάκι για 10€ και εξερεύνησε.", cost: 10 },
          { time: "13:00", icon: "🐠", name: "Κατάδυση στο Κόκκινο Βράχο", description: "Το καλύτερο σημείο κατάδυσης του νησιού. Χρώματα κοραλλιών και μεσογειακά ψάρια.", cost: 15 },
          { time: "19:30", icon: "🌅", name: "Ηλιοβασίλεμα Άγγελος Στέφανος", description: "Μυστικό σημείο των ντόπιων. Βράχος με θέα στο ηλιοβασίλεμα, μακριά από τους τουρίστες.", cost: 0 },
        ]
      }
    ]
  },
  {
    destination: "Ρόδος", country: "Ελλάδα",
    tagline: "Μεσαιωνικά τείχη, φωταγωγημένες νύχτες, ανατολή ηλίου",
    match_score: 87,
    days: [
      { day: 1, title: "Μεσαιωνική Πόλη", summary: "Η καλύτερα διατηρημένη μεσαιωνική πόλη Ευρώπης",
        activities: [
          { time: "09:00", icon: "🏰", name: "Παλάτι Μεγάλου Μαγίστρου", description: "Κάστρο Ιπποτών του 14ου αιώνα, εκθέτει ψηφιδωτά από την Κω. Εντυπωσιακή αρχιτεκτονική.", cost: 8 },
          { time: "11:30", icon: "🚶", name: "Οδός Ιπποτών", description: "Η πιο καλοδιατηρημένη μεσαιωνική οδός στον κόσμο. Πέτρινα κτίρια Ιπποτικής εποχής.", cost: 0 },
          { time: "20:00", icon: "🍢", name: "Μεζέδες στη Νέα Αγορά", description: "Φρέσκα χταπόδια, σουπιές σχάρας και τοπικό κρασί Κεχρί. Θαλασσινά σε χαλαρή ατμόσφαιρα.", cost: 25 },
        ]
      },
      { day: 2, title: "Λίνδος & Νότιο Νησί", summary: "Ακρόπολη με θέα, χωριό-κόσμημα",
        activities: [
          { time: "08:00", icon: "🏛️", name: "Ακρόπολη Λίνδου — Πρωί", description: "Φτάσε πριν τη ζέστη. Δωρικό ιερό Αθηνάς Λινδίας, κολώνες πάνω από τη θάλασσα. Ανατριχιαστικό.", cost: 12 },
          { time: "11:00", icon: "🏊", name: "Μεγάλη Παραλία Λίνδου", description: "Ημικυκλικός κόλπος με τυρκουάζ νερά, άμμος χρυσή. Από τις 10 καλύτερες παραλίες Ελλάδας.", cost: 0 },
          { time: "19:00", icon: "🌇", name: "Ηλιοβασίλεμα Πρασονήσι", description: "Η νοτιότερη άκρη της Ρόδου, όπου συναντιούνται δύο θάλασσες. Φαινόμενο μοναδικό.", cost: 0 },
        ]
      }
    ]
  }
];

const MOCK_CHAT_REPLIES = {
  "καιρός": [
    "Ο καιρός εδώ είναι εξαιρετικός! ☀️ Καλοκαίρι 28-35°C, σχεδόν μηδέν βροχή. Φέρε αντηλιακό SPF50+ και καπέλο — ο ήλιος είναι δυνατός μεσημέρι.",
    "Την άνοιξη (Απρίλιο-Μάιο) οι θερμοκρασίες είναι τέλειες, 20-25°C, ιδανικό για εξερεύνηση χωρίς κόπωση. 🌤️",
  ],
  "φαγητό": [
    "Μην φύγεις χωρίς να δοκιμάσεις το τοπικό specialty! 🍽️ Ψάξε για ταβέρνες μακριά από τα τουριστικά μέρη — στα σοκάκια βρίσκεις την αυθεντική γεύση.",
    "Για φτηνό και γευστικό φαγητό, κάνε ό,τι κάνουν οι ντόπιοι: αγόρασε φρέσκο ψωμί, ντομάτες και φέτα από την αγορά. Picnic με θέα! 🥗",
  ],
  "παραλίες": [
    "Οι παραλίες εδώ είναι απίστευτες! 🏖️ Αποφύγισε τις οργανωμένες το μεσημέρι — ή φτάσε νωρί ή πήγαινε αργά. Τα νερά είναι κρυστάλλινα.",
    "Νοίκιασε σκούτερ για 15€/μέρα και εξερεύνησε κρυφές παραλίες που τα tour buses δεν φτάνουν. Τα καλύτερα μέρη δεν έχουν πινακίδες! 🛵",
  ],
  "νυχτερινή": [
    "Η νυχτερινή ζωή αρχίζει αργά — οι ντόπιοι βγαίνουν μετά τις 23:00! 🌃 Πρώτα τσίπουρο με μεζέ, μετά μπαράκια, μετά κλαμπ. Ολονύχτια περιπέτεια.",
    "Ψάξε για live μουσική σε μικρά μπαρ — συχνά παίζουν παραδοσιακά ή σύγχρονα ελληνικά. Πολύ πιο αυθεντικό από τα τουριστικά clubs! 🎶",
  ],
  "μεταφορές": [
    "Τα ΚΤΕΛ καλύπτουν όλα τα χωριά με 2-5€. Αλλά η καλύτερη επιλογή είναι σκούτερ (15€/μέρα) ή μίνι αυτοκίνητο (30-45€/μέρα). 🚌",
    "Για ταξί χρησιμοποίησε το Beat app — πιο φτηνό και διαφανές. Τα λιμάνια έχουν σύνδεση φέρι με γειτονικά νησιά για day trip! ⛵",
  ],
  "insider": [
    "Insider tip: αγόρασε εισιτήριο μουσείου online για να αποφύγεις ουρές 1 ώρας. Και πήγαινε στα αξιοθέατα στις 8:30 πρωί — εντελώς άδεια! 🎟️",
    "Οι ντόπιοι τρώνε μεσημεριανό 14:00-16:00 και βραδινό μετά τις 21:00. Αν πας νωρίτερα σε ταβέρνα, θα βρεις τουρίστες — ακολούθησε τους ντόπιους! 🕐",
  ],
  "ξενοδοχείο": [
    "Για budget stay, ψάξε rooms σε guesthouses παλιάς πόλης — 40-60€/βράδυ με αυθεντική ατμόσφαιρα. Booking.com με φίλτρο 'Υπέροχα 9+'. 🏨",
    "Αν έχεις budget, boutique hotel με θέα αξίζει κάθε ευρώ. Η εμπειρία του να ξυπνάς με θέα θάλασσα είναι αξέχαστη! 🌊",
  ],
  "αγορές": [
    "Αγόρασε τοπικά: μέλι, ελαιόλαδο, τοπικό κρασί. Φύγε από τα τουριστικά μαγαζιά — στις λαϊκές αγορές βρίσκεις αυθεντικά προϊόντα στη μισή τιμή. 🛍️",
    "Παζαρεύεις! Ειδικά σε μικρά καταστήματα, ρώτα για έκπτωση. Στα σούπερ μάρκετ οι τοπικές μάρκες είναι πάντα πιο φτηνές από τις διεθνείς. 🛒",
  ],
  "default": [
    "Υπέροχη ερώτηση! 🌊 Αυτός ο προορισμός κρύβει πολλά μυστικά — η καλύτερη συμβουλή είναι να βγεις από τα τουριστικά μέρη και να εξερευνήσεις μόνος σου.",
    "Φρόντισε να μιλήσεις με τους ντόπιους — οι καλύτερες συμβουλές δεν βρίσκονται σε κανένα TripAdvisor! 😊 Πες τους ότι θέλεις να ζήσεις σαν ντόπιος.",
    "Σκέτη απόλαυση! 🏝️ Όλη η ομορφιά αυτού του μέρους είναι ότι κάθε μέρα ανακαλύπτεις κάτι νέο. Ακολούθησε τα σοκάκια χωρίς χάρτη.",
  ]
};

function getMockReply(input, destination) {
  const m = input.toLowerCase();
  let replies;
  if (m.includes("καιρ") || m.includes("weather") || m.includes("🌤")) replies = MOCK_CHAT_REPLIES["καιρός"];
  else if (m.includes("φαγ") || m.includes("food") || m.includes("τρω") || m.includes("🍽")) replies = MOCK_CHAT_REPLIES["φαγητό"];
  else if (m.includes("παραλ") || m.includes("beach") || m.includes("🏖")) replies = MOCK_CHAT_REPLIES["παραλίες"];
  else if (m.includes("νυχτ") || m.includes("night") || m.includes("μπαρ") || m.includes("🌃")) replies = MOCK_CHAT_REPLIES["νυχτερινή"];
  else if (m.includes("μεταφ") || m.includes("transport") || m.includes("λεωφ") || m.includes("🚌")) replies = MOCK_CHAT_REPLIES["μεταφορές"];
  else if (m.includes("insider") || m.includes("tip") || m.includes("💡") || m.includes("συμβουλ")) replies = MOCK_CHAT_REPLIES["insider"];
  else if (m.includes("ξενοδ") || m.includes("hotel") || m.includes("μεν") || m.includes("🏨")) replies = MOCK_CHAT_REPLIES["ξενοδοχείο"];
  else if (m.includes("ψων") || m.includes("αγορ") || m.includes("shop") || m.includes("🛍")) replies = MOCK_CHAT_REPLIES["αγορές"];
  else replies = MOCK_CHAT_REPLIES["default"];
  return replies[Math.floor(Math.random() * replies.length)];
}

function generateTripMock(departure, budget, days) {
  const pool = [...MOCK_DESTINATIONS];
  pool.sort(() => Math.random() - 0.5);
  const base = pool[0];
  const sliced = base.days.slice(0, Math.min(days, base.days.length));
  const score = 82 + Math.floor(Math.random() * 14);
  const used  = Math.round(budget * (0.72 + Math.random() * 0.18));
  return { ...base, match_score: score, budget_used: used, days: sliced };
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

// ─── PLANNER (Αλλαγμένο: Αφαιρέθηκαν τα κουμπιά Duration) ──────────────
function Planner({ onGenerate, isLoading }) {
  const [departure, setDeparture] = useState("Athens");
  const [budget, setBudget] = useState(800);
  const [customDep, setCustomDep] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const cities = ["Athens", "Thessaloniki", "Heraklion", "Rhodes", "Patras", "Rome", "Barcelona", "Istanbul", "Bucharest"];
  const finalDep = useCustom ? customDep : departure;
  const days = 3; // Σταθερή τιμή

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
        </div>

        {/* Summary */}
        <div style={{ background: "var(--sky)", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--gray)" }}>Your trip</div>
            <div style={{ fontWeight: 600, color: "var(--ocean)" }}>{finalDep || "—"} → Anywhere ✨</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--gray)" }}>Budget / Duration</div>
            <div style={{ fontWeight: 600, color: "var(--ocean)" }}>€{budget} · 3 days</div>
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = getMockReply(input, tripData.destination);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  const pct = `${(tripData.match_score || 88)}%`;
  const budgetPct = Math.round(((tripData.budget_used || plannerParams?.budget * 0.85) / plannerParams?.budget) * 100);

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
            <div key={day.day} className={`card day-card stagger-${Math.min(di + 2, 5)}`}>
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
          <div className="card stagger-2" style={{ padding: 0, overflow: "hidden", height: 560, display: "flex", flexDirection: "column" }}>
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
        <span className="tag" style={{ marginBottom: 16 }}>🧬 Το Travel DNA σου</span>
        <h2 className="font-display" style={{ fontSize: "2rem", color: "var(--ocean)", margin: "16px 0 12px" }}>
          {result.type}
        </h2>
        <p style={{ color: "var(--gray)", lineHeight: 1.7, marginBottom: 28 }}>{result.desc}</p>
        <div style={{ background: "var(--sky)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ fontSize: "0.8rem", color: "var(--gray)", fontWeight: 500, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            🏝️ Νησιά για Εσένα
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {result.dests.map(d => <span key={d} className="tag" style={{ fontSize: "0.9rem", padding: "8px 16px" }}>{d}</span>)}
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => { setResult(null); setCurrent(0); setScore({ luxury: 0, adventure: 0, relax: 0 }); }}>
          Ξεκίνα Ξανά 🔄
        </button>
      </div>
    </div>
  );

  const q = QUESTIONS[current];
  const progress = ((current) / QUESTIONS.length) * 100;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 24px" }}>
      <div className="card" style={{ padding: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span className="tag">🧬 Travel DNA Quiz</span>
          <span style={{ fontSize: "0.8rem", color: "var(--gray)" }}>{current + 1} / {QUESTIONS.length}</span>
        </div>
        <div style={{ height: 5, background: "var(--sand2)", borderRadius: 3, margin: "14px 0 28px", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "var(--ocean)", borderRadius: 3, width: `${progress}%`, transition: "width 0.4s ease" }} />
        </div>
        <h2 className={`font-display ${animating ? "page-exit" : "page-enter"}`} style={{ fontSize: "1.6rem", color: "var(--ocean)", marginBottom: 28, lineHeight: 1.3 }}>
          {q.q}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {q.opts.map((opt, i) => (
            <button
              key={i}
              className="btn btn-secondary"
              style={{ justifyContent: "flex-start", textAlign: "left", width: "100%", padding: "16px 20px", borderRadius: 12, gap: 14, background: "white", border: "1.5px solid var(--sand2)" }}
              onClick={() => handleAnswer(i)}
            >
              <span style={{ fontSize: "1.4rem" }}>{opt.icon}</span>
              <span style={{ fontSize: "0.93rem", lineHeight: 1.4 }}>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LOADING SCREEN ──────────────────────────────────────────────────
function LoadingScreen({ departure, destination }) {
  const steps = ["Αναλύω τον προορισμό...", "Βρίσκω κρυφούς θησαυρούς...", "Υπολογίζω διαδρομές...", "Δημιουργώ το πρόγραμμά σου..."];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 24 }}>🌊</div>
        <div className="spinner" style={{ marginBottom: 24 }} />
        <h3 className="font-display" style={{ color: "var(--ocean)", fontSize: "1.5rem", marginBottom: 8 }}>
          Aegeo AI σε δουλειά
        </h3>
        <p style={{ color: "var(--gray)", fontSize: "0.9rem", transition: "opacity 0.3s" }}>{steps[step]}</p>
        <p style={{ color: "var(--terra)", fontSize: "0.8rem", marginTop: 8 }}>
          {departure} → 🗺️ Perfect destination
        </p>
      </div>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("hero");
  const [prevScreen, setPrevScreen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [plannerParams, setPlannerParams] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useCallback((to) => {
    setPrevScreen(screen);
    setScreen(to);
  }, [screen]);

  const handleGenerate = ({ departure, budget, days }) => {
    setPlannerParams({ departure, budget, days });
    setIsLoading(true);
    setError(null);
    setScreen("loading");
    setTimeout(() => {
      const data = generateTripMock(departure, budget, days);
      setTripData(data);
      setScreen("results");
      setIsLoading(false);
    }, 2200);
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
              {error && <div style={{ maxWidth: 560, margin: "20px auto 0", padding: "0 24px" }}>
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: "0.875rem" }}>
                  ⚠️ {error}
                </div>
              </div>}
              <Planner onGenerate={handleGenerate} isLoading={isLoading} />
            </>
          )}
          {screen === "loading" && <LoadingScreen departure={plannerParams?.departure} />}
          {screen === "quiz" && <Quiz />}
          {screen === "results" && tripData && <Results tripData={tripData} plannerParams={plannerParams} />}
        </PageTransition>
      </div>
    </>
  );
}
