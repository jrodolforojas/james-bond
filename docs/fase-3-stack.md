# Fase 3 — Stack técnico (ADR)

Prioridades: simple, rápido de construir y excelente en móvil. Bilingüe ES/EN desde el día uno. Entorno local: Node 22, pnpm 11 y Vercel CLI.

---

## ADR-01 · Framework: Vite + React + TypeScript

**Decisión:** SPA con Vite, React 19 y TypeScript estricto.

| Alternativa | Por qué no |
|---|---|
| Next.js | SSR, rutas de servidor y RSC no aportan nada a una experiencia lineal de 5–7 minutos; suma complejidad y peso |
| Astro | Ideal para contenido con islas, pero aquí todo es interactivo y con estado compartido entre pantallas; terminaríamos con una gran isla de React |
| Vanilla TS | Lo más liviano, pero sin componentes; 5 minijuegos y 12 pantallas se vuelven difíciles de mantener |

**Por qué:** arranque instantáneo, HMR rápido, build estático para Vercel, y `@gsap/react` (`useGSAP`) integra limpio las timelines con el ciclo de vida de los componentes.

---

## ADR-02 · Animación: GSAP + CSS + View Transitions + Canvas 2D

**Decisión:** lo aprobado en la Fase 2. `gsap` + `@gsap/react`; `gsap.matchMedia()` elige entre la timeline completa y la reducida.

**Alternativas:** Motion, Lottie, Rive y PixiJS (descartadas en la Fase 2).

**Por qué:** un solo motor de timelines, deterministas y fáciles de repetir para grabar.

---

## ADR-03 · Motor de minijuegos: sin motor; React + SVG, y Canvas 2D para el tiroteo

**Decisión:**
- Trivia, gadget e impostor: componentes React (DOM y SVG).
- Bomba: SVG con `path` tocables y `pointer events` para el deslizamiento.
- Tiroteo de Escocia: un `<canvas>` con un loop propio sobre `gsap.ticker` y siluetas como `Path2D`, generadas desde los mismos SVG.
- Las reglas de cada juego son funciones puras en `rules.ts`, testeadas con Vitest (por ejemplo: corte incorrecto −5 s, sombrero −1 vida, frenar en 0:07).

| Alternativa | Por qué no |
|---|---|
| Phaser | ≈ 1 MB; un motor completo para un juego de 60 segundos |
| Kaplay / PixiJS | Innecesario para decenas de objetos |

**Por qué:** accesibilidad nativa (botones reales, teclado) donde importa, y reglas separadas del render.

---

## ADR-04 · Estado y persistencia: Zustand + `persist` (localStorage)

**Decisión:** un store con `persist`.
- **Se guarda:** paso actual del flujo, era, gadget, evidencias, cartas desbloqueadas, vidas, ventajas usadas (asiento eyectable), tiempo de misión e idioma.
- **No se guarda:** el estado efímero de cada minijuego (el reloj de la bomba, la oleada actual).

Para que el flujo no se pueda romper, este se modela como un enum de pasos con transiciones permitidas.

| Alternativa | Por qué no |
|---|---|
| Context + `useReducer` | Funciona, pero `persist` y los selectores salen gratis con Zustand (≈ 1 kB) |
| XState | Modelado excelente, pero curva y peso altos para un flujo lineal |

**Detalles:**
- El almacenamiento va envuelto en try/catch: en navegación privada se juega igual, solo que sin guardar.
- Clave versionada (`exp007:v1`) para migrar si cambia la forma del estado.

---

## ADR-05 · i18n: i18next + react-i18next, con recursos tipados

**Decisión:**
- **Diccionarios:** `es.json` y `en.json` por espacio de nombres (`common`, `arrival`, `london`, …, `final`), con tipos generados para que una clave faltante falle al compilar.
- **Idioma:** se lee de la ruta (`/es`, `/en`). Sin prefijo, se usa `navigator.language` y se redirige.
- **Selector:** visible en el header; el idioma elegido se guarda en el store.

| Alternativa | Por qué no |
|---|---|
| Diccionarios propios con un hook | 0 kB, pero hay que reinventar interpolación, plurales y detección |
| Lingui / FormatJS | Muy buenos; más configuración (macros, compilación) para solo dos idiomas |

**Reglas que se derivan:**
- **Cero texto en el código:** también `alt`, `aria-label` y los textos de la tarjeta.
- **Animaciones de texto:** se construyen desde el string traducido (Fase 2, prototipo 3).
- **Atributos de idioma:** `<html lang>` y `hreflang` se actualizan al cambiar de idioma.

---

## ADR-06 · Tarjeta para compartir: Canvas 2D en el cliente + Web Share API

