import SiteProvider from './context/SiteProvider';
import FloodLayer from './components/FloodLayer';
import CameraPepper from './components/CameraPepper';
import Cursor from './components/Cursor';
import Header from './components/Header';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import Services from './sections/Services';
import Work from './sections/Work';
import Process from './sections/Process';
import Playground from './sections/Playground';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  return (
    <SiteProvider>
      <a className="skip-link" href="#studio">
        Skip to content
      </a>
      <FloodLayer />
      <Header />
      <main className="page">
        <Hero />
        <Manifesto />
        <Services />
        <Work />
        <Process />
        <Playground />
        <Contact />
      </main>
      <Footer />
      <CameraPepper />
      <Cursor />
    </SiteProvider>
  );
}
