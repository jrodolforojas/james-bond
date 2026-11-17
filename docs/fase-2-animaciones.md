# Fase 2 — Investigación de animaciones

Objetivo: elegir con qué se anima cada transición y cada minijuego, priorizando que se vea espectacular **grabado en video**, que corra a 60 fps en móvil y que el bundle sea liviano.

Restricciones heredadas de la Fase 1:
- Arte en SVG (siluetas trazadas con potrace/vtracer, opción A aprobada).
- Sitio bilingüe ES/EN con i18n: toda animación de texto debe tolerar largos distintos.
- Cada transición necesita alternativa con `prefers-reduced-motion`.

---

## 1. Comparativa de tecnologías

Pesos aproximados (min + gzip). Se medirán en el build real de la Fase 3.

| Tecnología | Calidad visual | Rendimiento móvil | Peso aprox. | Curva | Licencia | Grabado en video |
|---|---|---|---|---|---|---|
| **CSS puro** (transitions, keyframes, 3D) | Media-alta en transformaciones simples; difícil orquestar secuencias largas | Excelente (compositor) si solo `transform`/`opacity` | 0 kB | Baja | — | Muy estable |
| **View Transitions API** (same-document) | Alta para cambios de pantalla (morph entre estados del DOM) | Muy buena; snapshot en GPU | 0 kB | Baja-media | Estándar web. Baseline desde oct. 2025 (Chrome 111, Safari 18, Firefox 144) | Estable; poco control fino del timing |
| **GSAP 3** (core) | Muy alta: timelines, eases, control total de secuencias | Muy buena | ≈ 24 kB | Media | Gratis incluso con todos los plugins (SplitText, MorphSVG…) bajo la licencia "no charge" de Webflow; propietaria, no MIT | Excelente: timelines deterministas, fáciles de repetir para grabar |
| **Motion** (motion.dev, vanilla o React) | Alta; springs naturales | Muy buena (usa WAAPI) | 2.6–18 kB según API | Baja-media | MIT irrevocable | Buena; menos herramientas para secuencias largas encadenadas |
| **Lottie / dotLottie** | Alta si hay animador en After Effects | Buena; dotLottie usa WASM | 40–150 kB + JSON de cada animación | Alta (requiere AE + plugin) | MIT (runtimes) | Buena, pero el arte vive fuera del código |
| **Rive** | Muy alta, con state machines interactivas | Muy buena (WASM + canvas) | ≈ 150 kB+ runtime | Alta (editor propio) | Runtime MIT; editor freemium | Excelente, pero exige producir todo en el editor de Rive |
| **Canvas 2D** | Alta para partículas (brasas, nieve, humo, chispas) | Muy buena hasta cientos de partículas | 0 kB | Media | — | Excelente |
| **PixiJS v8** | Muy alta (WebGL/WebGPU, filtros, miles de sprites) | Excelente con muchos objetos; costo inicial de arranque | ≈ 100 kB+ | Media-alta | MIT | Excelente |
| **SVG + SMIL / filtros** | Alta para humo (`feTurbulence` + `feDisplacementMap`) | Los filtros animados son caros en móvil | 0 kB | Media | — | Riesgo de caídas de fps en filtros grandes |

**Lectura rápida:**
- Lottie y Rive dan calidad, pero obligan a producir el arte en otra herramienta. Eso choca con el pipeline SVG aprobado y suma peso. Se descartan.
- PixiJS es sobredimensionado: ningún minijuego necesita miles de objetos.
- Usar GSAP y Motion a la vez duplica conceptos. Hay que elegir uno: **GSAP**, porque esta experiencia es cinematográfica y secuencial.

---

## 2. Por transición