**Decisión:**
- **Render:** se dibuja directamente en un canvas de 1080×1920 con las mismas fuentes, cargadas con `FontFace` antes de dibujar, y en el idioma activo.
- **Compartir:** `canvas.toBlob()` → `navigator.share({ files })` en móviles que lo soportan; si no, descarga del PNG.

| Alternativa | Por qué no |
|---|---|
| html-to-image / modern-screenshot | Captura del DOM: fallos con fuentes web, filtros SVG y escalado en iOS |
| Satori / `@vercel/og` en el servidor | Requiere una función serverless y duplicar el diseño en JSX limitado; sin ventaja para una imagen que solo baja el usuario |

**Por qué:** resultado nítido y determinista, sin servidor y sin enviar datos del jugador a ningún lado.

---

## ADR-07 · Deploy: Vercel (estático)

**Decisión:**
- `vite build` → Vercel como sitio estático. Un rewrite envía `/es/*` y `/en/*` a `index.html`.
- Previews por rama para revisar cada rebanada.

**Alternativas:** Netlify o Cloudflare Pages (equivalentes). Vercel gana porque ya tienes el CLI instalado.

---

## ADR-08 · Configuración, modos especiales y legal

- **`src/config.ts`:**
  - `NEW_007_NAME`, leído de `VITE_NEW_007_NAME`. Vacío = identidad censurada; con valor = animación de desclasificación.
  - `DEMO`, activado con `?demo=1`: salta la carga, desbloquea todo y muestra un selector de paradas.
- **Footer legal:** fijo en todas las pantallas, traducido.
- **Sin analítica ni cookies:** no hace falta banner de consentimiento.

---

## ADR-09 · Calidad: TypeScript estricto, Vitest, Playwright, Biome

| Herramienta | Uso |
|---|---|
| Vitest | Reglas puras de los minijuegos, store, i18n (claves ES = EN) |
| Playwright | Un smoke test por rebanada: completar el flujo en viewport iPhone y Pixel, y verificar que no haya errores en consola |
| Biome | Lint y formato en una sola herramienta (en lugar de ESLint + Prettier) |

---

## ADR-10 · Assets

- **Siluetas** (opción A): SVG optimizados con SVGO e importados como componentes con `vite-plugin-svgr`. Fuentes de las fotos de referencia documentadas en `art/CREDITS.md`.
- **Fuentes:** auto-alojadas con `@fontsource` (Bodoni Moda, Courier Prime y Special Elite). Funcionan sin conexión al grabar y están disponibles para el canvas.
- **Audio:** ver la pregunta abierta al final.

---

## Estructura de carpetas

```
james-bond/
├── docs/                      fases, ADR
├── prototypes/                prototipos de la Fase 2 (se mantienen como referencia)
├── art/                       fuentes del arte (referencias, archivos sin optimizar, CREDITS.md)
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx                idioma desde la ruta, layout, footer legal
│   ├── config.ts              NEW_007_NAME, DEMO
│   ├── flow/
│   │   ├── steps.ts           enum de pasos y transiciones permitidas
│   │   └── FlowRouter.tsx     pinta la pantalla del paso actual
│   ├── state/
│   │   └── store.ts           Zustand + persist
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── es/{common,arrival,recruitment,london,…,final}.json
│   │   └── en/{…}.json
│   ├── styles/
│   │   ├── tokens.css         paleta, tipografía y espaciado de la Fase 1
│   │   └── global.css
│   ├── components/            MoneypennyRadio, DossierCard, Stamp, Button, DossierDrawer, LegalFooter
│   ├── screens/
│   │   ├── Arrival/
│   │   ├── Recruitment/
│   │   ├── Map/
│   │   └── Final/             incluye la desclasificación
│   ├── stops/
│   │   ├── StopShell.tsx      apertura → minijuego → salida común
│   │   ├── london/            Opening.tsx, Game.tsx, rules.ts, rules.test.ts
│   │   ├── montenegro/
│   │   ├── fortknox/
│   │   ├── scotland/
│   │   └── jamaica/
│   ├── transitions/           una timeline por transición: full() y reduced()
│   ├── canvas/                loop, partículas (brasas, nieve, chispas)
│   ├── share/                 renderCard.ts, shareCard.ts
│   └── art/                   SVG optimizados (siluetas, vehículos, escenas)
├── tests/e2e/                 Playwright
├── biome.json
├── vite.config.ts
├── vercel.json
└── package.json
```

---

## Pregunta abierta: audio

El storyboard anota efectos de sonido (teclas, sellos, fuego y viento, tic-tac). El brief prohíbe la música oficial, pero no dice nada sobre efectos.

1. **Sin audio.** Lo más simple; el sonido se agrega en la edición del video.
2. **Efectos CC0** (por ejemplo, de Freesound con licencia CC0) con Web Audio, silenciados por defecto y con un botón para activarlos.

Mi recomendación es la 1: se graba para video y el sonido se controla mejor en la edición.
