import { NEW_007_NAME } from './config';

export interface Reveal {
  name: string;
  birthDate: string;
  country: string;
  announcedOn: string;
}

function env(key: string): string {
  return String(import.meta.env[key] ?? '').trim();
}

export const REVEAL: Reveal | null = NEW_007_NAME
  ? {
      name: NEW_007_NAME,
      birthDate: env('VITE_NEW_007_BIRTHDATE'),
      country: env('VITE_NEW_007_COUNTRY'),
      announcedOn: env('VITE_NEW_007_ANNOUNCED'),
    }
  : null;

export function ageOn(birthDate: string, today: Date): number | null {
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const hadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  return today.getFullYear() - birth.getFullYear() - (hadBirthday ? 0 : 1);
}

export function countryName(code: string, language: string): string {
  if (!code) return '';
  try {
    return new Intl.DisplayNames([language], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function formatDate(isoDate: string, language: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(language, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
