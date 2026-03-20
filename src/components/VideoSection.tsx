import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { t, tx } from '../app/i18n';

export function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const lang = useSelector((s: RootState) => s.ui.lang);

  // Загружаем и запускаем видео только когда секция попадает во viewport
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.load();
        video.play().then(() => setPlaying(true)).catch(() => {});
        obs.disconnect();
      }
    }, { threshold: 0.15 });

    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <section
      ref={sectionRef}
      id="videoSection"
      style={{
        position: 'relative', zIndex: 1,
        height: isMobile ? 'clamp(260px, 56vw, 480px)' : '80vh',
        overflow: 'hidden',
        background: '#0a0a0a',
      }}
    >
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(0.18) saturate(0.82) contrast(1.08) brightness(0.94)' }}
        loop muted playsInline
        preload="none"
        src="/pages/2.mp4"
      />

      {/* Градиент */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,.45) 0%, rgba(10,10,10,0) 50%)' }} />

      {/* Кнопка play/pause */}
      <button
        type="button"
        onClick={toggle}
        style={{
          position: 'absolute', zIndex: 2,
          bottom: isMobile ? 16 : 40, left: isMobile ? 16 : 40,
          width: isMobile ? 52 : 72, height: isMobile ? 52 : 72,
          borderRadius: '50%',
          background: 'rgba(232,82,10,.18)',
          border: '1px solid rgba(232,82,10,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .3s',
          cursor: 'pointer',
        }}
      >
        {playing
          ? <Pause size={isMobile ? 16 : 22} color="var(--orange)" fill="var(--orange)" />
          : <Play size={isMobile ? 16 : 22} color="var(--orange)" fill="var(--orange)" style={{ marginLeft: 2 }} />
        }
      </button>

      {/* Подпись */}
      {!isMobile && (
        <div style={{
          position: 'absolute', bottom: 52, left: 128,
          fontSize: 11, letterSpacing: '.35em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,.4)', fontWeight: 400,
        }}>
          {tx(t.video.label, lang)}
        </div>
      )}

      {/* Прогресс-линия */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,.06)' }}>
        <div style={{ height: '100%', width: playing ? '40%' : '0%', background: 'var(--orange)', transition: 'width 0.5s ease' }} />
      </div>
    </section>
  );
}
