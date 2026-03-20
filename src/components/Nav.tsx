import { useState, useEffect, useMemo } from 'react';
import { Menu, X, Phone, Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setLang } from '../store/slices/uiSlice';
import type { RootState } from '../store';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

export function Nav() {
  const dispatch = useDispatch();
  const lang = useSelector((s: RootState) => s.ui.lang);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = useMemo(() => [
    { href: '#manifesto', label: tx(t.nav.philosophy, lang) },
    { href: '#about',     label: tx(t.nav.founders, lang) },
    { href: '#menu',      label: tx(t.nav.menu, lang) },
    { href: '#calcSection', label: tx(t.nav.calculator, lang) },
    { href: '#contact',   label: tx(t.nav.contact, lang) },
  ], [lang]);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? `14px ${isMobile ? '16px' : '40px'}` : `${isMobile ? '16px' : '20px'} ${isMobile ? '16px' : '40px'}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'padding .4s ease, background .4s ease, box-shadow .4s ease',
        background: (scrolled || mobileOpen) ? 'rgba(255,255,255,.97)' : 'linear-gradient(to bottom,rgba(255,255,255,.95) 60%,transparent)',
        boxShadow: (scrolled || mobileOpen) ? '0 1px 0 rgba(42,42,42,.07)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        gap: 32,
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? 24 : 28,
          fontWeight: 400, letterSpacing: '.2em',
          color: 'var(--graphite)', textDecoration: 'none', flexShrink: 0,
        }}
      >
        Н<span style={{ color: 'var(--orange)' }}>Е</span>О
      </a>

      {/* Desktop nav links */}
      <ul className="nav-desktop-links" style={{ display: 'flex', gap: 32, listStyle: 'none', flex: 1, justifyContent: 'center' }}>
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="nav-link">{l.label}</a>
          </li>
        ))}
      </ul>

      {/* Language switcher + contact buttons — desktop */}
      <div className="nav-lang-desktop" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', border: '1px solid var(--graphite-line)' }}>
          <button type="button" className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => dispatch(setLang('ru'))}>РУ</button>
          <button type="button" className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => dispatch(setLang('en'))}>EN</button>
        </div>
        <div style={{ width: 1, height: 20, background: 'var(--graphite-line)' }} />
        <a
          href="tel:+79031168911"
          title={lang === 'ru' ? 'Позвонить' : 'Call us'}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            border: '1px solid var(--graphite-line)',
            color: 'var(--graphite)',
            textDecoration: 'none',
            fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 500,
            transition: 'border-color .2s, color .2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--orange)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--graphite-line)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--graphite)'; }}
        >
          <Phone size={12} strokeWidth={1.5} />
          <span>{lang === 'ru' ? 'Позвонить' : 'Call'}</span>
        </a>
        <a
          href="https://t.me/+79031168911"
          target="_blank"
          rel="noopener noreferrer"
          title="Telegram"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            background: 'var(--orange)',
            color: 'var(--white)',
            textDecoration: 'none',
            fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 500,
            transition: 'background .2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--graphite)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--orange)'; }}
        >
          <Send size={12} strokeWidth={1.5} />
          <span>Telegram</span>
        </a>
      </div>

      {/* Mobile: lang + burger */}
      {isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', border: '1px solid var(--graphite-line)' }}>
            <button type="button" className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => dispatch(setLang('ru'))}>РУ</button>
            <button type="button" className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => dispatch(setLang('en'))}>EN</button>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            style={{ background: 'none', border: 'none', color: 'var(--graphite)', cursor: 'pointer', display: 'flex', padding: 4 }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      )}

      {/* Mobile dropdown */}
      {mobileOpen && isMobile && (
        <div
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--white)',
            borderTop: '1px solid var(--graphite-line)',
            padding: '24px 20px 32px',
            display: 'flex', flexDirection: 'column', gap: 0,
          }}
        >
          {links.map((l) => (
            <a
              key={l.href} href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: 13, letterSpacing: '.28em',
                textTransform: 'uppercase', color: 'var(--graphite-muted)',
                textDecoration: 'none', padding: '16px 0',
                borderBottom: '1px solid var(--graphite-line)',
                display: 'block',
                transition: 'color .2s',
              }}
            >
              {l.label}
            </a>
          ))}
          {/* Contact buttons in mobile menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 20 }}>
            <a
              href="tel:+79031168911"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '14px 20px',
                border: '1px solid var(--orange)',
                color: 'var(--orange)',
                textDecoration: 'none',
                fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', fontWeight: 500,
              }}
            >
              <Phone size={14} strokeWidth={1.5} />
              <span>{lang === 'ru' ? 'Позвонить' : 'Call us'}</span>
            </a>
            <a
              href="https://t.me/+79031168911"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '14px 20px',
                background: 'var(--orange)',
                color: 'var(--white)',
                textDecoration: 'none',
                fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', fontWeight: 500,
              }}
            >
              <Send size={14} strokeWidth={1.5} />
              <span>Telegram</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
