import enArrival from './en/arrival.json';
import enCommon from './en/common.json';
import enDossier from './en/dossier.json';
import enFinal from './en/final.json';
import enFortknox from './en/fortknox.json';
import enJamaica from './en/jamaica.json';
import enLondon from './en/london.json';
import enMap from './en/map.json';
import enMontenegro from './en/montenegro.json';
import enRecruitment from './en/recruitment.json';
import enScotland from './en/scotland.json';
import esArrival from './es/arrival.json';
import esCommon from './es/common.json';
import esDossier from './es/dossier.json';
import esFinal from './es/final.json';
import esFortknox from './es/fortknox.json';
import esJamaica from './es/jamaica.json';
import esLondon from './es/london.json';
import esMap from './es/map.json';
import esMontenegro from './es/montenegro.json';
import esRecruitment from './es/recruitment.json';
import esScotland from './es/scotland.json';

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
    montenegro: esMontenegro,
    jamaica: esJamaica,
    scotland: esScotland,
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
    montenegro: enMontenegro,
    jamaica: enJamaica,
    scotland: enScotland,
  },
} as const;

export const LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];
