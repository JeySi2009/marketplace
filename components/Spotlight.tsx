// components/Spotlight.tsx
'use client';

import { useRef, useState } from 'react';

interface SpotlightProps {
  children?: React.ReactNode;
  className?: string;
  size?: number;
  magnetic?: boolean;
}

export function Spotlight({ children, className = '', size = 800, magnetic = false }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {magnetic ? (
        // МАГНИТНЫЙ ЭФФЕКТ (Hero) - он на темном фоне, тут всё ок
        <div
          className={`pointer-events-none absolute rounded-full bg-accent/40 blur-[100px] z-0 ${
            isHovered ? 'transition-opacity duration-300' : 'transition-all duration-700 ease-out'
          }`}
          style={{
            width: '500px', 
            height: '500px',
            left: isHovered ? position.x - 250 : '50%',
            top: isHovered ? position.y - 250 : '50%',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(1.5)',
          }}
        />
      ) : (
        // СТАНДАРТНЫЙ ЭФФЕКТ (Глобальный фон)
        // Показываем и на светлой, и на темной теме, но с разными параметрами
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(
              ${size}px circle at ${position.x}px ${position.y}px, 
              var(--spotlight-color), 
              transparent 40%
            )`,
          }}
        />
      )}
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}