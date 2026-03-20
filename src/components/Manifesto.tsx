import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

const VALUES_NUMS = ['01', '02', '03', '04', '05'] as const;

export function Manifesto() {
  const lang = useSelector((s: RootState) => s.ui.lang);
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(false);
  const [valuesVisible, setValuesVisible] = useState<boolean[]>([]);

  const boldPhrase = lang === 'ru'
    ? 'не просто сварить, а создать момент.'
    : 'not just to brew, but to create a moment.';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const observers = valueRefs.current.filter(Boolean).map((el, i) => {
      const o = new IntersectionObserver(([e]) => {
        if (e?.isIntersecting) setValuesVisible((v) => { const n = [...v]; n[i] = true; return n; });
      }, { threshold: 0.08 });
      if (el) o.observe(el);
      return o;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section id="manifesto" style={{ position: 'relative', zIndex: 1, padding: isMobile ? '56px 20px' : '88px 48px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 72, alignItems: 'start' }}>

        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px, 2.8vw, 40px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--graphite)', lineHeight: 1.55, maxWidth: 520 }}>
            {tx(t.manifesto.body, lang)}<br />
            {(() => {
              const s = tx(t.manifesto.bodyBold, lang);
              const i = s.indexOf(boldPhrase);
              if (i === -1) return s;
              return (
                <>
                  {s.slice(0, i)}
                  <strong style={{ fontWeight: 900, color: '#E8520A' }}>{boldPhrase}</strong>
                  {s.slice(i + boldPhrase.length)}
                </>
              );
            })()}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p className="section-label" style={{ marginBottom: 20, alignSelf: 'flex-start' }}>{tx(t.manifesto.overline, lang)}</p>
          {VALUES_NUMS.map((num, i) => {
            const v = t.manifestoValues[num];
            return (
              <div
                key={num}
                ref={(r) => { valueRefs.current[i] = r; }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '32px 1fr' : '40px 1fr auto',
                  alignItems: 'baseline', gap: isMobile ? 12 : 20,
                  borderBottom: '1px solid rgba(42,42,42,0.1)', padding: isMobile ? '14px 0' : '18px 0',
                  opacity: valuesVisible[i] ? 1 : 0, transform: valuesVisible[i] ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity .6s ease, transform .6s ease', transitionDelay: `${i * 0.1}s`,
                }}
              >
                <span style={{ fontSize: 11, color: 'var(--orange)', letterSpacing: '.15em', fontWeight: 500 }}>{num}</span>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 18 : 22, fontWeight: 400, letterSpacing: '.03em', color: 'var(--graphite)', lineHeight: 1.2, marginBottom: isMobile ? 4 : 0 }}>
                    {tx(v.name, lang)}
                  </div>
                  {isMobile && (
                    <div style={{ fontSize: 12, color: 'var(--graphite-muted)', lineHeight: 1.7, fontWeight: 300, marginTop: 4 }}>
                      {tx(v.desc, lang)}
                    </div>
                  )}
                </div>
                {!isMobile && (
                  <div style={{ fontSize: 13, color: 'var(--graphite-muted)', lineHeight: 1.7, maxWidth: 260, textAlign: 'right', fontWeight: 300 }}>
                    {tx(v.desc, lang)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
