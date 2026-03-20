import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from '../store/slices/uiSlice';
import type { RootState } from '../store';
import { Plus, Minus, Coffee } from 'lucide-react';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';
import { useState } from 'react';

export function MenuSection() {
  const dispatch = useDispatch();
  const open = useSelector((s: RootState) => s.ui.menuOpen);
  const lang = useSelector((s: RootState) => s.ui.lang);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'bar' | 'services'>('bar');

  return (
    <section id="menu" style={{ position: 'relative', zIndex: 1, padding: isMobile ? '56px 20px' : '88px 48px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16, borderBottom: '1px solid var(--graphite-line)', paddingBottom: 16, marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 'clamp(32px, 9vw, 52px)' : 'clamp(42px, 4.6vw, 72px)', fontWeight: 300, textTransform: 'uppercase', lineHeight: 1.05 }}>
              {tx(t.menu.heading1, lang)}<span style={{ color: 'var(--orange)' }}>{tx(t.menu.heading2, lang)}</span>
            </h2>
            {!isMobile && (
              <span style={{ fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--graphite-muted)', fontWeight: 400 }}>
                {tx(t.menu.overline, lang)}
              </span>
            )}
          </div>
          <div style={{ display: 'inline-flex', alignSelf: 'flex-start', borderRadius: 999, border: '1px solid var(--graphite-line)', padding: 3, background: 'rgba(248,247,245,0.9)', gap: 3 }}>
            {(['bar', 'services'] as const).map(tab => {
              const active = activeTab === tab;
              const label = tab === 'bar' ? tx(t.menu.tabs.bar, lang) : tx(t.menu.tabs.services, lang);
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    padding: isMobile ? '6px 14px' : '7px 18px',
                    borderRadius: 999,
                    fontSize: 12,
                    letterSpacing: '.16em',
                    textTransform: 'uppercase',
                    fontWeight: active ? 500 : 400,
                    background: active ? 'var(--graphite)' : 'transparent',
                    color: active ? 'var(--off-white)' : 'var(--graphite)',
                    transition: 'background .25s, color .25s',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => dispatch(toggleMenu())}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer', border: 'none', background: 'none', padding: '14px 0', borderBottom: '1px solid var(--graphite-line)' }}
        >
          <span style={{ fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', color: open ? 'var(--orange)' : 'var(--graphite-muted)', fontWeight: 400, transition: 'color .25s' }}>
            {open ? tx(t.menu.hide, lang) : tx(t.menu.show, lang)}
          </span>
          <div style={{ width: 38, height: 38, border: `1px solid ${open ? 'var(--orange)' : 'var(--graphite-line)'}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: open ? 'var(--orange)' : 'var(--graphite-muted)', transition: 'border-color .25s, color .25s' }}>
            {open ? <Minus size={16} /> : <Plus size={16} />}
          </div>
        </button>

        {open && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 14 : 15, fontStyle: 'italic', color: 'rgba(42,42,42,.55)', lineHeight: 1.7, margin: '12px 0 0', maxWidth: 760 }}>
            <span style={{ whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
              {tx(t.menu.classicNoteLine1, lang)} {tx(t.menu.classicNoteLine2, lang)}
            </span>
          </p>
        )}

        <div style={{ overflow: 'hidden', maxHeight: open ? 1200 : 0, opacity: open ? 1 : 0, transition: 'max-height .65s cubic-bezier(.4,0,.2,1), opacity .4s ease' }}>
          {activeTab === 'bar' ? (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 2, background: 'var(--graphite-line)', marginTop: 2 }}>
              {t.menuItems.map((item, i) => (
                <div key={i} className="menu-card" style={{ background: 'var(--white)', padding: isMobile ? '20px 16px' : '28px 24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Coffee size={15} color="var(--orange)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 18 : 20, fontWeight: 400, lineHeight: 1.2 }}>
                      {tx(item.name, lang)}
                    </div>
                  </div>
                  <div style={{ fontSize: isMobile ? 13 : 13, color: 'var(--graphite-muted)', lineHeight: 1.85, fontWeight: 300 }}>
                    {tx(item.desc, lang)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'var(--white)', marginTop: 2, padding: isMobile ? '24px 18px' : '32px 32px', border: '1px solid var(--graphite-line)', borderRadius: 0 }}>
              <p style={{ fontSize: 12, letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--graphite-muted)', marginBottom: 14, fontWeight: 400 }}>
                {tx(t.menu.tabs.services, lang)}
              </p>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 24 : 30, fontWeight: 400, marginBottom: 12, color: 'var(--graphite)' }}>
                {tx(t.menu.servicesTitle, lang)}
              </h3>
              <p style={{ fontSize: isMobile ? 14 : 14, lineHeight: 1.9, color: 'var(--graphite-muted)', maxWidth: 640, fontWeight: 300 }}>
                {tx(t.menu.servicesBody, lang)}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
