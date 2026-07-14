import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Sakura.css';

export default function SakuraLeaves() {
  const { currentTheme } = useTheme();
  const [petals, setPetals] = useState([]);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (currentTheme !== 'sakura') {
      setPetals([]);
      return;
    }

    const newPetals = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // 0 to 100vw
      animationDuration: 5 + Math.random() * 8, // 5 to 13s
      animationDelay: Math.random() * -10,
      opacity: 0.6 + Math.random() * 0.4,
      scale: 0.8 + Math.random() * 0.7,
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const renderLoop = () => {
      if (!containerRef.current) return;
      
      const repelElements = containerRef.current.querySelectorAll('.sakura-repel');
      repelElements.forEach((el) => {
        const petal = el.firstChild;
        const rect = petal.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = centerX - mouseRef.current.x;
        const dy = centerY - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDist = 200; // Repulsion radius
        if (distance < maxDist && distance > 0) {
          const force = (maxDist - distance) / maxDist;
          const pushX = (dx / distance) * force * 150; // max push 150px
          const pushY = (dy / distance) * force * 150;
          
          el.style.transform = `translate(${pushX}px, ${pushY}px)`;
          el.style.transition = 'transform 0.1s ease-out';
        } else {
          el.style.transform = `translate(0px, 0px)`;
          el.style.transition = 'transform 2s ease-in-out'; // slowly drift back
        }
      });
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme]);

  if (currentTheme !== 'sakura') return null;

  return (
    <div className="sakura-container" ref={containerRef}>
      {petals.map(p => (
        <div 
          key={p.id} 
          className="sakura-repel" 
          style={{ position: 'absolute', left: `${p.left}vw`, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <div
            className="sakura-petal"
            style={{
              animationDuration: `${p.animationDuration}s`,
              animationDelay: `${p.animationDelay}s`,
              opacity: p.opacity,
              '--scale': p.scale,
              '--rotation': `${p.rotation}deg`
            }}
          >
            🌸
          </div>
        </div>
      ))}
    </div>
  );
}
