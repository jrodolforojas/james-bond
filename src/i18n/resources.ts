import enArrival from './en/arrival.json';
import enCommon from './en/common.json';
import enDossier from './en/dossier.json';
import enFinal from './en/final.json';
import enFortknox from './en/fortknox.json';
import enLondon from './en/london.json';
import enMap from './en/map.json';
import enRecruitment from './en/recruitment.json';
import esArrival from './es/arrival.json';
import esCommon from './es/common.json';
import esDossier from './es/dossier.json';
import esFinal from './es/final.json';
import esFortknox from './es/fortknox.json';
import esLondon from './es/london.json';
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
    dossier: esDossier,
    london: esLondon,
  },
  en: {
    common: enCommon,
    arrival: enArrival,
    recruitment: enRecruitment,
    map: enMap,
    fortknox: enFortknox,
    final: enFinal,
    dossier: enDossier,
    london: enLondon,
  },
} as const;

export const LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
