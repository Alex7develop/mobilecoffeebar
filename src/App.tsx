import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import type { RootState } from './store';
import { Cursor } from './components/Cursor';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { IntroScreen } from './components/IntroScreen';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { VideoSection } from './components/VideoSection';
import { Manifesto } from './components/Manifesto';
import { About } from './components/About';
import { MenuSection } from './components/MenuSection';
import { EventDrink } from './components/EventDrink';
import { CalculatorSection } from './components/CalculatorSection';
import { PackagesSection } from './components/PackagesSection';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

const SWIPE_DURATION_MS = 1600;

function RevealObserver() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}

function MainContentWrapper() {
  const introSwipeStarted = useSelector((s: RootState) => s.ui.introSwipeStarted);
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        overflow: 'auto',
        transform: introSwipeStarted ? 'translateY(0)' : 'translateY(100%)',
        transition: introSwipeStarted ? `transform ${SWIPE_DURATION_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)` : 'none',
        willChange: introSwipeStarted ? 'transform' : 'auto',
      }}
    >
      <Nav />
      <main>
        <Hero />
        <VideoSection />
        <Manifesto />
        <div className="divider-line" />
        <About />
        <div className="divider-line" />
        <MenuSection />
        <EventDrink />
        <div className="divider-line" />
        <PackagesSection />
        <div className="divider-line" />
        <CalculatorSection />
        <Gallery />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <RevealObserver />
      <Cursor />
      <BackgroundCanvas />
      <IntroScreen />
      <MainContentWrapper />
    </Provider>
  );
}

export default App;
