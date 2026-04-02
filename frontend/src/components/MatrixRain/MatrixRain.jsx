import { useState, useEffect } from "react";

const MatrixRain = ({ streamCount = 40 }) => {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const chars = "01@#アイウエオカキ$%";
    
    // Generate organic, randomized parameters purely on the client side.
    const newStreams = Array.from({ length: streamCount }).map((_, i) => ({
      id: i,
      char: chars[Math.floor(Math.random() * chars.length)],
      left: `${Math.random() * 100}%`,
      fontSize: `${Math.floor(Math.random() * 10) + 12}px`, // Range: 12px - 22px
      duration: `${Math.random() * 8 + 4}s`,                 // Range: 4s - 12s
      delay: `${Math.random() * 5}s`,                        // Range: 0s - 5s
      opacity: Math.random() * 0.2 + 0.05,                   // Subtle opacity: 5% - 25%
    }));
    
    setStreams(newStreams);
  }, [streamCount]);

  // Edge Case: If streams haven't generated yet, render empty wrapper to prevent layout shift
  if (streams.length === 0) {
    return <div className="fixed inset-0 z-0 bg-transparent pointer-events-none" aria-hidden="true" />;
  }

  return (
    <div 
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-slate-950/20"
      aria-hidden="true" 
    >
      {streams.map((stream) => (
        <span
          key={stream.id}
          className="absolute -top-10 text-emerald-500 font-mono animate-matrix-fall"
          style={{
            left: stream.left,
            fontSize: stream.fontSize,
            animationDuration: stream.duration,
            animationDelay: stream.delay,
            opacity: stream.opacity,
          }}
        >
          {stream.char}
        </span>
      ))}
    </div>
  );
};

export default MatrixRain;