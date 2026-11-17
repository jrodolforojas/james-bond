import { describe, expect, it } from 'vitest';
import { CARD_IDS } from '../../dossier/cards';
import { answer, MAX_WRONG, OPTION_COUNT, pickQuestions, QUESTION_COUNT, QUESTIONS, startRun } from './rules';

const ALL_CARDS = [...CARD_IDS];

function answerAll(run: ReturnType<typeof startRun>, correct: boolean) {
  return run.questions.reduce((state, question) => {
    const option = correct ? question.correct : (question.correct + 1) % OPTION_COUNT;
    return answer(state, option);
  }, run);
}

describe('Jamaica question pool', () => {
  it('asks the five questions from the storyboard when every card is unlocked', () => {
    expect(pickQuestions(ALL_CARDS).map((q) => q.id)).toEqual([
      'doubleO',
      'betrayal',
      'clock',
      'whiteCat',
      'childhood',
    ]);
  });

  it('prefers questions about cards the player has unlocked', () => {
    const picked = pickQuestions(['eras', 'who', 'firstBook', 'villains']);
    expect(picked).toHaveLength(QUESTION_COUNT);
    expect(picked.every((q) => q.card !== 'origin')).toBe(true);
  });

  it('always has a valid correct option', () => {
    QUESTIONS.forEach((question) => {
      expect(question.correct).toBeGreaterThanOrEqual(0);
      expect(question.correct).toBeLessThan(OPTION_COUNT);
    });
  });
});

describe('Jamaica interrogation', () => {
  it('passes with every answer right', () => {
    expect(answerAll(startRun(ALL_CARDS), true).status).toBe('passed');
  });

  it('allows a single mistake', () => {
    const run = startRun(ALL_CARDS);
    const first = run.questions[0];
    const afterMistake = answer(run, ((first?.correct ?? 0) + 1) % OPTION_COUNT);
    const finished = afterMistake.questions
      .slice(1)
      .reduce((state, question) => answer(state, question.correct), afterMistake);
    expect(finished.status).toBe('passed');
    expect(finished.wrong).toBe(1);
  });

  it(`calls the player an impostor after ${MAX_WRONG} mistakes`, () => {
    const run = answerAll(startRun(ALL_CARDS), false);
    expect(run.status).toBe('impostor');
    expect(run.index).toBe(MAX_WRONG - 1);
  });

  it('ignores answers once the run is over', () => {
    const over = answerAll(startRun(ALL_CARDS), false);
    expect(answer(over, 0)).toBe(over);
  });
});
