# Fase 5 — Refinamiento

## Mejoras aplicadas

### Rendimiento (Lighthouse móvil, build de producción)

| Categoría | Puntaje |
|---|---|
| Performance | 96 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 100 |

- FCP 2.1 s · LCP 2.4 s · TBT 0 ms · CLS 0.
- Peso transferido en la carga inicial: 225 KiB. JS: 157 KB gzip en un solo chunk; CSS: 11 KB gzip. Las fuentes se cargan por subconjunto de caracteres, así que solo baja lo que se usa.
- Se agregaron favicon y `robots.txt` (Lighthouse marcaba un 404 y un `robots.txt` inválido).
- Animaciones solo con `transform` y `opacity`; el tiroteo y la brasa usan Canvas 2D con `devicePixelRatio` limitado a 2.

### Móvil

- Revisado en 360×640 y 375×812: sin desbordes horizontales (excepto el carrusel de eras, que es intencional).
- El sombrero de Oddjob ya no sobresale del panel de la bomba.
- La salida de Escocia cabe sin scroll.
- Gestos táctiles: deslizar para esquivar el sombrero, deslizar entre cartas del expediente, tocar para disparar. Cada gesto tiene un botón equivalente.

### Accesibilidad (axe-core, WCAG 2 A/AA)

- Sin violaciones en llegada, reclutamiento, mapa, las 5 aperturas, los 5 minijuegos, la salida, el expediente, la tarjeta y el final.
- Corregido: contraste del selector de idioma y del botón de sonido sobre fondos claros (ahora con fondo oscuro), contraste de las cartas de era inactivas (ya no se atenúan con opacidad) y del botón DEMO.
- `prefers-reduced-motion` (o `?rm=1`) tiene alternativa en cada transición y animación.
- Teclado: todo es `button`/`a`/`input` nativo; el expediente y la tarjeta son `<dialog>` (Esc cierra); el carrusel es enfocable; el tiroteo tiene botones por carril que aparecen al tabular.
- Textos alternativos: todas las escenas SVG tienen `role="img"` y `aria-label` traducido; los tachones se anuncian como "Identidad censurada".
- Herramienta: `?audit` carga axe-core solo en desarrollo.

### Pulido narrativo

- Duración estimada del recorrido completo: 6 a 7 minutos (llegada ~15 s, reclutamiento ~20 s, 5 paradas de 45 a 75 s, transiciones ~5 s cada una, final ~30 s).
- Escocia: entrada sin golpe sonoro, sin música, solo viento y fuego, y 2 s de nieve en silencio al llegar.
- Música original (toma 1) bajita, solo en la llegada y el final.

### Modo grabación (`?demo=1`)

- Partida separada (`exp007:demo`), todas las cartas desbloqueadas, sonido activado.
- Panel DEMO para saltar a cualquier pantalla o parada; tecla H para ocultarlo.

### Modo desclasificación (`VITE_NEW_007_NAME`)

- Con valor: el tachón se borra letra por letra en el final, cae el sello DESCLASIFICADO, el nombre aparece sobre la silueta y la carta 007 #7 del reclutamiento lo muestra.

### Footer legal

- Visible en todas las pantallas y traducido: "Fan concept no oficial. No afiliado a Amazon MGM Studios ni a EON Productions."

## Pendientes

1. **Arte final de siluetas** (opción A aprobada): hoy son marcadores en SVG.
2. **Audio con archivos**: faltan los 4 paquetes CC0 de Kenney en `art/audio/kenney/`; mientras, todo suena sintetizado.
3. **Prueba en dispositivos reales** (iPhone/Safari y Android/Chrome): fluidez a 60 fps, audio en iOS, botón "Compartir" nativo.
4. **URLs exactas de los CTAs**: hoy apuntan a la portada de 007.com y 007store.com.
5. **Tests de punta a punta con Playwright** (ADR-09): no están escritos.
6. **Deploy en Vercel** y unir las ramas (`rebanada-1` … `fase-5`) a `main`.
7. **Textos propuestos por Claude** pendientes de aprobación: líneas de Moneypenny en el mapa, en los fallos y aciertos de cada minijuego, la línea del Dr. No, los rangos de la tarjeta y las preguntas extra de Jamaica.
