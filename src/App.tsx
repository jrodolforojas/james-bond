import { LanguageSwitch } from './components/LanguageSwitch';
import { LegalFooter } from './components/LegalFooter';
import { FlowRouter } from './flow/FlowRouter';

export function App() {
  return (
    <div className="app">
      <div className="column">
        <LanguageSwitch />
        <FlowRouter />
        <LegalFooter />
      </div>
    </div>
  );
}
