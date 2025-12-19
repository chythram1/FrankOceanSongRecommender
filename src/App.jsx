import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Album covers from Wikipedia (reliable)
const BLONDE_COVER = "https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg";
const CHANNEL_ORANGE_COVER = "https://upload.wikimedia.org/wikipedia/en/2/28/Channel_ORANGE.jpg";
const NOSTALGIA_COVER = "https://upload.wikimedia.org/wikipedia/en/e/e7/Nostalgia_ultra_cover.jpg";

const FRANK_LIBRARY = [
  { title: "Nikes", id: "3wb2wm3GAZf8hLIFm5s0mZ", album: "Blonde", valence: 0.20, cover: BLONDE_COVER },
  { title: "Ivy", id: "2ZWlPOoWh0626oTaHrnl2a", album: "Blonde", valence: 0.35, cover: BLONDE_COVER },
  { title: "Pink + White", id: "3xKsf9qdS1CyvXSMEid6g8", album: "Blonde", valence: 0.65, cover: BLONDE_COVER },
  { title: "Solo", id: "19YKaevk2mNQpuyuHJmYpk", album: "Blonde", valence: 0.28, cover: BLONDE_COVER },
  { title: "Self Control", id: "2LMkwUfqC6S6s6qDVlEuzV", album: "Blonde", valence: 0.10, cover: BLONDE_COVER },
  { title: "Nights", id: "7eqoqGkKe8EK7BDw8Kpv6P", album: "Blonde", valence: 0.45, cover: BLONDE_COVER },
  { title: "White Ferrari", id: "2LMkwUfqC6S6s6qDVlEuzV", album: "Blonde", valence: 0.18, cover: BLONDE_COVER },
  { title: "Seigfried", id: "6Nle9hKrkL1wQpwNfEkxjh", album: "Blonde", valence: 0.15, cover: BLONDE_COVER },
  { title: "Godspeed", id: "7DFLUkBRMlKHvY2FvnLmS2", album: "Blonde", valence: 0.32, cover: BLONDE_COVER },
  { title: "Thinkin Bout You", id: "7DfFc7a6Rwfi3YQMRbDMau", album: "Channel Orange", valence: 0.48, cover: CHANNEL_ORANGE_COVER },
  { title: "Sweet Life", id: "0Iv9E0h2ObYSoTJEhzVl30", album: "Channel Orange", valence: 0.72, cover: CHANNEL_ORANGE_COVER },
  { title: "Super Rich Kids", id: "6IHxDGwmOIcpuQO60FY3DA", album: "Channel Orange", valence: 0.65, cover: CHANNEL_ORANGE_COVER },
  { title: "Pyramids", id: "4ANwUJCHeOlJBEGSsHmF4U", album: "Channel Orange", valence: 0.58, cover: CHANNEL_ORANGE_COVER },
  { title: "Bad Religion", id: "3sFHHFk9reUMgBaFJVaaXU", album: "Channel Orange", valence: 0.10, cover: CHANNEL_ORANGE_COVER },
  { title: "Forrest Gump", id: "5BMvN8dq9VLU2HUgRwGJxB", album: "Channel Orange", valence: 0.75, cover: CHANNEL_ORANGE_COVER },
  { title: "Lost", id: "5gcCHnCWQqFiPjMjUlFQaw", album: "Channel Orange", valence: 0.68, cover: CHANNEL_ORANGE_COVER },
  { title: "Novacane", id: "2qm3EQFmuLbz8IkXN8mI4p", album: "Nostalgia, Ultra", valence: 0.62, cover: NOSTALGIA_COVER },
  { title: "Swim Good", id: "3aOq5jZFLiGhnKLrPTyLqv", album: "Nostalgia, Ultra", valence: 0.67, cover: NOSTALGIA_COVER },
];

