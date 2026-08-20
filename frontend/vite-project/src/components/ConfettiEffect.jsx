import React, { useEffect, useState } from "react";

const ConfettiEffect = ({ show }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (show) {
      const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        color: ["#4CAF50", "#81C784", "#66BB6A", "#56AB2F"][Math.floor(Math.random() * 4)],
      }));
      setConfetti(confettiPieces);

      const timer = setTimeout(() => {
        setConfetti([]);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <>
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1000;
        }

        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.8;
          top: -10px;
        }
      `}</style>

      <div className="confetti-container">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti-piece"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default ConfettiEffect;
