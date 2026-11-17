import '@fontsource/bodoni-moda/500.css';
import '@fontsource/bodoni-moda/500-italic.css';
import '@fontsource/bodoni-moda/600.css';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/400-italic.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource/special-elite/400.css';
import './styles/tokens.css';
import './styles/global.css';
import './components/components.css';
import './i18n';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

gsap.registerPlugin(useGSAP);

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
