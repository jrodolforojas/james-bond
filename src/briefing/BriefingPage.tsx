import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../screens/Arrival/arrival.css';
import '../stops/london/london.css';
import '../stops/montenegro/montenegro.css';
import '../stops/fortknox/fortknox.css';
import '../stops/scotland/scotland.css';
import '../stops/jamaica/jamaica.css';
import '../screens/Final/final.css';
import '../dossier/dossier.css';
import './briefing.css';
import { ArrivalSection } from './sections/ArrivalSection';
import { FinalSection } from './sections/FinalSection';
import { FortKnoxSection } from './sections/FortKnoxSection';
import { JamaicaSection } from './sections/JamaicaSection';
import { LondonSection } from './sections/LondonSection';
import { MontenegroSection } from './sections/MontenegroSection';
import { RecruitmentSection } from './sections/RecruitmentSection';
import { ScotlandSection } from './sections/ScotlandSection';

gsap.registerPlugin(ScrollTrigger);

export function BriefingPage() {
  const { t, i18n } = useTranslation('briefing');
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = t('pageTitle');
  }, [t]);

  useGSAP(
    () => {
      gsap.to('[data-progress]', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });
    },
    { scope },
  );

  return (
    <div className="bf" ref={scope} key={i18n.language}>
      <div className="bf-progress" data-progress aria-hidden="true" />
      <main>
        <ArrivalSection />
        <RecruitmentSection />
        <LondonSection />
        <MontenegroSection />
        <FortKnoxSection />
        <ScotlandSection />
        <JamaicaSection />
        <FinalSection />
      </main>
    </div>
  );
}
