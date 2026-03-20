import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideIntro, setIntroSwipeStarted } from '../store/slices/uiSlice';
import type { RootState } from '../store';
import { useIsMobile } from '../hooks/useIsMobile';

/* ── Текст по строкам ── */
const LINES_RU: string[] = ['ЭСТЕТИКА.', 'ТЕХНОЛОГИЯ.','СЕРВИС.'];
const LINES_EN: string[] = ['NEO —', 'EXPERIENCE,', 'BUILT ON', 'THE MATRIX', 'OF AESTHETICS!'];

const CYRILLIC = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯ';
const LATIN    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const SCRAMBLE_TICK_MS  = 45;   // скорость мигания случайных букв
const TOTAL_RESOLVE_MS  = 2000; // суммарное время фиксации всех букв
const POST_PAUSE_MS     = 900;  // пауза после финальной буквы
const SWIPE_DURATION_MS = 1300; // длительность подъёма

function rand(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)];
}

export function IntroScreen() {
  const dispatch = useDispatch();
  const visible  = useSelector((s: RootState) => s.ui.introVisible);
  const lang     = useSelector((s: RootState) => s.ui.lang);
  const isMobile = useIsMobile();

  const lines   = lang === 'en' ? LINES_EN : LINES_RU;
  const charset = lang === 'en' ? LATIN    : CYRILLIC;

  /* helpers — вызываются при монтировании один раз */
  const makeCells  = (ls: string[]) => ls.map(l => l.split('').map(ch => ch === ' ' ? ' ' : rand(charset)));
  const makeLocked = (ls: string[]) => ls.map(l => l.split('').map(ch => ch === ' '));

  const [cells, setCells] = useState<string[][]>(() => makeCells(lines));
  const [phase, setPhase] = useState<'scramble' | 'swipe'>('scramble');
  const [swipeOn, setSwipeOn] = useState(false);

  const lockedRef  = useRef<boolean[][]>(makeLocked(lines));
  const panelRef   = useRef<HTMLDivElement>(null);
  const burstDone  = useRef(false);

  /* ── 1. Быстрое мигание случайных символов ── */
  useEffect(() => {
    const id = setInterval(() => {
      setCells(prev =>
        prev.map((row, li) =>
          row.map((_, ci) => {
            if (lockedRef.current[li]?.[ci]) return lines[li][ci];
            if (lines[li][ci] === ' ') return ' ';
            return rand(charset);
          })
        )
      );
    }, SCRAMBLE_TICK_MS);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── 2. Последовательная фиксация букв слева направо ── */
  useEffect(() => {
    const positions: [number, number][] = [];
    lines.forEach((line, li) =>
      line.split('').forEach((ch, ci) => {
        if (ch !== ' ') positions.push([li, ci]);
      })
    );
    if (positions.length === 0) return;

    const step = TOTAL_RESOLVE_MS / positions.length;
    const timers = positions.map(([li, ci], idx) =>
      setTimeout(() => {
        lockedRef.current[li][ci] = true;
        setCells(prev => {
          const next = prev.map(r => [...r]);
          next[li][ci] = lines[li][ci];
          return next;
        });
        if (idx === positions.length - 1) {
          setTimeout(() => setPhase('swipe'), POST_PAUSE_MS);
        }
      }, idx * step)
    );
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── 3. Запуск подъёма ── */
  useEffect(() => {
    if (phase !== 'swipe') return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setSwipeOn(true);
        dispatch(setIntroSwipeStarted(true));
      })
    );
    return () => cancelAnimationFrame(id);
  }, [phase, dispatch]);

  /* ── 4. Скрыть после окончания transition ── */
  const finish = useCallback(() => {
    if (burstDone.current) return;
    burstDone.current = true;
    dispatch(hideIntro());
  }, [dispatch]);

  useEffect(() => {
    if (phase !== 'swipe' || !swipeOn || !panelRef.current) return;
    const el = panelRef.current;
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'transform') return;
      el.removeEventListener('transitionend', onEnd);
      finish();
    };
    el.addEventListener('transitionend', onEnd);
    return () => el.removeEventListener('transitionend', onEnd);
  }, [phase, swipeOn, finish]);

  /* ── Skip ── */
  const skip = () => {
    if (burstDone.current) return;
    lines.forEach((line, li) =>
      line.split('').forEach((_, ci) => { lockedRef.current[li][ci] = true; })
    );
    setCells(lines.map(l => l.split('')));
    setTimeout(() => setPhase('swipe'), 200);
  };

  /* ── Размер шрифта: подстраиваем под самую длинную строку ── */
  const maxLen    = Math.max(...lines.map(l => l.length));
  // Montserrat 900 uppercase ~ 0.72 × fontSize per char (с учётом реальных пропорций)
  const vwDesktop = (66 / (maxLen * 0.72)).toFixed(1);
  const vwMobile  = (60 / (maxLen * 0.72)).toFixed(1);
  const fsDesktop = `clamp(40px, ${vwDesktop}vw, 150px)`;
  const fsMobile  = `clamp(22px, ${vwMobile}vw, 68px)`;
  const fontSize  = isMobile ? fsMobile : fsDesktop;

  if (!visible && !swipeOn) return null;

  return (
    <div
      ref={panelRef}
      id="introScreen"
      role="presentation"
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'var(--off-white)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: phase === 'swipe'
          ? `transform ${SWIPE_DURATION_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
          : 'none',
        transform: phase === 'swipe' && swipeOn ? 'translateY(-100%)' : 'translateY(0)',
        willChange: phase === 'swipe' ? 'transform' : 'auto',
      }}
    >
      {/* ── Буквы ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? '0.08em' : '0.06em',
          padding: isMobile ? '0 20px' : '0 80px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {cells.map((row, li) => (
          <div
            key={li}
            style={{
              display: 'flex',
              justifyContent: 'center',
              lineHeight: 0.87,
              overflow: 'visible',
            }}
          >
            {row.map((ch, ci) => (
              <span
                key={ci}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize,
                  fontWeight: 900,
                  color: '#E8520A',
                  letterSpacing: '-0.01em',
                  lineHeight: 0.9,
                  display: 'inline-block',
                  userSelect: 'none',
                }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* ── Пропустить ── */}
      <button
        type="button"
        onClick={skip}
        style={{
          position: 'absolute',
          bottom: isMobile ? 24 : 36,
          right: isMobile ? 24 : 48,
          fontSize: 9,
          letterSpacing: '.3em',
          textTransform: 'uppercase',
          color: 'rgba(42,42,42,.3)',
          border: 'none',
          background: 'transparent',
          fontFamily: 'Montserrat',
          cursor: 'pointer',
        }}
      >
        {lang === 'en' ? 'Skip' : 'Пропустить'}
      </button>
    </div>
  );
}
