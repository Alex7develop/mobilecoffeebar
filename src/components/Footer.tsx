import { Send, Globe } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

const socialLinks = [
  // { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Send, href: '#', label: 'Telegram' },
  { icon: Globe, href: '#', label: 'Website' },
];

export function Footer() {
  const lang = useSelector((s: RootState) => s.ui.lang);
  const isMobile = useIsMobile();

  const navLinks = [
    { href: '#manifesto', label: tx(t.nav.philosophy, lang) },
    { href: '#calcSection', label: tx(t.nav.calculator, lang) },
    { href: '#contact', label: tx(t.nav.contact, lang) },
  ];

  if (isMobile) {
    return (
      <footer style={{ position: 'relative', zIndex: 1, background: 'var(--graphite)', borderTop: '1px solid rgba(248,247,245,.06)', padding: '36px 20px 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, letterSpacing: '.22em', color: 'var(--off-white)' }}>
              Н<span style={{ color: 'var(--orange)' }}>Е</span>О
            </span>
            <span style={{ fontSize: 11, color: 'rgba(248,247,245,.25)', letterSpacing: '.12em' }}></span>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} style={{ color: 'rgba(248,247,245,.4)', display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'color .25s' }}>
                <Icon size={18} strokeWidth={1.5} />
              </a>
            ))}
          </div>

          <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 20px', listStyle: 'none' }}>
            {navLinks.map((l) => (
              <li key={l.href}><a href={l.href} className="footer-link">{l.label}</a></li>
            ))}
          </ul>

          <p style={{ fontSize: 11, letterSpacing: '.1em', color: 'rgba(248,247,245,.2)', textTransform: 'uppercase', fontWeight: 300 }}>
            {tx(t.footer.copy, lang)}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{ position: 'relative', zIndex: 1, background: 'var(--graphite)', borderTop: '1px solid rgba(248,247,245,.06)', padding: '36px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, letterSpacing: '.22em', color: 'var(--off-white)' }}>
            Н<span style={{ color: 'var(--orange)' }}>Е</span>О
          </span>
          <span style={{ fontSize: 11, color: 'rgba(248,247,245,.25)', letterSpacing: '.12em' }}></span>
        </div>
        <p style={{ fontSize: 11, letterSpacing: '.12em', color: 'rgba(248,247,245,.25)', textTransform: 'uppercase', fontWeight: 300 }}>
          {tx(t.footer.copy, lang)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <ul style={{ display: 'flex', gap: 28, listStyle: 'none' }}>
            {navLinks.map((l) => (
              <li key={l.href}><a href={l.href} className="footer-link">{l.label}</a></li>
            ))}
          </ul>
          <div style={{ width: 1, height: 18, background: 'rgba(248,247,245,.1)' }} />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} style={{ color: 'rgba(248,247,245,.3)', display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'color .25s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--orange)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(248,247,245,.3)'; }}>
                <Icon size={16} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
