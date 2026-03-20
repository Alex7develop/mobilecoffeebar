import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { toggleCalc } from '../store/slices/uiSlice';
import { setGuests, setHours, setEventDate, setEventType, setCity, toggleMilk, setOptDrink, setOptFunctional, setOptStandCustom, setOptMasterclass, setOptMoreMilks, setResult, hideResult } from '../store/slices/calcSlice';
import type { RootState } from '../store';
import { useRef, useEffect, useState } from 'react';
import { Phone, Send, X } from 'lucide-react';
import { t, tx } from '../app/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

function useBarista(guests: number, hours: number) {
  return Math.min(2, Math.max(1, Math.ceil((guests * 0.75) / (20 * hours))));
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: 'block', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--graphite-muted)', marginBottom: 10, fontWeight: 400 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--off-white)',
  border: 'none',
  borderBottom: '1.5px solid rgba(232,82,10,.25)',
  borderRadius: '8px 8px 0 0',
  padding: '14px 16px',
  fontFamily: 'Montserrat',
  fontSize: 13,
  color: 'var(--graphite)',
  outline: 'none',
  transition: 'border-color .3s',
  appearance: 'none' as const,
  boxSizing: 'border-box',
};

export function CalculatorSection() {
  const dispatch = useDispatch();
  const { calcOpen } = useSelector((s: RootState) => s.ui);
  const lang = useSelector((s: RootState) => s.ui.lang);
  const calc = useSelector((s: RootState) => s.calc);
  const isMobile = useIsMobile();
  const barista = useBarista(calc.guests, calc.hours);
  const c = t.calc;
  const signatureOptions = [
    'Матча',
    'Колд брю',
    'Фильтр кофе',
    'Комбуча',
    'Клитория',
    'Декаф',
    'Микролот',
    'Лимонады',
  ];
  const [modalOpen, setModalOpen] = useState(false);
  const [signatureSelected, setSignatureSelected] = useState<string[]>([]);

  const doCalculate = () => {
    const g = calc.guests;
    const h = calc.hours;

    // Выездной сбор по городу
    const cityMap: Record<string, { fee: number | null }> = {
      msk: { fee: 0 }, spb: { fee: 25000 }, ekb: { fee: null }, other: { fee: null },
    };
    const cl = cityMap[calc.city] ?? { fee: null };

    // Базовые пакеты (новые тарифы)
    let pkg = 'Студия', baseP = 100000, baseH = 4;
    if (g > 100) {
      pkg = 'Архитектура'; baseP = 350000; baseH = 8;
    } else if (g > 50) {
      pkg = 'Событие'; baseP = 200000; baseH = 5;
    }

    // Доплата за каждый час сверх базового
    const extH = Math.max(0, h - baseH);
    const hrRate = g <= 50 ? 20000 : g <= 100 ? 30000 : 45000;

    let price = baseP + extH * hrRate;
    if (calc.optDrink) price += 25000;        // авторский напиток события
    if (calc.optExtra) price += h * 20000;   // доп. бариста в час
    if (calc.optFunctional) price += 25000;  // функциональные напитки
    if (cl.fee) price += cl.fee;

    const priceStr = cl.fee === null ? tx(c.onRequest, lang) : price.toLocaleString('ru') + ' ₽';
    dispatch(setResult({ totalPrice: priceStr, recommendedPackage: pkg }));
    setModalOpen(true);
  };

  const guestsRef = useRef<HTMLInputElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);
  const styleRange = (el: HTMLInputElement) => {
    const v = ((Number(el.value) - Number(el.min)) / (Number(el.max) - Number(el.min))) * 100;
    el.style.background = `linear-gradient(to right, var(--orange) ${v}%, rgba(42,42,42,.12) ${v}%)`;
  };
  useEffect(() => {
    [guestsRef, hoursRef].forEach(r => r.current && styleRange(r.current));
  }, [calc.guests, calc.hours]);

  return (
    <section id="calcSection" style={{ position: 'relative', zIndex: 1, background: 'var(--off-white)', padding: isMobile ? '56px 20px' : '72px 40px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Триггер ── */}
        <button
          type="button"
          onClick={() => dispatch(toggleCalc())}
          style={{
            width: '100%',
            background: 'var(--white)',
            borderRadius: 0,
            padding: isMobile ? '20px 20px' : '28px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            cursor: 'pointer',
            border: 'none',
            borderBottom: calcOpen ? 'none' : '1px solid var(--graphite-line)',
            borderTop: '1px solid var(--graphite-line)',
            transition: 'border-color .3s',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <p style={{ fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 6, fontWeight: 500, alignSelf: 'flex-start' }}>
              {tx(c.overline, lang)}
            </p>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(32px,3.5vw,56px)', fontWeight: 300, color: 'var(--graphite)', lineHeight: 1 }}>
              {tx(c.heading1, lang)}<em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>{tx(c.heading2, lang)}</em>
            </div>
          </div>
          <div
            style={{
              width: isMobile ? 44 : 56, height: isMobile ? 44 : 56, borderRadius: '50%',
              background: calcOpen ? 'var(--graphite)' : 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'background .3s, transform .4s cubic-bezier(.34,1.56,.64,1)',
              transform: calcOpen ? 'rotate(45deg)' : 'rotate(0)',
            }}
          >
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </button>

        {/* ── Тело ── */}
        <div
          style={{
            overflow: 'hidden',
            maxHeight: calcOpen ? 3000 : 0,
            opacity: calcOpen ? 1 : 0,
            transition: 'max-height .8s cubic-bezier(.4,0,.2,1), opacity .5s ease',
          }}
        >
          <div
            style={{
              background: 'var(--white)',
              borderRadius: 0,
              padding: isMobile ? '28px 20px 32px' : '40px 40px 48px',
              borderBottom: '1px solid var(--graphite-line)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 56, marginBottom: 32 }}>

              {/* ЛЕВАЯ КОЛОНКА */}
              <div>
                <p style={{ fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 28, paddingBottom: 14, borderBottom: '1px solid rgba(232,82,10,.12)', fontWeight: 500 }}>
                  {tx(c.eventLabel, lang)}
                </p>

                <Field label={tx(c.dateLabel, lang)}>
                  <input type="date" value={calc.eventDate} onChange={e => dispatch(setEventDate(e.target.value))} style={inputStyle} />
                </Field>

                <Field label={tx(c.typeLabel, lang)}>
                  <select value={calc.eventType} onChange={e => dispatch(setEventType(e.target.value))} style={inputStyle}>
                    {Object.values(c.eventTypes).map((et, i) => (
                      <option key={i}>{tx(et, lang)}</option>
                    ))}
                  </select>
                </Field>

                <Field label={tx(c.guestsLabel, lang)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
                    <input ref={guestsRef} type="range" min={20} max={300} value={calc.guests} step={5}
                      onChange={e => { dispatch(setGuests(Number(e.target.value))); styleRange(e.target); }}
                      style={{ flex: 1, height: 3, appearance: 'none', borderRadius: 8, outline: 'none', cursor: 'pointer' }} />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 34 : 42, fontWeight: 300, color: 'var(--orange)', minWidth: 60, textAlign: 'right', lineHeight: 1 }}>{calc.guests}</span>
                  </div>
                </Field>

                <Field label={tx(c.hoursLabel, lang)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
                    <input ref={hoursRef} type="range" min={2} max={10} value={calc.hours} step={1}
                      onChange={e => { dispatch(setHours(Number(e.target.value))); styleRange(e.target); }}
                      style={{ flex: 1, height: 3, appearance: 'none', borderRadius: 8, outline: 'none', cursor: 'pointer' }} />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 34 : 42, fontWeight: 300, color: 'var(--orange)', minWidth: 60, textAlign: 'right', lineHeight: 1 }}>{calc.hours}</span>
                  </div>
                </Field>

                <Field label={tx(c.baristaLabel, lang)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1, 2].map(i => (
                        <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid', backgroundColor: i <= barista ? 'var(--orange)' : 'transparent', borderColor: i <= barista ? 'var(--orange)' : 'rgba(232,82,10,.25)', transition: 'all .3s', boxShadow: i <= barista ? '0 0 8px rgba(232,82,10,.4)' : 'none' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--graphite-muted)' }}>{barista} {tx(c.baristaUnit, lang)}</span>
                  </div>
                </Field>

                <Field label={tx(c.cityLabel, lang)}>
                  <select value={calc.city} onChange={e => dispatch(setCity(e.target.value))} style={inputStyle}>
                    {Object.entries(c.cities).map(([val, label]) => (
                      <option key={val} value={val}>{tx(label, lang)}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* ПРАВАЯ КОЛОНКА */}
              <div>
                <p style={{ fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 28, paddingBottom: 14, borderBottom: '1px solid rgba(232,82,10,.12)', fontWeight: 500 }}>
                  {tx(c.milkLabel, lang)}
                </p>

                <Field label={tx(c.milkSelectLabel, lang)}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 8, marginTop: 8 }}>
                    {t.milkTypes.map(m => {
                      const checked = calc.selectedMilk.includes(m.id);
                      const disabled = calc.selectedMilk.length >= 4 && !checked && !calc.optMoreMilks;
                      return (
                        <div
                          key={m.id}
                          onClick={() => !disabled && dispatch(toggleMilk(m.id))}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 0,
                            border: `1.5px solid ${checked ? 'var(--orange)' : 'rgba(42,42,42,.12)'}`,
                            background: checked ? 'rgba(232,82,10,.06)' : 'var(--white)',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            opacity: disabled ? 0.3 : 1,
                            transition: 'border-color .25s, background .25s, opacity .25s',
                            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: checked ? 'var(--orange)' : 'var(--graphite-muted)', fontWeight: checked ? 500 : 300, lineHeight: 1.3, transition: 'color .25s' }}>
                            {tx(m, lang)}
                          </span>
                          <div style={{
                            flexShrink: 0,
                            width: 14, height: 14, borderRadius: '50%',
                            background: checked ? 'var(--orange)' : 'transparent',
                            border: `1px solid ${checked ? 'var(--orange)' : 'rgba(42,42,42,.2)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all .2s',
                          }}>
                            {checked && (
                              <svg width={8} height={8} viewBox="0 0 8 8" fill="none">
                                <polyline points="1.5,4 3.2,6 6.5,2" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {!calc.optMoreMilks && calc.selectedMilk.length >= 4 && (
                    <p style={{ fontSize: 11, color: 'var(--orange)', marginTop: 12, letterSpacing: '.08em', fontWeight: 400 }}>{tx(c.milkMax, lang)}</p>
                  )}
                </Field>

                {/* Дополнительные позиции */}
                <div style={{ marginTop: 24 }}>
                  <p style={{ fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--graphite-muted)', marginBottom: 12, fontWeight: 400 }}>
                    дополнительные позиции
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 8 }}>
                    {signatureOptions.map(name => {
                      const checked = signatureSelected.includes(name);
                      return (
                        <div
                          key={name}
                          onClick={() => {
                            setSignatureSelected(prev =>
                              prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
                            );
                          }}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 0,
                            border: `1.5px solid ${checked ? 'var(--orange)' : 'rgba(42,42,42,.12)'}`,
                            background: checked ? 'rgba(232,82,10,.06)' : 'var(--white)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                            fontSize: 11,
                            letterSpacing: '.1em',
                            textTransform: 'uppercase',
                            color: checked ? 'var(--orange)' : 'var(--graphite-muted)',
                            fontWeight: checked ? 500 : 300,
                            cursor: 'pointer',
                            transition: 'border-color .25s, background .25s, color .25s',
                          }}
                        >
                          <span>{name}</span>
                          <div style={{
                            flexShrink: 0,
                            width: 14, height: 14, borderRadius: '50%',
                            background: checked ? 'var(--orange)' : 'transparent',
                            border: `1px solid ${checked ? 'var(--orange)' : 'rgba(42,42,42,.2)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all .2s',
                          }}
                          >
                            {checked && (
                              <svg width={8} height={8} viewBox="0 0 8 8" fill="none">
                                <polyline points="1.5,4 3.2,6 6.5,2" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginTop: 28, padding: isMobile ? '20px 20px' : '28px 32px', background: 'var(--off-white)', borderRadius: 0, border: '1px solid var(--graphite-line)' }}>
                  <p style={{ fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--graphite-muted)', marginBottom: 18, fontWeight: 400 }}>{tx(c.extraLabel, lang)}</p>
                  {[
                    { id: 'optDrink',       label: tx(c.optDrink, lang),       note: tx(c.optDrinkNote, lang),       checked: calc.optDrink,       onChange: (v: boolean) => dispatch(setOptDrink(v)) },
                    { id: 'optFunctional',  label: tx(c.optFunctional, lang),  note: tx(c.optFunctionalNote, lang),  checked: calc.optFunctional,  onChange: (v: boolean) => dispatch(setOptFunctional(v)) },
                    { id: 'optStandCustom', label: tx(c.optStandCustom, lang), note: tx(c.optStandCustomNote, lang), checked: calc.optStandCustom, onChange: (v: boolean) => dispatch(setOptStandCustom(v)) },
                    { id: 'optMasterclass', label: tx(c.optMasterclass, lang), note: tx(c.optMasterclassNote, lang), checked: calc.optMasterclass, onChange: (v: boolean) => dispatch(setOptMasterclass(v)) },
                    { id: 'optMoreMilks',   label: tx(c.optMoreMilks, lang),   note: tx(c.optMoreMilksNote, lang),   checked: calc.optMoreMilks,   onChange: (v: boolean) => dispatch(setOptMoreMilks(v)) },
                  ].map(opt => (
                    <label key={opt.id} style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 12 }}>
                        <div
                          onClick={() => opt.onChange(!opt.checked)}
                          style={{ width: 20, height: 20, borderRadius: 0, border: `1.5px solid ${opt.checked ? 'var(--orange)' : 'rgba(42,42,42,.2)'}`, background: opt.checked ? 'var(--orange)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .25s', flexShrink: 0, marginTop: isMobile ? 2 : 0 }}
                        >
                          {opt.checked && <svg width={12} height={12} viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </div>
                        <span style={{ fontSize: isMobile ? 11 : 12, color: 'var(--graphite)', fontWeight: 300, lineHeight: 1.25, display: 'block' }}>{opt.label}</span>
                      </div>
                      {opt.note ? (
                        <span style={{ fontSize: 11, color: 'var(--orange)', letterSpacing: '.05em', whiteSpace: 'nowrap', flexShrink: 0, lineHeight: 1.2 }}>{opt.note}</span>
                      ) : null}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Кнопка расчёта */}
            <button
              type="button"
              onClick={doCalculate}
              style={{
                width: '100%', padding: isMobile ? '20px' : '24px 32px',
                background: 'var(--orange)', color: 'var(--white)',
                border: 'none', fontFamily: 'Montserrat', fontSize: 10, letterSpacing: '.38em', textTransform: 'uppercase',
                cursor: 'pointer', borderRadius: 0,
                transition: 'background .3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--graphite)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--orange)'; }}
            >
              <span>{tx(c.calculateBtn, lang)}</span>
            </button>

          </div>
        </div>
      </div>

      {/* ── Модальное окно с результатом (портал вне MainContentWrapper) ── */}
      {modalOpen && calc.resultVisible && createPortal(
        <div
          onClick={() => { setModalOpen(false); dispatch(hideResult()); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 15000,
            background: 'rgba(10,10,10,.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '20px 16px' : '32px',
            animation: 'fadeUp .35s ease both',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--white)',
              maxWidth: isMobile ? '100%' : 560,
              width: '100%',
              padding: isMobile ? '36px 24px 32px' : '52px 52px 44px',
              position: 'relative',
            }}
          >
            {/* Закрыть */}
            <button
              type="button"
              onClick={() => { setModalOpen(false); dispatch(hideResult()); }}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--graphite-muted)', padding: 4, display: 'flex' }}
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Оверлайн */}
            <p style={{ fontSize: 10, letterSpacing: '.4em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 12, fontWeight: 500 }}>
              {tx(c.resultLabel, lang)}
            </p>

            {/* Рекомендуемый пакет */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 38 : 52, fontWeight: 300, color: 'var(--graphite)', lineHeight: 1, marginBottom: 4 }}>
                {calc.recommendedPackage}
              </div>
              <div style={{ fontSize: 12, color: 'var(--graphite-muted)', letterSpacing: '.12em', fontWeight: 300 }}>
                {calc.guests} {lang === 'ru' ? 'гостей' : 'guests'} · {calc.hours} {lang === 'ru' ? 'ч' : 'h'} · {barista} {tx(c.baristaUnit, lang)}
              </div>
            </div>

            {/* Примечание */}
            <p style={{ fontSize: 11, color: 'var(--graphite-muted)', lineHeight: 1.9, marginBottom: 28, fontWeight: 300 }}>
              {lang === 'ru'
                ? 'Финальная стоимость подтверждается после брифинга. Свяжитесь с нами — обсудим детали вашего события.'
                : 'Final cost confirmed after briefing. Contact us to discuss your event details.'}
            </p>

            {/* Кнопки */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10 }}>
              <a
                href="tel:+79031168911"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '17px 20px',
                  border: '1px solid var(--orange)', color: 'var(--orange)',
                  textDecoration: 'none', fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase', fontWeight: 500,
                  transition: 'background .25s, color .25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--orange)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--white)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--orange)'; }}
              >
                <Phone size={14} strokeWidth={1.5} />
                <span>{lang === 'ru' ? 'Позвонить' : 'Call us'}</span>
              </a>
              <a
                href="https://t.me/+79031168911"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '17px 20px',
                  background: 'var(--orange)', color: 'var(--white)',
                  textDecoration: 'none', fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase', fontWeight: 500,
                  transition: 'background .25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--graphite)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--orange)'; }}
              >
                <Send size={14} strokeWidth={1.5} />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
