import { useDispatch, useSelector } from 'react-redux';
import { toggleAboutAccordion } from '../store/slices/uiSlice';
import type { RootState } from '../store';
import { Plus, Minus } from 'lucide-react';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

export function About() {
  const dispatch = useDispatch();
  const open = useSelector((s: RootState) => s.ui.aboutAccordionOpen);
  const lang = useSelector((s: RootState) => s.ui.lang);
  const isMobile = useIsMobile();

  return (
    <section id="about" style={{ position: 'relative', zIndex: 1, background: 'var(--graphite)', padding: isMobile ? '56px 20px' : '88px 48px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 90% 10%, rgba(232,82,10,.1) 0%, transparent 55%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p className="reveal" style={{ fontSize: 12, letterSpacing: '.45em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 500, marginBottom: 44 }}>
          {tx(t.about.overline, lang)}
        </p>

        <button
          type="button"
          onClick={() => dispatch(toggleAboutAccordion())}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%', cursor: 'pointer', border: 'none', background: 'none', borderBottom: `1px solid ${open ? 'rgba(232,82,10,.25)' : 'rgba(248,247,245,.1)'}`, paddingBottom: 24, textAlign: 'left', transition: 'border-color .3s' }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 'clamp(28px, 8vw, 42px)' : 'clamp(32px, 3.5vw, 54px)', fontWeight: 300, color: 'var(--off-white)', lineHeight: 1.1 }}>
            {tx(t.about.headingLine1, lang)}<br />
            {tx(t.about.headingLine2, lang)}<em style={{ color: 'var(--orange)' }}>{tx(t.about.headingEm, lang)}</em>{tx(t.about.headingLine2end, lang)}
          </h2>
          <div style={{ width: 44, height: 44, border: `1px solid ${open ? 'rgba(232,82,10,.4)' : 'rgba(248,247,245,.15)'}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: open ? 'var(--orange)' : 'var(--off-white)', transition: 'border-color .3s, color .3s' }}>
            {open ? <Minus size={16} /> : <Plus size={16} />}
          </div>
        </button>

        <div style={{ overflow: 'hidden', maxHeight: open ? (isMobile ? 1400 : 900) : 0, opacity: open ? 1 : 0, transition: 'max-height .75s cubic-bezier(.4,0,.2,1), opacity .5s ease' }}>
          <div style={{
            padding: isMobile ? '28px 0 0' : '40px 0 0',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 220px',
            gap: isMobile ? 40 : 64,
            alignItems: 'start',
            maxWidth: 1100,
          }}>
            {/* Текст */}
            <div>
              <p style={{ fontSize: isMobile ? 14 : 15, color: 'rgba(248,247,245,.65)', lineHeight: 2, marginBottom: 20, fontWeight: 300 }}>
                {lang === 'ru'
                  ? <>Александр прошёл путь от работы на событиях мирового уровня, где за столом собирались первые лица, до создания спешалти-проекта <span style={{ color: 'var(--off-white)', fontWeight: 400 }}>Roaster coffee</span> — кофейни, которая уже десять лет формирует свою аудиторию и стандарт качества. За плечами — экспертиза в кофейных чемпионатах, консалтинг в сфере кофеен и программирование, которое даёт техническую глубину управленческим решениям. Этот опыт стал основой проекта <span style={{ color: 'var(--off-white)', fontWeight: 400 }}>НЕО</span>.</>
                  : <>Alexander has gone from working at world-class events attended by top figures, to a specialty coffee project that has been on the market for ten years. Along the way — championships, recognition, a loyal audience. Then a complete shift in perspective: he became a full‑stack developer to merge service precision with <span style={{ color: 'var(--off-white)', fontWeight: 400 }}>digital product architecture</span>. That is how NEO was born — where taste meets technology.</>
                }
              </p>
              <p style={{ fontSize: isMobile ? 14 : 15, color: 'rgba(248,247,245,.65)', lineHeight: 2, marginBottom: 20, fontWeight: 300 }}>
                {lang === 'ru'
                  ? <>Софья получила серьезную подготовку в школе менеджмента Сингапура и бизнес-школе Великобритании. В Сингапуре же начался её путь в <span style={{ color: 'var(--off-white)', fontWeight: 400 }}>Marriott</span>, с международными стандартами гостеприимства. Затем — смелые инициативы в <span style={{ color: 'var(--off-white)', fontWeight: 400 }}>ИКЕА</span>, где один из её реализованных проектов был признан лучшим в 13 странах по версии <span style={{ color: 'var(--off-white)', fontWeight: 400 }}>INGKA</span> и <span style={{ color: 'var(--off-white)', fontWeight: 400 }}>Газпром</span>. Сегодня её экспертиза — клиентский опыт и глобальные коммуникации: детали, которые не видны, но всегда чувствуются. Всё это стало частью фундамента проекта <span style={{ color: 'var(--off-white)', fontWeight: 400 }}>НЕО</span>.</>
                  : <>Sofia brought experience shaped by Singapore and international standards. A hospitality school, work within <span style={{ color: 'var(--off-white)', fontWeight: 400 }}>Marriott</span> structures, then bold initiatives at IKEA — one of her projects was recognised as the best implemented project of the year. Today her expertise is customer experience, global communications and those details that are invisible but always felt.</>
                }
              </p>
              <div style={{ marginTop: isMobile ? 32 : 48, paddingTop: 32, borderTop: '1px solid rgba(248,247,245,.08)', fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 'clamp(18px, 5vw, 26px)' : 'clamp(22px, 2.2vw, 34px)', fontWeight: 300, color: 'var(--off-white)', lineHeight: 1.45, fontStyle: 'italic', maxWidth: 720 }}>
                {tx(t.about.quote, lang)}{' '}
                <strong style={{ fontStyle: 'normal', color: 'var(--orange)' }}>{tx(t.about.quoteBold, lang)}</strong>{' '}
                {tx(t.about.quoteEnd, lang)}
              </div>
            </div>

            {/* Фото */}
            <div
              style={{
                position: 'relative',
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity .7s ease .35s, transform .7s ease .35s',
                maxWidth: isMobile ? 200 : 220,
              }}
            >
              <div style={{ position: 'absolute', top: 12, right: -12, width: '100%', height: '100%', border: '1px solid rgba(232,82,10,.2)', pointerEvents: 'none' }} />
              <div style={{ overflow: 'hidden', position: 'relative' }}>
                <img
                  src="/pages/me.webp"
                  alt="Основатели НЕО"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', filter: 'grayscale(15%)', transition: 'transform .6s cubic-bezier(.25,.1,.25,1), filter .4s ease' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)';
                    (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0%)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(15%)';
                  }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, rgba(42,42,42,.6) 0%, transparent 100%)' }} />
              </div>
              <p style={{ fontSize: 10, letterSpacing: '.25em', textTransform: 'uppercase', color: 'rgba(248,247,245,.3)', marginTop: 12, textAlign: 'center', fontWeight: 300 }}>
                {lang === 'ru' ? 'Основатели' : 'Founders'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