// API URL - change this to your deployed backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Fallback client-side sentiment analysis (used when backend is unavailable)
const analyzeSentimentLocal = (text) => {
  const positiveWords = ['happy', 'joy', 'love', 'great', 'good', 'amazing', 'wonderful', 'excited', 'peaceful', 'calm', 'blessed', 'grateful', 'hopeful', 'content', 'bliss', 'alive', 'free', 'beautiful', 'warm'];
  const negativeWords = ['sad', 'depressed', 'lonely', 'heartbroken', 'anxious', 'stressed', 'angry', 'hurt', 'pain', 'lost', 'empty', 'numb', 'broken', 'tired', 'hopeless', 'miserable', 'melancholy', 'crying'];
  const neutralWords = ['nostalgic', 'reflective', 'contemplative', 'thinking', 'floating', 'dreamy', 'chill', 'vibing', 'mellow'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0, count = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) { score += 1; count++; }
    if (negativeWords.some(nw => word.includes(nw))) { score -= 1; count++; }
    if (neutralWords.some(nw => word.includes(nw))) { count++; }
  });
  
  return ((count > 0 ? score / count : 0) + 1) / 2;
};

// Local fallback song finder
const findSongLocal = (text) => {
  const targetValence = analyzeSentimentLocal(text);
  return {
    song: FRANK_LIBRARY.reduce((prev, curr) => 
      Math.abs(curr.valence - targetValence) < Math.abs(prev.valence - targetValence) ? curr : prev
    ),
    moodScore: targetValence
  };
};

// API-based song finder using TextBlob ML
const findSongAPI = async (text) => {
  try {
    const response = await fetch(`${API_URL}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feeling: text })
    });
    
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    return {
      song: {
        title: data.title,
        album: data.album,
        id: data.spotify_id,
        cover: data.cover,
        valence: data.song_valence
      },
      moodScore: data.mood_score,
      sentiment: data.sentiment // Contains polarity and subjectivity from TextBlob
    };
  } catch (error) {
    console.warn('API unavailable, using local fallback:', error.message);
    return findSongLocal(text);
  }
};

const getAuraColors = (moodScore) => {
  if (moodScore < 0.25) return ['#1a1a2e', '#533483'];
  if (moodScore < 0.5) return ['#801336', '#ee4540'];
  if (moodScore < 0.75) return ['#f08a5d', '#6a2c70'];
  return ['#a8e6cf', '#ffaaa5'];
};

// Simplified aura - only 2 layers for performance
const SimpleAura = React.memo(({ colors }) => (
  <div className="simple-aura">
    <div className="aura-layer-1" style={{ background: `radial-gradient(ellipse at center, ${colors[0]}40 0%, transparent 70%)` }} />
    <div className="aura-layer-2" style={{ background: `radial-gradient(ellipse at center, ${colors[1]}30 0%, transparent 60%)` }} />
  </div>
));

// Landing aura with color transition (no complex morphing)
const LandingAura = React.memo(() => {
  const [colorIdx, setColorIdx] = useState(0);
  const colorSets = [
    ['#667eea', '#f093fb'],
    ['#4facfe', '#43e97b'],
    ['#fa709a', '#fee140'],
    ['#a18cd1', '#fbc2eb'],
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIdx(p => (p + 1) % colorSets.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-aura">
      {colorSets.map((colors, i) => (
        <div key={i} className="landing-aura-layer" style={{ opacity: i === colorIdx ? 0.5 : 0 }}>
          <SimpleAura colors={colors} />
        </div>
      ))}
    </div>
  );
});

const GeneratingAnimation = React.memo(() => (
  <div className="gen-container">
    <div className="gen-orb">
      <div className="orb-core" />
      <div className="orb-ring" />
    </div>
    <p className="gen-text">generating your song<span className="dots">...</span></p>
  </div>
));

const SongResult = React.memo(({ song, moodScore, onReset }) => {
  const [revealed, setRevealed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const auraColors = useMemo(() => getAuraColors(moodScore), [moodScore]);
  
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`result ${revealed ? 'show' : ''}`}>
      <div className="album-wrap">
        <SimpleAura colors={auraColors} />
        <div className="album-art">
          <img 
            src={song.cover} 
            alt={song.album} 
            onLoad={() => setImgLoaded(true)}
            style={{ opacity: imgLoaded ? 1 : 0 }}
          />
          {!imgLoaded && (
            <div className="album-fallback">
              <span>♪</span>
            </div>
          )}
          <div className="album-shine" />
        </div>
      </div>
      
      <div className="song-info">
        <h2>{song.title}</h2>
        <p className="album-name">{song.album}</p>
        <div className="mood-bar-wrap">
          <span>mood energy</span>
          <div className="mood-bar">
            <div 
              className="mood-fill" 
              style={{ 
                width: `${moodScore * 100}%`,
                background: `linear-gradient(90deg, ${auraColors[0]}, ${auraColors[1]})`
              }} 
            />
          </div>
        </div>
      </div>
      
      <a 
        href={`https://open.spotify.com/track/${song.id}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="spotify-btn"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        Play on Spotify
      </a>
      
      <button onClick={onReset} className="reset-btn">try again</button>
    </div>
  );
});

