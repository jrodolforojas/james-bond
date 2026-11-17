import type { CardId } from '../../dossier/cards';

export const QUESTION_COUNT = 5;
export const MAX_WRONG = 2;
export const OPTION_COUNT = 4;

export const QUESTION_IDS = [
  'doubleO',
  'betrayal',
  'clock',
  'whiteCat',
  'childhood',
  'martini',
  'firstNovel',
  'films',
  'scottish',
  'firstActor',
] as const;
export type QuestionId = (typeof QUESTION_IDS)[number];

export interface Question {
  id: QuestionId;
  card: CardId;
  correct: number;
}

export const QUESTIONS: readonly Question[] = [
  { id: 'doubleO', card: 'who', correct: 0 },
  { id: 'betrayal', card: 'firstBook', correct: 2 },
  { id: 'clock', card: 'villains', correct: 1 },
  { id: 'whiteCat', card: 'villains', correct: 3 },
  { id: 'childhood', card: 'origin', correct: 0 },
  { id: 'martini', card: 'who', correct: 1 },
  { id: 'firstNovel', card: 'firstBook', correct: 2 },
  { id: 'films', card: 'eras', correct: 3 },
  { id: 'scottish', card: 'origin', correct: 0 },
  { id: 'firstActor', card: 'eras', correct: 1 },
];

export function pickQuestions(unlocked: readonly CardId[]): Question[] {
  const available = QUESTIONS.filter((question) => unlocked.includes(question.card));
  const fallback = QUESTIONS.filter((question) => !unlocked.includes(question.card));
  return [...available, ...fallback].slice(0, QUESTION_COUNT);
}

export type RunStatus = 'asking' | 'passed' | 'impostor';

export interface Run {
  questions: Question[];
  index: number;
  wrong: number;
  maxWrong: number;
  status: RunStatus;
}

export function startRun(unlocked: readonly CardId[], maxWrong = MAX_WRONG): Run {
  return { questions: pickQuestions(unlocked), index: 0, wrong: 0, maxWrong, status: 'asking' };
}

export function hintFor(question: Question, random: () => number = Math.random): number[] {
  const wrong = Array.from({ length: OPTION_COUNT }, (_, i) => i).filter((i) => i !== question.correct);
  const keep = wrong[Math.floor(random() * wrong.length)];
  return wrong.filter((i) => i !== keep);
}

export function answer(run: Run, option: number): Run {
  if (run.status !== 'asking') return run;
  const question = run.questions[run.index];
  if (!question) return run;
  const wrong = run.wrong + (option === question.correct ? 0 : 1);
  if (wrong >= run.maxWrong) return { ...run, wrong, status: 'impostor' };
  const index = run.index + 1;
  if (index >= run.questions.length) return { ...run, wrong, index, status: 'passed' };
  return { ...run, wrong, index };
}
