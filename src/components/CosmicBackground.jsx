import React, { useEffect, useRef } from 'react';

export default function CosmicBackground({ isWarping }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars = [];
    const numStars = 400;
    
    const stardustTrails = [];

    // Initialize background stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * width,
        o: Math.random(), // opacity
        size: Math.random() * 1.5 + 0.5
      });
    }

    let mouse = { x: width / 2, y: height / 2 };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Add stardust
      stardustTrails.push({
        x: mouse.x,
        y: mouse.y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1.0,
        size: Math.random() * 2 + 1
      });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    let warpSpeed = 0;

    const render = () => {
      // Clear with dark transparent for trail effect during warp, opaque dark normally
      if (isWarping || warpSpeed > 0.1) {
        ctx.fillStyle = 'rgba(2, 2, 3, 0.2)';
      } else {
        ctx.fillStyle = '#020203'; // Solid bg
      }
      ctx.fillRect(0, 0, width, height);

      // Handle warp speed transition
      if (isWarping) {
        warpSpeed = Math.min(warpSpeed + 0.05, 50);
      } else {
        warpSpeed = Math.max(warpSpeed - 1, 0);
      }

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw and move background stars
      for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        
        // 3D projection
        star.z -= (0.5 + warpSpeed);

        if (star.z <= 0) {
          star.x = Math.random() * width;
          star.y = Math.random() * height;
          star.z = width;
        }

        let k = 128.0 / star.z;
        let px = (star.x - centerX) * k + centerX;
        let py = (star.y - centerY) * k + centerY;

        // Draw star or warp line
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          let size = (1 - star.z / width) * star.size;
          let opacity = (1 - star.z / width) * star.o;
          
          if (isWarping || warpSpeed > 0) {
            // Draw warp lines
            let pz = star.z + warpSpeed * 5;
            let pk = 128.0 / pz;
            let px2 = (star.x - centerX) * pk + centerX;
            let py2 = (star.y - centerY) * pk + centerY;
            
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px2, py2);
            ctx.lineWidth = size;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.stroke();
          } else {
            // Draw normal star
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
          }
        }
      }

      // Draw stardust cursor trail (only if not in full warp)
      if (warpSpeed < 10) {
        for (let i = stardustTrails.length - 1; i >= 0; i--) {
          let p = stardustTrails[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02; // Fade out speed
          
          if (p.life <= 0) {
            stardustTrails.splice(i, 1);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 212, 235, ${p.life * 0.5})`; // Using var(--accent) approx
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isWarping]);

  return <canvas ref={canvasRef} id="canvas-container" />;
}