export default function App() {
  const [emotion, setEmotion] = useState('');
  const [stage, setStage] = useState('input');
  const [result, setResult] = useState(null);
  const [imgReady, setImgReady] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!emotion.trim()) return;
    setStage('generating');
    
    // Use the ML API (falls back to local if unavailable)
    const { song, moodScore } = await findSongAPI(emotion);
    setResult({ song, moodScore });
    setStage('result');
  }, [emotion]);

  const handleReset = useCallback(() => {
    setEmotion('');
    setResult(null);
    setStage('input');
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  const auraColors = useMemo(() => {
    if (result) return getAuraColors(result.moodScore);
    return ['#667eea', '#f093fb'];
  }, [result]);

  return (
    <div className="app">
      {/* Background - static blur, no transition */}
      <div 
        className="bg-img" 
        style={{ opacity: imgReady ? 1 : 0 }}
      />
      <img 
        src="/frank-ocean.png" 
        alt="" 
        style={{ display: 'none' }} 
        onLoad={() => setImgReady(true)} 
      />
      
      <div className="bg-fallback" />
      <div className="bg-overlay" />
      
      {/* Aura - simplified */}
      <div className="aura-container">
        {stage === 'input' && <LandingAura />}
        {stage === 'generating' && <SimpleAura colors={['#667eea', '#f093fb']} />}
        {stage === 'result' && <SimpleAura colors={auraColors} />}
      </div>
      
      {/* Content */}
      <div className="content">
        <header className={stage !== 'input' ? 'faded' : ''}>
          <p className="subtitle">FRANK OCEAN</p>
          <div className="header-line" />
          <h1>Song Recommender</h1>
        </header>
        
        <main>
          {stage === 'input' && (
            <div className="input-section">
              <label>How are you feeling right now?</label>
              <input
                type="text"
                value={emotion}
                onChange={e => setEmotion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="nostalgic, heartbroken, at peace..."
                autoComplete="off"
              />
              <button 
                onClick={handleSubmit} 
                className={emotion.trim() ? 'active' : ''}
                disabled={!emotion.trim()}
              >
                Find My Frank Ocean Song
              </button>
            </div>
          )}
          
          {stage === 'generating' && <GeneratingAnimation />}
          
          {stage === 'result' && result && (
            <SongResult 
              song={result.song} 
              moodScore={result.moodScore} 
              onReset={handleReset} 
            />
          )}
        </main>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .app {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', -apple-system, sans-serif;
        }
        
        .bg-img {
          position: absolute;
          inset: -20px;
          background-image: url('/frank-ocean.png');
          background-size: cover;
          background-position: center 20%;
          filter: blur(12px) brightness(0.45);
          transition: opacity 0.5s ease;
          z-index: 0;
          will-change: opacity;
        }
        
        .bg-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          z-index: -1;
        }
        
        .bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10,10,18,0.5) 0%, rgba(10,10,18,0.7) 50%, rgba(10,10,18,0.85) 100%);
          z-index: 1;
          pointer-events: none;
        }
        
        .aura-container {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }
        
        .simple-aura {
          position: absolute;
          inset: -30%;
          will-change: transform;
        }
        
        .aura-layer-1, .aura-layer-2 {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          will-change: transform;
        }
        
        .aura-layer-1 {
          animation: slowRotate 20s linear infinite;
        }
        
        .aura-layer-2 {
          animation: slowRotate 25s linear infinite reverse;
          transform: scale(1.2);
        }
        
        .landing-aura {
          position: absolute;
          inset: 0;
        }
        
        .landing-aura-layer {
          position: absolute;
          inset: 0;
          transition: opacity 2s ease;
        }
        
        .content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 460px;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        header {
          text-align: center;
          margin-bottom: 50px;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        header.faded { opacity: 0.3; transform: translateY(-10px); }
        
        .subtitle {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 5px;
          margin-bottom: 14px;
        }
        
        .header-line {
          width: 36px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          margin: 0 auto 14px;
        }
        
        header h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 26px;
          font-weight: 300;
          color: rgba(255,255,255,0.9);
          letter-spacing: 2px;
        }
        
        main {
          width: 100%;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .input-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
          animation: fadeIn 0.6s ease;
        }
        
        .input-section label {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 21px;
          font-weight: 300;
          color: rgba(255,255,255,0.9);
        }
        
        .input-section input {
          width: 100%;
          padding: 16px 22px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: white;
          font-family: inherit;
          font-size: 15px;
          text-align: center;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .input-section input::placeholder { color: rgba(255,255,255,0.3); }
        .input-section input:focus {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
        }
        
        .input-section button {
          padding: 13px 36px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50px;
          color: rgba(255,255,255,0.3);
          font-family: inherit;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: default;
          transition: all 0.2s ease;
        }
        .input-section button.active {
          color: white;
          background: rgba(255,255,255,0.08);
          cursor: pointer;
        }
        .input-section button.active:hover {
          background: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        
        /* Generating */
        .gen-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        
        .gen-orb {
          position: relative;
          width: 100px;
          height: 100px;
        }
        
        .orb-core {
          position: absolute;
          inset: 20px;
          background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
          border-radius: 50%;
          animation: orbPulse 2s ease-in-out infinite;
        }
        
        .orb-ring {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          animation: ringRotate 3s linear infinite;
        }
        
        .gen-text {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 18px;
          color: rgba(255,255,255,0.8);
          letter-spacing: 3px;
        }
        
        .dots {
          animation: dotPulse 1.5s ease-in-out infinite;
          display: inline-block;
        }
        
        /* Result */
        .result {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .result.show { opacity: 1; transform: translateY(0); }
        
        .album-wrap {
          position: relative;
          width: 240px;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .album-art {
          position: relative;
          width: 170px;
          height: 170px;
          z-index: 10;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        
        .album-art img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }
        
        .album-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .album-fallback span {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px;
          color: rgba(255,255,255,0.3);
        }
        
        .album-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .song-info { text-align: center; }
        
        .song-info h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 30px;
          font-weight: 400;
          color: white;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        
        .album-name {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        
        .mood-bar-wrap {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        
        .mood-bar-wrap span {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        
        .mood-bar {
          width: 100px;
          height: 3px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .mood-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s ease;
        }
        
        .spotify-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 50px;
          color: white;
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 1px;
          transition: all 0.2s ease;
        }
        
        .spotify-btn:hover {
          background: #1DB954;
          border-color: #1DB954;
          transform: translateY(-2px);
        }
        
        .reset-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          font-family: inherit;
          font-size: 11px;
          letter-spacing: 2px;
          cursor: pointer;
          padding: 6px 14px;
          transition: color 0.2s ease;
        }
        
        .reset-btn:hover { color: rgba(255,255,255,0.6); }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes dotPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
