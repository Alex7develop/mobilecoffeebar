import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, select, input, textarea, label, [role="button"]';

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const mx = useRef(0);
  const my = useRef(0);
  const rx = useRef(0);
  const ry = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${mx.current - 4}px,${my.current - 4}px)`;
      }
    };

    const animate = () => {
      rx.current += (mx.current - rx.current) * 0.1;
      ry.current += (my.current - ry.current) * 0.1;
      if (ring.current) {
        ring.current.style.transform = `translate(${rx.current - 15}px,${ry.current - 15}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Event delegation — работает и для динамически добавляемых элементов
  useEffect(() => {
    const expand = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) {
        ring.current?.classList.add('expand');
      }
    };
    const shrink = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) {
        ring.current?.classList.remove('expand');
      }
    };
    document.addEventListener('mouseover', expand, { passive: true });
    document.addEventListener('mouseout', shrink, { passive: true });
    return () => {
      document.removeEventListener('mouseover', expand);
      document.removeEventListener('mouseout', shrink);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor" id="cursor" aria-hidden />
      <div ref={ring} className="cursor-ring" id="cursorRing" aria-hidden />
    </>
  );
}
