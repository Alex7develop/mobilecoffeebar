import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { GALLERY_ITEMS } from '../app/constants';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

const IMAGE_SOURCES = [
  '/pages/14-1-3.png',
  '/pages/wedding.jpg',
  '/pages/6D3A7033-667x1000.jpg',
  '/pages/6D3A4525-2-800x1080.jpg',
  '/pages/8.png',
];

export function Gallery() {
  const lang = useSelector((s: RootState) => s.ui.lang);
  const isMobile = useIsMobile();

  return (
    <section id="gallery" style={{ position: 'relative', zIndex: 1, padding: isMobile ? '56px 0' : '72px 0', overflow: 'hidden', background: 'var(--off-white)' }}>
      <div style={{ padding: isMobile ? '0 20px' : '0 48px', marginBottom: isMobile ? 24 : 36 }}>
        <p style={{ fontSize: 12, letterSpacing: '.45em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 500 }}>
          {tx(t.gallery.overline, lang)}
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 'clamp(32px, 9vw, 48px)' : 'clamp(36px, 4vw, 56px)', fontWeight: 300, marginTop: 12, lineHeight: 1 }}>
          {tx(t.gallery.heading1, lang)}<em style={{ color: 'var(--orange)' }}>{tx(t.gallery.heading2, lang)}</em>
        </h2>
      </div>
      <div
        className="gallery-track"
        style={{ display: 'flex', gap: 3, padding: isMobile ? '0 20px' : '0 48px', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {GALLERY_ITEMS.map((item, i) => (
          <div
            key={item.label}
            className="g-item reveal"
            style={{
              flexShrink: 0,
              width: isMobile ? 'clamp(200px, 60vw, 280px)' : 320,
              height: isMobile ? 'clamp(270px, 80vw, 370px)' : 420,
              background: 'var(--off-white-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontStyle: 'italic', color: 'var(--graphite-line)',
              position: 'relative', overflow: 'hidden', transitionDelay: `${i * 0.05}s`,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(232,82,10,.06) 0%, rgba(42,42,42,.04) 100%)', zIndex: 1 }} />
            {IMAGE_SOURCES[i] && (
              <img
                src={IMAGE_SOURCES[i]}
                alt={item.label}
                loading="lazy"
                decoding="async"
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'sepia(0.18) saturate(0.82) contrast(1.08) brightness(0.94)',
                  transition: 'filter .4s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = 'sepia(0.08) saturate(1) contrast(1.04) brightness(1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = 'sepia(0.18) saturate(0.82) contrast(1.08) brightness(0.94)'; }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 2 }}>{item.title}</span>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 16px 16px', background: 'linear-gradient(to top, rgba(42,42,42,.55) 0%, transparent 100%)', zIndex: 3 }}>
              <span style={{ fontSize: 10, letterSpacing: '.32em', textTransform: 'uppercase', color: 'rgba(248,247,245,.85)', fontStyle: 'normal', fontFamily: 'Montserrat', fontWeight: 400 }}>
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
