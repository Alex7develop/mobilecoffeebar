import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

export function Hero() {
  const lang = useSelector((s: RootState) => s.ui.lang);
  const isMobile = useIsMobile();

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: isMobile ? '0 20px 48px' : '0 48px 72px',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: isMobile ? 'none' : 'url(/pages/coffee1.png)', backgroundSize: '70%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(248,247,245,.72) 0%, rgba(248,247,245,.82) 24%, rgba(248,247,245,.94) 50%, rgba(248,247,245,.99) 66%, rgba(248,247,245,1) 82%, rgba(248,247,245,1) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(232,82,10,.06) 0%, transparent 55%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
      <motion.p
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        style={{ fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 500, marginBottom: 16 }}
      >
        {tx(t.hero.overline, lang)}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.4 }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? 'clamp(52px, 12vw, 80px)' : 'clamp(72px, 10vw, 62px)',
          lineHeight: 0.9, fontWeight: 300, textTransform: 'uppercase',
          maxWidth: isMobile ? '100%' : 1000,
          color: 'var(--graphite)',
          textShadow: '0 1px 2px rgba(248,247,245,.9)',
        }}
      >
        {tx(t.hero.title1, lang)}<br />
        <span style={{ fontStyle: 'normal', color: 'var(--orange)' }}>{tx(t.hero.title2, lang)}</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginTop: isMobile ? 32 : 48, gap: isMobile ? 24 : 0 }}
      >
        <p style={{ maxWidth: isMobile ? '100%' : 400, fontSize: isMobile ? 13 : 14, lineHeight: 2, color: 'var(--graphite)', fontWeight: 300, textShadow: '0 1px 2px rgba(248,247,245,.8)' }}>
          {tx(t.hero.body, lang)}
        </p>
        <a href="#contact" className="hero-cta" onClick={scrollToContact} style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none', alignSelf: isMobile ? 'stretch' : 'auto' }}>
          <div className="cta-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start', gap: 14, fontSize: 10, letterSpacing: '.32em', textTransform: 'uppercase', color: 'var(--white)', background: 'var(--graphite)', padding: isMobile ? '18px 32px' : '20px 40px', position: 'relative', overflow: 'hidden', fontWeight: 400, flex: isMobile ? 1 : 'none' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>{tx(t.hero.cta, lang)}</span>
          </div>
          {!isMobile && <>
            <div className="cta-line" style={{ width: 0, height: 2, background: 'var(--orange)', transition: 'width .4s cubic-bezier(.77,0,.18,1)' }} />
            <div className="cta-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--orange)', opacity: 0, transform: 'scale(0)' }} />
          </>}
        </a>
      </motion.div>
      </div>
    </section>
  );
}
