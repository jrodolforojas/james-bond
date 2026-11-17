import enArrival from './en/arrival.json';
import enCommon from './en/common.json';
import enFinal from './en/final.json';
import enFortknox from './en/fortknox.json';
import enMap from './en/map.json';
import enRecruitment from './en/recruitment.json';
import esArrival from './es/arrival.json';
import esCommon from './es/common.json';
import esFinal from './es/final.json';
import esFortknox from './es/fortknox.json';
import esMap from './es/map.json';
import esRecruitment from './es/recruitment.json';

export const resources = {
  es: {
    common: esCommon,
    arrival: esArrival,
    recruitment: esRecruitment,
    map: esMap,
    fortknox: esFortknox,
    final: esFinal,
  },
  en: {
    common: enCommon,
    arrival: enArrival,
    recruitment: enRecruitment,
    map: enMap,
    fortknox: enFortknox,
    final: enFinal,
  },
} as const;

export const LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