| # | Transición | Recomendación | Alternativa reducida (`prefers-reduced-motion`) |
|---|---|---|---|
| 1 | Tipeo con glitch + carpeta que se abre | GSAP (tipeo por caracteres, pulsos de glitch con `text-shadow` y `clip-path`) + CSS 3D para la tapa | Texto completo con fundido; fundido cruzado a la carpeta |
| 2 | Barrido de luz sobre el vehículo | CSS: banda con `mask`/`transform` animada por GSAP al centrar la carta | Borde de color sin barrido |
| 3 | Ventana MI6 → mapa con ruta roja | GSAP timeline: escala de capas SVG (ventana, tejados) + `stroke-dashoffset` para la ruta | Fundido al mapa con la ruta ya trazada |
| 4 | Ficha → moneda de oro | **Prototipo 1.** CSS 3D (disco con grosor) orquestado con GSAP; cambio de textura en el instante de canto | Fundido cruzado ficha → moneda |
| 5 | Oro → azul noche con nieve | GSAP para el color de fondo y la desaturación + Canvas 2D para la nieve | Fundido lento; nieve estática |
| 6 | Brasa → sol | **Prototipo 2.** Canvas 2D (brasas, resplandor del sol) + GSAP para el estado (color de cielo, radio, capas) | Fundido cruzado noche → playa |
| 7 | Tachón que se borra letra por letra | **Prototipo 3.** DOM: un `span` por letra con su tachón; GSAP con escalonado y partículas DOM | Nombre completo con fundido |
| — | Cambio entre pantallas (mapa ↔ parada ↔ carta) | View Transitions API (same-document) con fallback a fundido GSAP | Fundido de 200 ms |

---

## 3. Por minijuego

| Minijuego | Recomendación | Por qué |
|---|---|---|
| Trivia (Jamaica) | DOM + estado; feedback con GSAP | Botones accesibles y teclado nativo |
| Elegir gadget (Londres) | DOM + estado | Es una selección; nada que dibujar |
| Impostor (Montenegro) | SVG de siluetas + GSAP (gestos en loop, burbuja de gesto) | Pocos actores; las siluetas ya son SVG |
| Bomba (Fort Knox) | SVG (cables como `path` tocables) + GSAP (cortes, reloj, sombrero) + `pointer events` para el deslizamiento | Cada cable es un objetivo accesible; nítido en cualquier resolución |
| Tiroteo (Escocia) | Canvas 2D (siluetas como `Path2D` desde el SVG, niebla, impactos) + GSAP para el ritmo de las oleadas | Muchos objetos en movimiento y un game loop |

---

## 4. Recomendación

1. **GSAP 3** como motor único de timelines: transiciones, minijuegos y textos. Es gratis con todos sus plugins. El riesgo es que la licencia es propietaria y Webflow la puede cambiar, pero eso no afecta un fan concept sin fines de lucro.
2. **CSS** (3D y compositor) para lo que GSAP orquesta: transformaciones y opacidad únicamente, para garantizar 60 fps.
3. **View Transitions API** para el cambio entre pantallas, con fallback.
4. **Canvas 2D** para partículas y el tiroteo. Sin PixiJS, salvo que el tiroteo no llegue a 60 fps en un Android de gama media.
5. **Sin Lottie ni Rive**: el arte sale del pipeline SVG aprobado.
6. **Reduced motion** como modo de primera clase: cada timeline tiene su versión corta, elegida con `gsap.matchMedia()`.
7. **i18n**: las animaciones de texto se construyen a partir del string traducido, nunca de anchos fijos (ver prototipo 3).

Peso estimado de animación: ≈ 24 kB (GSAP core) + código propio.

---

## 5. Prototipos

Abrir directamente en el navegador (no requieren build). Todos tienen botón "Repetir" y simulan `reduced motion` con `?rm=1`.

- `prototypes/01-ficha-moneda.html`
- `prototypes/02-brasa-sol.html`
- `prototypes/03-desclasificacion.html` (con selector ES/EN y nombre editable)

---

Fuentes: [Webflow: GSAP 100% gratis](https://webflow.com/blog/gsap-becomes-free) · [GSAP Standard License](https://gsap.com/community/standard-license/) · [Same-document view transitions: Baseline](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available) · [Chrome: View Transitions 2025](https://developer.chrome.com/blog/view-transitions-in-2025) · [Motion vs GSAP](https://motion.dev/docs/gsap-vs-motion) · [Motion: feature comparison](https://motion.dev/docs/feature-comparison) · [dotLottie](https://lottiefiles.com/dotlottie) · [Rive como alternativa a Lottie](https://rive.app/blog/rive-as-a-lottie-alternative) · [PixiJS releases](https://pixijs.com/blog/june-2026)
