import { useEffect, useRef } from 'react';

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Stream = {
      x: number;
      y: number;
      len: number;
      speed: number;
      op: number;
      w: number;
      col: string;
    };

    const newStream = (randomY: boolean): Stream => ({
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height * 2 - canvas.height : -200,
      len: 90 + Math.random() * 160,
      speed: 0.1 + Math.random() * 0.25,
      op: 0.008 + Math.random() * 0.022,
      w: 0.4 + Math.random() * 0.9,
      col: Math.random() > 0.7 ? 'rgba(232,82,10,' : 'rgba(90,90,90,',
    });

    let streams: Stream[] = [];
    for (let i = 0; i < 14; i++) streams.push(newStream(true));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      streams.forEach((s, i) => {
        const g = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.len);
        g.addColorStop(0, 'transparent');
        g.addColorStop(0.5, s.col + s.op + ')');
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y + s.len);
        ctx.strokeStyle = g as unknown as string;
        ctx.lineWidth = s.w;
        ctx.stroke();
        s.y += s.speed;
        if (s.y > canvas.height + 200) streams[i] = newStream(false);
      });
      requestAnimationFrame(draw);
    };
    const id = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas id="bg" ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} aria-hidden />;
}
