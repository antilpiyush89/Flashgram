import { useState, useEffect } from 'react';

const RotatingCardsLoader = () => {
  const [positions, setPositions] = useState([0, 1, 2]);
  const [colorIndex, setColorIndex] = useState(0);

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 'bg-yellow-500'];

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => [(prev[0] + 2) % 3, (prev[1] + 2) % 3, (prev[2] + 2) % 3]);
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getCardStyles = (position:any) => {
    const baseStyles =
      'absolute w-24 h-32 rounded-lg shadow-lg transition-all duration-300 ease-in-out';

    switch (position) {
      case 0: // Front
        return `${baseStyles} ${colors[(colorIndex) % colors.length]} translate-y-0 scale-100 z-30`;
      case 1: // Middle
        return `${baseStyles} ${colors[(colorIndex + 1) % colors.length]} translate-y-4 scale-90 translate-x-8 z-20 opacity-80`;
      case 2: // Back
        return `${baseStyles} ${colors[(colorIndex + 2) % colors.length]} translate-y-8 scale-80 translate-x-16 z-10 opacity-60`;
      default:
        return baseStyles;
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-64  rounded-xl">
      <div className="relative w-32 h-40">
        {[0, 1, 2].map((index) => (
          <div key={index} className={getCardStyles(positions[index])} />
        ))}
      </div>
    </div>
  );
};

export default RotatingCardsLoader;