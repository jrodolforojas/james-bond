import { describe, expect, it } from 'vitest';
import { ageOn, countryName, formatDate, licenseUrl } from './reveal';

describe('reveal facts', () => {
  it('computes the age on a given day', () => {
    expect(ageOn('1986-05-13', new Date('2026-11-17T12:00:00'))).toBe(40);
    expect(ageOn('1986-05-13', new Date('2026-05-12T12:00:00'))).toBe(39);
    expect(ageOn('1986-05-13', new Date('2026-05-13T12:00:00'))).toBe(40);
  });

  it('returns null for an invalid birth date', () => {
    expect(ageOn('', new Date())).toBeNull();
  });

  it('names the country in the active language', () => {
    expect(countryName('GB', 'es')).toBe('Reino Unido');
    expect(countryName('GB', 'en')).toBe('United Kingdom');
  });

  it('formats the announcement date in the active language', () => {
    expect(formatDate('2026-11-16', 'es')).toBe('16 de noviembre de 2026');
    expect(formatDate('2026-11-16', 'en')).toBe('November 16, 2026');
  });
});

describe('licenseUrl', () => {
  it('links Creative Commons licenses', () => {
    expect(licenseUrl('CC BY-SA 4.0')).toBe('https://creativecommons.org/licenses/by-sa/4.0/');
    expect(licenseUrl('CC BY 2.0')).toBe('https://creativecommons.org/licenses/by/2.0/');
  });

  it('returns null for anything else', () => {
    expect(licenseUrl('Public domain')).toBeNull();
  });
});
