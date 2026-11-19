import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import { DrNoBust, JamaicaScene } from '../../art/JamaicaScene';
import { MoneypennyRadio } from '../../components/MoneypennyRadio';
import { QUESTION_COUNT, QUESTIONS } from '../../stops/jamaica/rules';
import { GamePanel } from '../GamePanel';
import { StopOpening } from '../StopOpening';

const SHOWN = QUESTIONS[0] ?? { id: 'doubleO', card: 'who', correct: 0 };

export function JamaicaSection() {
  const { t } = useTranslation('jamaica');
  const options = t(`questions.${SHOWN.id}.options`, { returnObjects: true });

  return (
    <>
      <StopOpening
        stop="jamaica"
        copy={{
          eyebrow: t('eyebrow'),
          titleStart: t('titleStart'),
          titleEm: t('titleEm'),
          theme: t('theme'),
        }}
        scene={<JamaicaScene label={t('sceneLabel')} />}
        voice={<MoneypennyRadio>{`"${t('opening')}"`}</MoneypennyRadio>}
        build={(timeline) => {
          timeline
            .from('[data-sun]', { y: 60, opacity: 0, duration: 1, ease: 'power2.out' }, 0)
            .from('[data-island]', { x: 40, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.5)
            .from('[data-palm]', { x: -60, duration: 0.8, ease: 'power3.out' }, 0.5)
            .from('[data-dr-no]', { opacity: 0, duration: 1, ease: 'sine.inOut' }, 1.1);
          gsap.to('[data-palm]', {
            rotation: 2,
            transformOrigin: '40px 300px',
            duration: 2.4,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
          });
        }}
      />
      <GamePanel
        game="jamaica"
        cardId="birthplace"
        build={(timeline) => {
          timeline
            .from('[data-option]', { opacity: 0, x: -30, duration: 0.4, stagger: 0.12 }, 0.3)
            .to(
              '[data-option="right"]',
              { backgroundColor: '#1fb5b0', borderColor: '#1fb5b0', color: '#0b0b0c', duration: 0.25 },
              '+=0.5',
            )
            .from('[data-option="right"] [data-tag]', { opacity: 0, duration: 0.2 }, '<')
            .from('[data-dot="current"]', { backgroundColor: '#2e5554', duration: 0.25 }, '<');
        }}
      >
        <div className="trivia__hud bf-hud">
          <span>{t('progress', { n: 1, total: QUESTION_COUNT })}</span>
          <span className="trivia__dots" aria-hidden="true">
            {QUESTIONS.slice(0, QUESTION_COUNT).map((question, i) => (
              <span
                key={question.id}
                className={i === 0 ? 'trivia__dot is-done' : 'trivia__dot'}
                data-dot={i === 0 ? 'current' : undefined}
              />
            ))}
          </span>
        </div>
        <div className="trivia__speaker">
          <DrNoBust />
          <p>{`"${t('drNoLine')}"`}</p>
        </div>
        <h2 className="display trivia__prompt bf-prompt">{t(`questions.${SHOWN.id}.prompt`)}</h2>
        <ul className="bf-list">
          {options.map((option, i) => (
            <li key={option} className="trivia__option" data-option={i === SHOWN.correct ? 'right' : 'other'}>
              <span>{option}</span>
              {i === SHOWN.correct && (
                <span className="trivia__tag" data-tag>
                  {t('correct')}
                </span>
              )}
            </li>
          ))}
        </ul>
        <MoneypennyRadio>{`"${t('clean')}"`}</MoneypennyRadio>
      </GamePanel>
    </>
  );
}
