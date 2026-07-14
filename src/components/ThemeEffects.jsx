import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeEffects.css';

export default function ThemeEffects() {
  const { currentTheme } = useTheme();
  
  if (currentTheme === 'sakura') return <ParticleEffect type="sakura" emojis={['🌸']} count={40} speed={1} direction="down" repel={true} />;
  if (currentTheme === 'cyberpunk') return <ParticleEffect type="cyberpunk" emojis={['0', '1']} count={60} speed={2} direction="down" repel={true} />;
  if (currentTheme === 'nature') return <ParticleEffect type="nature" emojis={['']} count={30} speed={0.5} direction="up" attract={true} />;
  if (currentTheme === 'dark') return <ParticleEffect type="dark" emojis={['✦', '★']} count={50} speed={0} direction="static" repel={true} />;
  if (currentTheme === 'light') return <ParticleEffect type="light" emojis={['☁️']} count={12} speed={0.2} direction="right" repel={true} />;
  
  return null;
}

function ParticleEffect({ type, emojis, count, speed, direction, repel, attract }) {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const isHorizontal = direction === 'right';
      return {
        id: i,
        char: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100, // 0 to 100vw
        top: isHorizontal ? Math.random() * 100 : 0, // 0 to 100vh if horizontal
        animationDuration: (5 + Math.random() * 8) / (speed || 1), 
        animationDelay: Math.random() * -20,
        opacity: type === 'dark' ? 0.2 + Math.random() * 0.8 : 0.6 + Math.random() * 0.4,
        scale: 0.5 + Math.random() * 0.8,
        rotation: type === 'sakura' ? Math.random() * 360 : 0,
      };
    });
    setParticles(newParticles);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const renderLoop = () => {
      if (!containerRef.current) return;
      
      const repelElements = containerRef.current.querySelectorAll('.particle-interact');
      repelElements.forEach((el) => {
        const particle = el.firstChild;
        const rect = particle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = centerX - mouseRef.current.x;
        const dy = centerY - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDist = type === 'nature' ? 300 : 200; 
        if (distance < maxDist && distance > 0) {
          const force = (maxDist - distance) / maxDist;
          let pushX = (dx / distance) * force * 150; 
          let pushY = (dy / distance) * force * 150;
          
          if (attract) {
            pushX = -pushX; // pull towards mouse
            pushY = -pushY;
          }
          
          el.style.transform = `translate(${pushX}px, ${pushY}px)`;
          el.style.transition = 'transform 0.1s ease-out';
          
          if (type === 'dark') {
            particle.style.textShadow = '0 0 10px #fff, 0 0 20px #fff';
            particle.style.opacity = '1';
          }
        } else {
          el.style.transform = `translate(0px, 0px)`;
          el.style.transition = 'transform 2s ease-in-out'; 
          
          if (type === 'dark') {
            particle.style.textShadow = 'none';
            particle.style.opacity = particle.dataset.baseOpacity;
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, count, speed, direction, emojis, repel, attract]);

  return (
    <div className={`theme-effect-container ${type}-effect`} ref={containerRef}>
      {particles.map(p => (
        <div 
          key={p.id} 
          className="particle-interact" 
          style={{ 
            position: 'absolute', 
            left: direction === 'right' ? '-10%' : `${p.left}vw`, 
            top: direction === 'right' ? `${p.top}vh` : (direction === 'static' ? `${Math.random()*100}vh` : 0), 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none' 
          }}
        >
          <div
            className={`particle-anim ${direction}-anim`}
            data-base-opacity={p.opacity}
            style={{
              animationDuration: `${p.animationDuration}s`,
              animationDelay: `${p.animationDelay}s`,
              opacity: p.opacity,
              '--scale': p.scale,
              '--rotation': `${p.rotation}deg`,
              fontSize: type === 'light' ? '60px' : (type === 'nature' ? '10px' : '24px')
            }}
          >
            {type === 'nature' ? <div className="firefly"></div> : p.char}
          </div>
        </div>
      ))}
    </div>
  );
}
