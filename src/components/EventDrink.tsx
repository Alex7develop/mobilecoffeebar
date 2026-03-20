import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Sparkles } from 'lucide-react';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

const LAYER_RECTS = [
  { layer: 5, y: 44,  h: 43 },
  { layer: 4, y: 87,  h: 43 },
  { layer: 3, y: 130, h: 43 },
  { layer: 2, y: 173, h: 43 },
  { layer: 1, y: 216, h: 42 },
];
const LAYER_OPACITIES = [0.04, 0.05, 0.06, 0.08, 0.11];
const CUP_LAYER_TEXTS = [...t.cupLayers].reverse();

export function EventDrink() {
  const lang = useSelector((s: RootState) => s.ui.lang);
  const isMobile = useIsMobile();
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  // 0 = видео, 1 = картинка
  const [mediaIndex, setMediaIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setFading(true);
      timeoutId = setTimeout(() => {
        setMediaIndex(prev => (prev === 0 ? 1 : 0));
        setFading(false);
      }, 700);
    }, 6000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 1, background: 'var(--off-white-dark)', padding: isMobile ? '56px 20px' : '72px 48px' }}>
      <div style={{
        maxWidth: 1300, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '380px 1fr auto',
        gap: isMobile ? 32 : 52,
        alignItems: 'center',
      }}>

        {/* ── Медиа (видео / фото с кроссфейдом) ── */}
        <div className="reveal" style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 16, left: -16, width: '100%', height: '100%', border: '1px solid rgba(232,82,10,.25)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'relative', width: '100%', aspectRatio: isMobile ? '16/9' : '9/16', overflow: 'hidden', background: '#0a0a0a', zIndex: 1 }}>

            {/* Видео */}
            <video
              autoPlay muted loop playsInline
              preload="none"
              src="/pages/v60.mp4"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                opacity: fading ? 0 : (mediaIndex === 0 ? 1 : 0),
                transition: 'opacity 0.7s ease',
              }}
            />

            {/* Фото напитка */}
            <img
              src="/pages/drink.webp"
              alt="Напиток события"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: fading ? 0 : (mediaIndex === 1 ? 1 : 0),
                transition: 'opacity 0.7s ease',
                filter: 'sepia(0.12) saturate(0.88) contrast(1.06) brightness(0.95)',
              }}
            />

            {/* Точки-индикаторы */}
            <div style={{ position: 'absolute', bottom: 14, right: 14, display: 'flex', gap: 5, zIndex: 4 }}>
              {[0, 1].map(idx => (
                <div key={idx} onClick={() => { setFading(true); setTimeout(() => { setMediaIndex(idx); setFading(false); }, 700); }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: mediaIndex === idx ? 'var(--orange)' : 'rgba(255,255,255,.4)', transition: 'background .3s', cursor: 'pointer' }} />
              ))}
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%', background: 'linear-gradient(to top, rgba(10,10,10,.65) 0%, transparent 100%)', zIndex: 2 }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 3, transition: 'opacity 0.5s ease', opacity: fading ? 0 : 1 }}>
              <div style={{ fontSize: 10, letterSpacing: '.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontWeight: 400 }}>
                {mediaIndex === 0 ? 'V60 · Pour Over' : 'Напиток события'}
              </div>
            </div>
          </div>
        </div>

        {/* ── Текст ── */}
        <div className="reveal">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Sparkles size={14} color="var(--orange)" strokeWidth={1.5} />
            <span style={{ fontSize: 12, letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 500 }}>
              {tx(t.eventDrink.overline, lang)}
            </span>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(32px, 3.5vw, 52px)', fontWeight: 300, color: 'var(--graphite)', lineHeight: 1.1, marginBottom: 20, fontStyle: 'italic' }}>
            {tx(t.eventDrink.heading, lang)}
          </div>
          <div style={{ fontSize: 14, color: 'var(--graphite-muted)', lineHeight: 2, fontWeight: 300, maxWidth: 360 }}>
            {tx(t.eventDrink.body, lang)}{' '}
            <span style={{ color: 'var(--graphite)', fontWeight: 400 }}>{tx(t.eventDrink.bodyBold, lang)}</span>.
          </div>

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: isMobile ? 0 : 8 }}>
            {CUP_LAYER_TEXTS.map((layerText, i) => {
              const layerNum = 5 - i;
              const isActive = !isMobile && activeLayer === layerNum;
              return (
                <div
                  key={layerNum}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    opacity: isMobile ? 1 : (isActive ? 1 : 0.48),
                    transform: isActive ? 'translateX(6px)' : 'none',
                    transition: 'opacity .25s, transform .25s',
                    padding: isMobile ? '10px 0' : undefined,
                    borderBottom: isMobile ? '1px solid rgba(42,42,42,0.07)' : undefined,
                  }}
                >
                  <span style={{ width: 18, height: 1, flexShrink: 0, background: isActive ? 'var(--orange)' : 'rgba(42,42,42,0.2)', transition: 'background .25s' }} />
                  <span
                    style={{
                      fontSize: isMobile ? 14 : 12,
                      color: isMobile ? 'var(--graphite)' : (isActive ? 'var(--graphite)' : 'var(--graphite-muted)'),
                      letterSpacing: '.06em',
                      fontWeight: isMobile ? 300 : (isActive ? 500 : 300),
                      transition: 'color .25s',
                      lineHeight: 1.4,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'var(--orange)',
                        marginRight: 10,
                        transform: 'translateY(-1px)',
                      }}
                    />
                    {tx(layerText, lang)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Стакан — только на десктопе ── */}
        {!isMobile && (
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" style={{ width: 220, height: 320, overflow: 'visible', display: 'block' }}>
                <defs>
                  <clipPath id="cupClip">
                    <path d="M50 44 L150 44 L140 258 Q100 268 60 258 Z" />
                  </clipPath>
                </defs>
                <g clipPath="url(#cupClip)">
                  {LAYER_RECTS.map((lr, i) => (
                    <rect key={lr.layer} x={50} y={lr.y} width={100} height={lr.h}
                      fill={`rgba(232,82,10,${activeLayer === lr.layer ? 0.3 : LAYER_OPACITIES[i]})`}
                      style={{ transition: 'fill .2s' }} />
                  ))}
                </g>
                <path d="M50 44 L150 44 L140 258 Q100 270 60 258 Z" fill="none" stroke="rgba(232,82,10,0.55)" strokeWidth={1.5} strokeLinejoin="round" />
                <rect x={44} y={30} width={112} height={16} rx={4} fill="none" stroke="rgba(232,82,10,0.5)" strokeWidth={1.5} />
                <rect x={78} y={22} width={44} height={10} rx={4} fill="none" stroke="rgba(232,82,10,0.4)" strokeWidth={1.2} />
                {LAYER_RECTS.slice(1).map((lr) => (
                  <line key={`div-${lr.layer}`} x1={50} y1={lr.y} x2={150} y2={lr.y}
                    stroke={`rgba(232,82,10,${activeLayer === lr.layer || activeLayer === lr.layer - 1 ? 0.5 : 0.15})`}
                    strokeWidth={0.8} style={{ transition: 'stroke .2s' }} clipPath="url(#cupClip)" />
                ))}
                {LAYER_RECTS.map(({ layer, y, h }) => {
                  const layerText = CUP_LAYER_TEXTS[5 - layer];
                  return (
                    <rect key={`hover-${layer}`} x={44} y={y} width={112} height={h} fill="transparent" style={{ cursor: 'crosshair' }}
                      onMouseEnter={() => { setActiveLayer(layer); setTooltip(tx(layerText, lang)); }}
                      onMouseLeave={() => { setActiveLayer(null); setTooltip(null); }} />
                  );
                })}
              </svg>
              {tooltip && (
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: -8, background: 'var(--orange)', color: 'var(--white)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', padding: '8px 20px', whiteSpace: 'nowrap', borderRadius: 3, fontWeight: 500, boxShadow: '0 6px 24px rgba(232,82,10,.35)', pointerEvents: 'none' }}>
                  {tooltip}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
