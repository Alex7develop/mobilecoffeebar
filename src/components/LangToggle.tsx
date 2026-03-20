import { useDispatch, useSelector } from 'react-redux';
import { setLang } from '../store/slices/uiSlice';
import type { RootState } from '../store';
export function LangToggle() {
  const dispatch = useDispatch();
  const lang = useSelector((s: RootState) => s.ui.lang);

  return (
    <div style={{ position: 'fixed', top: 28, right: 48, zIndex: 200, display: 'flex', border: '1px solid var(--graphite-line)' }}>
      <button type="button" className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => dispatch(setLang('ru'))}>РУ</button>
      <button type="button" className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => dispatch(setLang('en'))}>EN</button>
    </div>
  );
}
