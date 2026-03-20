import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Check, ArrowRight } from 'lucide-react';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

export function PackagesSection() {
  const lang = useSelector((s: RootState) => s.ui.lang);
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const featured = [false, true, false];

  return (
    <section id="packages" style={{ position: 'relative', zIndex: 1, padding: isMobile ? '56px 20px' : '88px 48px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--graphite-line)', paddingBottom: 20, marginBottom: isMobile ? 32 : 52, gap: 16 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 'clamp(36px, 10vw, 56px)' : 'clamp(44px, 5vw, 76px)', fontWeight: 300, textTransform: 'uppercase', lineHeight: 1 }}>
            {tx(t.packages.heading1, lang)}<span style={{ color: 'var(--orange)' }}>{tx(t.packages.heading2, lang)}</span>
          </h2>
          {!isMobile && (
            <span style={{ fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--graphite-muted)', fontWeight: 400 }}>
              {tx(t.packages.overline, lang)}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 3, background: 'var(--graphite-line)' }}>
          {t.packageItems.map((pkg, i) => {
            const isFeatured = featured[i];
            return (
              <div
                key={i}
                className={`pkg-card reveal ${isFeatured ? 'featured' : ''}`}
                style={{ background: isFeatured ? 'var(--graphite)' : 'var(--white)', padding: isMobile ? '28px 20px' : '44px 36px', transitionDelay: `${i * 0.1}s`, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {isFeatured && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, var(--orange), rgba(232,82,10,.4))' }} />
                )}
                <span style={{ fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 24, display: 'block', fontWeight: 500 }}>
                  {tx(pkg.tag, lang)}
                </span>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 36 : 44, fontWeight: 300, lineHeight: 1, marginBottom: 8, color: isFeatured ? 'var(--off-white)' : 'var(--graphite)' }}>
                  {tx(pkg.name, lang)}
                </div>
                <div style={{ fontSize: 13, color: isFeatured ? 'rgba(248,247,245,.5)' : 'var(--graphite-muted)', marginBottom: 20, fontWeight: 300 }}>
                  {tx(pkg.hours, lang)}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 36 }}>
                  {pkg.features.map((f, fi) => (
                    <li key={fi} style={{ fontSize: 13, color: isFeatured ? 'rgba(248,247,245,.6)' : 'var(--graphite-muted)', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.6, fontWeight: 300 }}>
                      <Check size={13} color="var(--orange)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 3 }} />
                      {tx(f, lang)}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', textDecoration: 'none', padding: isMobile ? '14px 22px' : '14px 26px', border: `1px solid ${isFeatured ? 'rgba(248,247,245,.25)' : 'var(--graphite)'}`, color: isFeatured ? 'var(--off-white)' : 'var(--graphite)', fontWeight: 400, transition: 'background .25s, color .25s, border-color .25s', marginTop: 'auto', alignSelf: 'flex-start' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--orange)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.borderColor = isFeatured ? 'rgba(248,247,245,.25)' : 'var(--graphite)'; (e.currentTarget as HTMLAnchorElement).style.color = isFeatured ? 'var(--off-white)' : 'var(--graphite)'; }}
                >
                  {tx(t.packages.cta, lang)}
                  <ArrowRight size={13} strokeWidth={1.5} />
                </a>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 13, letterSpacing: '.08em', color: 'var(--graphite-muted)', marginTop: 24, maxWidth: 680, lineHeight: 2, fontWeight: 300 }}>
          {tx(t.packages.footer, lang)}
        </p>
      </div>
    </section>
  );
}
