import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DrNoBust } from '../../art/JamaicaScene';
import type { CardId } from '../../dossier/cards';
import { prefersReducedMotion } from '../../motion';
import { EjectorSeat } from '../../perks/EjectorSeat';
import '../../perks/perks.css';
import { answer, hintFor, QUESTION_COUNT, type Run, startRun } from './rules';

const REVEAL_SECONDS = 0.9;

interface InterrogationProps {
  unlocked: readonly CardId[];
  maxWrong: number;
  hints: number;
  onEject?: () => void;
  onPassed: () => void;
  onImpostor: () => void;
}

function optionState(option: number, picked: number | null, correct: number): '' | 'is-right' | 'is-wrong' {
  if (picked === null) return '';
  if (option === correct) return 'is-right';
  if (option === picked) return 'is-wrong';
  return '';
}

export function Interrogation({
  unlocked,
  maxWrong,
  hints,
  onEject,
  onPassed,
  onImpostor,
}: InterrogationProps) {
  const { t } = useTranslation('jamaica');
  const scope = useRef<HTMLElement>(null);
  const [run, setRun] = useState<Run>(() => startRun(unlocked, maxWrong));
  const [picked, setPicked] = useState<number | null>(null);
  const [hintsLeft, setHintsLeft] = useState(hints);
  const [hidden, setHidden] = useState<{ index: number; options: number[] }>({ index: -1, options: [] });
  const question = run.questions[run.index];

  useEffect(() => {
    if (run.status === 'passed') onPassed();
    if (run.status === 'impostor') onImpostor();
  }, [run.status, onPassed, onImpostor]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('[data-question]', { opacity: 0, x: 24, duration: 0.35, ease: 'power2.out' });
    },
    { scope, dependencies: [run.index] },
  );

  const { contextSafe } = useGSAP({ scope });

  const choose = contextSafe((option: number) => {
    if (picked !== null) return;
    setPicked(option);
    gsap.delayedCall(REVEAL_SECONDS, () => {
      setPicked(null);
      setRun((current) => answer(current, option));
    });
  });

  const revealHint = () => {
    if (!question || hintsLeft <= 0 || picked !== null || hidden.index === run.index) return;
    setHintsLeft((count) => count - 1);
    setHidden({ index: run.index, options: hintFor(question) });
  };

  if (!question) return null;
  const ruledOut = hidden.index === run.index ? hidden.options : [];
  const options = t(`questions.${question.id}.options`, { returnObjects: true }) as readonly string[];

  return (
    <main className="screen trivia" ref={scope}>
      <div className="trivia__hud">
        <span>{t('progress', { n: run.index + 1, total: QUESTION_COUNT })}</span>
        <span
          className="trivia__dots"
          role="img"
          aria-label={t('progressLabel', { n: run.index + 1, total: QUESTION_COUNT })}
        >
          {run.questions.map((q, i) => (
            <span
              key={q.id}
              className={`trivia__dot ${i < run.index ? 'is-done' : ''} ${i === run.index ? 'is-current' : ''}`}
            />
          ))}
        </span>
      </div>

      <div className="trivia__speaker">
        <DrNoBust />
        <p>
          <span className="sr-only">{t('drNo')}: </span>
          {`"${t('drNoLine')}"`}
        </p>
      </div>

      <div data-question style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <h1 className="display trivia__prompt">{t(`questions.${question.id}.prompt`)}</h1>
        <fieldset className="trivia__answers">
          <legend className="sr-only">{t('answers')}</legend>
          {options.map((option, index) => {
            const state = optionState(index, picked, question.correct);
            return (
              <button
                key={option}
                type="button"
                className={`trivia__option ${state}`}
                disabled={picked !== null || ruledOut.includes(index)}
                style={ruledOut.includes(index) ? { opacity: 0.25 } : undefined}
                aria-pressed={picked === index}
                onClick={() => choose(index)}
              >
                <span>{option}</span>
                <span className="trivia__tag" aria-live="polite">
                  {state === 'is-right' ? t('correct') : ''}
                  {state === 'is-wrong' ? t('false') : ''}
                </span>
              </button>
            );
          })}
        </fieldset>
      </div>

      {(hints > 0 || onEject) && (
        <div className="perk-bar">
          {hints > 0 && (
            <button
              type="button"
              className="perk-btn"
              style={{ color: 'var(--jamaica-turquoise)' }}
              aria-label={t('hintLabel')}
              disabled={hintsLeft <= 0 || picked !== null || hidden.index === run.index}
              onClick={revealHint}
            >
              {t('hint', { n: hintsLeft })}
            </button>
          )}
          {onEject && <EjectorSeat onEject={onEject} />}
        </div>
      )}

      <p className="trivia__rule">{t('rule', { count: maxWrong })}</p>
    </main>
  );
}
