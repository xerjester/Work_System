import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Sakura.css';

export default function SakuraLeaves() {
  const { currentTheme } = useTheme();
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    if (currentTheme !== 'sakura') {
      setPetals([]);
      return;
    }

    // Generate random petals
    const newPetals = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // 0 to 100vw
      animationDuration: 5 + Math.random() * 5, // 5 to 10s
      animationDelay: Math.random() * -10, // Start at different times
      opacity: 0.5 + Math.random() * 0.5,
      scale: 0.5 + Math.random() * 0.8,
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);
  }, [currentTheme]);

  if (currentTheme !== 'sakura') return null;

  const handleScatter = (e) => {
    // When mouse hovers, push the petal away randomly
    const petal = e.currentTarget;
    const rect = petal.getBoundingClientRect();
    const mouseX = e.clientX;
    
    // Determine direction based on mouse position relative to petal
    const pushRight = rect.left > mouseX;
    const scatterX = (pushRight ? 1 : -1) * (100 + Math.random() * 200);
    const scatterY = -50 - Math.random() * 100;
    const rotate = Math.random() * 720 - 360;

    petal.style.transform = `translate(${scatterX}px, ${scatterY}px) rotate(${rotate}deg)`;
    petal.style.transition = 'transform 0.5s ease-out';
    petal.style.opacity = '0'; // Optionally fade out when scattered

    // Reset after some time so it can fall again
    setTimeout(() => {
      if (petal) {
        petal.style.transition = 'none';
        petal.style.transform = '';
        petal.style.opacity = petal.dataset.baseOpacity;
      }
    }, 500);
  };

  return (
    <div className="sakura-container">
      {petals.map(p => (
        <div
          key={p.id}
          className="sakura-petal"
          data-base-opacity={p.opacity}
          onMouseEnter={handleScatter}
          style={{
            left: `${p.left}vw`,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.animationDelay}s`,
            opacity: p.opacity,
            '--scale': p.scale,
            '--rotation': `${p.rotation}deg`
          }}
        ></div>
      ))}
    </div>
  );
}
