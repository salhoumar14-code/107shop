import React, { useEffect, useState } from 'react';

const RamadanSplash = ({ onEnter }) => {
  const [stars, setStars] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const generatedStars = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${3 + Math.random() * 5}s`
    }));
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    const audio = new Audio('/audio/ramadan.mp3');
    audio.currentTime = 10;

    let isPlaying = false;
    const playAudio = () => {
      if (!isPlaying) {
        audio.play()
          .then(() => { isPlaying = true; })
          .catch(err => {
            console.log("Autoplay blocked, waiting for interaction:", err);
          });
      }
    };

    playAudio();

    // Listen for any click to start audio if blocked
    const handleGlobalClick = () => {
      if (!isPlaying) {
        playAudio();
      }
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleEnter();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(onEnter, 1000);
  };

  return (
    <div className={`ramadan-splash ${fadeOut ? 'fade-out' : ''}`}>
      {/* Background Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            '--duration': star.duration
          }}
        />
      ))}

      {/* Main Logo Reconstruction */}
      <div className="splash-content text-white z-10 flex flex-col items-center justify-center">

        {/* Rimy Animated Logo Section */}
        <div className="logo-section flex items-baseline mb-12">
          {/* R */}
          <span className="logo-letter rimy-r">R</span>

          {/* i with Moon and Star */}
          <div className="relative-i-container">
            {/* Star above i */}
            <div className="absolute-star">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#goldGrad)" />
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbf5b7" />
                    <stop offset="50%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#8a6d3b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* i */}
            <span className="logo-letter">i</span>

            {/* Crescent Moon around/under i */}
            <div className="crescent-container">
              <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 30 C 20 50, 80 50, 80 30 C 80 40, 40 40, 20 30" fill="url(#goldGrad)" />
              </svg>
            </div>
          </div>

          {/* m */}
          <span className="logo-letter">m</span>

          {/* y */}
          <span className="logo-letter italic-y">y</span>
        </div>

        {/* Greetings in Arabic and French */}
        <div className="greetings text-center max-w-4xl px-4">
          <h2 className="arabic-text gold-gradient">
            رمضان مبارك مع ريمي
          </h2>

          <h1 className="french-text uppercase">
            Ramadan Moubarak avec Rimy
          </h1>

          <div className="divider mx-auto mt-8"></div>
        </div>
      </div>

      <div className="decorative-line top-line"></div>
      <div className="decorative-footer bottom-8 uppercase font-light">
        Savoir-faire • Élégance • Tradition
      </div>

      <style jsx="true">{`
        .ramadan-splash {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #050b1a;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: opacity 1s ease;
          overflow: hidden;
        }
        .ramadan-splash.fade-out { opacity: 0; pointer-events: none; }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0.3;
          animation: twinkle var(--duration) infinite ease-in-out;
        }
        @keyframes twinkle {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0.7; }
        }

        .splash-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: splashIn 1s ease-out;
        }
        @keyframes splashIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        .logo-section { display: flex; align-items: baseline; margin-bottom: 3rem; }
        .logo-letter {
          font-size: clamp(6rem, 20vw, 12rem);
          font-weight: 800;
          line-height: none;
          color: white;
          text-shadow: 0 0 30px rgba(255,255,255,0.2);
        }
        .italic-y { font-style: italic; margin-left: -5px; }
        
        .relative-i-container { position: relative; display: flex; flex-direction: column; align-items: center; }
        .absolute-star { position: absolute; top: -15%; animation: pulse 2s infinite ease-in-out; }
        .crescent-container { position: absolute; top: 60%; left: -40%; width: 180%; animation: float 3s infinite ease-in-out; pointer-events: none; }

        @keyframes pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.2); filter: brightness(1.3); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .arabic-text {
          font-size: clamp(2.5rem, 10vw, 6rem);
          font-weight: 700;
          background: linear-gradient(135deg, #fbf5b7 0%, #d4af37 50%, #8a6d3b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
          font-family: 'Noto Sans Arabic', sans-serif;
          text-shadow: 0 0 20px rgba(212,175,55,0.2);
        }
        .french-text {
          font-size: clamp(1rem, 3vw, 2.5rem);
          font-weight: 300;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.9);
        }
        .divider { height: 1px; width: 100px; background: linear-gradient(to right, transparent, #d4af37, transparent); }

        .discover-btn {
          border: 1px solid #d4af37;
          color: #d4af37;
          background: transparent;
          transition: var(--transition);
          box-shadow: 0 0 20px rgba(212,175,55,0.1);
        }
        .discover-btn:hover {
          background: #d4af37;
          color: #050b1a;
          box-shadow: 0 0 40px rgba(212,175,55,0.4);
          transform: scale(1.05);
        }

        .top-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent);
        }
        .decorative-footer {
          position: absolute;
          bottom: 2rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.5em;
        }
      `}</style>
    </div>
  );
};

export default RamadanSplash;
