import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

export function Contact() {
  const lang = useSelector((s: RootState) => s.ui.lang);
  const isMobile = useIsMobile();
  const c = t.contact;

  return (
    <section id="contact" style={{ position: 'relative', zIndex: 1, background: 'var(--graphite)', padding: isMobile ? '56px 20px' : '88px 48px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 15% 50%, rgba(232,82,10,.08) 0%, transparent 55%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, var(--orange) 0%, rgba(232,82,10,.3) 50%, transparent 100%)' }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 72, alignItems: 'start' }}>

        <div className="reveal">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 'clamp(36px, 10vw, 56px)' : 'clamp(44px, 5vw, 76px)', fontWeight: 300, textTransform: 'uppercase', lineHeight: 1, color: 'var(--off-white)', marginBottom: 24 }}>
            {tx(c.heading1, lang)}<br />{tx(c.heading2, lang)}<br />
            <em style={{ color: 'var(--orange)' }}>{tx(c.heading3, lang)}</em>
          </h2>
          <p style={{ fontSize: isMobile ? 13 : 14, color: 'rgba(248,247,245,.5)', lineHeight: 2, marginBottom: 32, maxWidth: 400, fontWeight: 300 }}>
            {tx(c.body, lang)}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <MapPin size={15} color="var(--orange)" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 13, color: 'rgba(248,247,245,.4)', lineHeight: 1.9, fontWeight: 300 }}>
                {tx(c.cities, lang)}<br />
                <span style={{ color: 'rgba(248,247,245,.25)' }}>{tx(c.citiesNote, lang)}</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Mail size={15} color="var(--orange)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
              <a href="mailto:neocoffeebar@mail.ru" style={{ fontSize: 13, color: 'var(--orange)', textDecoration: 'none', letterSpacing: '.04em' }}>
              neocoffeebar@mail.ru
              </a>
            </div>
          </div>
        </div>

        <div className="reveal" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, var(--orange), transparent)', animation: 'scanLine 4s ease infinite', opacity: 0.4 }} />

          {/* Форма временно убрана: клиент взаимодействует только через звонок/Telegram */}

          {/* Уведомление + кнопки связи */}
          <div style={{ marginTop: 24, padding: isMobile ? '24px 20px' : '28px 32px', border: '1px solid rgba(232,82,10,.3)', background: 'rgba(232,82,10,.04)' }}>
            <p style={{ fontSize: 13, color: 'rgba(248,247,245,.65)', marginBottom: 28, fontWeight: 300, lineHeight: 1.7 }}>
              {tx(c.formPauseNote, lang)}
            </p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10 }}>
              <a
                href="mailto:neocoffeebar@mail.ru"
                aria-label={lang === 'ru' ? 'Написать письмо' : 'Write an email'}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  padding: '18px 24px',
                  border: '1px solid var(--orange)',
                  color: 'var(--orange)',
                  textDecoration: 'none',
                  fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', fontWeight: 500,
                  transition: 'background .25s, color .25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--orange)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--orange)'; }}
              >
                <Mail size={15} strokeWidth={1.5} />
              </a>
              <a
                href="tel:+79031168911"
                aria-label={tx(c.callBtn, lang)}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  padding: '18px 24px',
                  border: '1px solid var(--orange)',
                  color: 'var(--orange)',
                  textDecoration: 'none',
                  fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', fontWeight: 500,
                  transition: 'background .25s, color .25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--orange)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--orange)'; }}
              >
                <Phone size={15} strokeWidth={1.5} />
              </a>
              <a
                href="https://t.me/+79031168911"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tx(c.tgBtn, lang)}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  padding: '18px 24px',
                  background: 'var(--orange)',
                  color: 'var(--white)',
                  textDecoration: 'none',
                  fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', fontWeight: 500,
                  transition: 'background .25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#c94208'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--orange)'; }}
              >
                <Send size={15} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <p style={{ fontSize: 11, color: 'rgba(248,247,245,.2)', letterSpacing: '.06em', marginTop: 16, lineHeight: 2, fontWeight: 300 }}>
            {tx(c.privacy, lang)}
          </p>
        </div>
      </div>
    </section>
  );
}
