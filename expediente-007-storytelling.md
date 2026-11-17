# EXPEDIENTE 007 COMPROMETIDO
### Fan concept: rediseño interactivo de 007.com
*Documento de storytelling. Para la implementación técnica (Claude Code / Claude Design), ver la sección "Notas para producción" al final.*

---

## 1. La idea en una línea

> SPECTRE filtró el expediente completo de James Bond. Usted es el agente que debe recorrer el mundo para destruir cada copia… pero para destruirla, primero tiene que leerla.

**El truco narrativo:** el jugador aprende quién es Bond sin darse cuenta. Cada prueba destruida desbloquea una página del expediente: personaje, origen, villanos, lugares, vehículos. Cuando termina la misión, la persona que "nunca vio una película de Bond" ya sabe quién es, de dónde viene, contra quién pelea y por qué importa el próximo actor.

**El gancho del momento:** Amazon MGM está eligiendo al próximo 007 y la identidad no se ha anunciado (Robert Pattinson, Callum Turner, Nicholas Hoult y otros suenan como candidatos). En nuestra historia, **la identidad del nuevo 007 es el último secreto del expediente**. El día del anuncio, se desclasifica. Eso da un segundo video.

---

## 2. Tono y dirección de arte

**Tono:** elegante, tenso, con humor seco. Bond nunca grita; Bond ajusta los gemelos de la camisa mientras todo explota. Los textos son cortos, en clave de informe de inteligencia.

**Estilo visual, en dos capas:**

| Capa | Estilo | Para qué |
|---|---|---|
| Interfaz | **Expediente clasificado**: carpetas manila, sellos TOP SECRET, texto tachado en negro, polaroids, clips | Menú, cartas desbloqueadas, transiciones |
| Escenas | **Secuencia de créditos**: siluetas, colores planos y saturados, humo, agua, formas líquidas sobre fondo negro | Cada locación y sus minijuegos |

**Por qué siluetas:** Bond no tiene cara en este sitio. Primero, porque el próximo 007 todavía no tiene rostro, y eso es narrativa. Segundo, porque evita usar la imagen de actores reales.

**Color por parada:**

| Parada | Color dominante | Sensación |
|---|---|---|
| Londres | Gris acero + azul | Institución, orden |
| Montenegro | Verde paño de póker + rojo | Lujo, peligro |
| Fort Knox | Dorado | Codicia |
| Escocia | Naranja fuego sobre azul noche | Duelo, memoria |
| Jamaica | Turquesa + arena | Origen, calma antes del final |
| Final | Negro + blanco | Misterio |

---

## 3. Personajes del universo (lo que el jugador va a conocer)

- **James Bond, 007:** agente del MI6 con "licencia para matar". Comandante de la Marina Real. Frío, elegante, huérfano.
- **M:** jefe del MI6. Da las órdenes y es lo más cercano a una figura materna o paterna para Bond.
- **Q:** el genio de los gadgets. Odia que Bond le destruya todo.
- **Moneypenny:** secretaria de M y aliada de Bond. Es la voz que lo guía durante la misión.
- **SPECTRE:** la organización criminal detrás de casi todo. En nuestra historia, son los que filtraron el expediente.
- **Villanos de cada parada:** Le Chiffre, Goldfinger y Oddjob, Raoul Silva y Dr. No.

**Narradora de la experiencia:** Moneypenny, por radio. Es cálida, irónica y siempre un paso adelante. Ella "acompaña" al jugador con mensajes cortos entre paradas.

---

## 4. Estructura de la misión

```
LLEGADA → RECLUTAMIENTO → 1. LONDRES → 2. MONTENEGRO → 3. FORT KNOX → 4. ESCOCIA → 5. JAMAICA → FINAL: 007 #7
           (agente+vehículo)  el deber     el engaño       los villanos   la herida     el origen      el futuro
```

Duración objetivo: **5 a 7 minutos**. Cada parada dura entre 45 y 75 segundos, y el expediente se puede leer sin jugar.

---

## PASO 0: La llegada — "Transmisión interceptada"

**Lo que ve el usuario:** pantalla negra. Un cursor parpadea. Se escribe solo:

> `TRANSMISIÓN INTERCEPTADA — 03:47 GMT`
> `ORIGEN: DESCONOCIDO`
> `CONTENIDO: EXPEDIENTE PERSONAL — AGENTE 007`
> `ESTADO: COMPROMETIDO`

Silencio. Luego, la voz de Moneypenny en texto:

> *"Tenemos un problema. Alguien publicó todo sobre él: quién es, de dónde viene, a quién ha enfrentado. Y algo peor: quién viene después. Necesitamos a alguien que limpie esto. ¿Acepta la misión?"*

**Botón:** `ACEPTAR MISIÓN`

**Beat emocional:** curiosidad. El usuario no sabe nada de Bond, y eso está bien: el personaje *también* está en peligro de que lo "conozcan". Es una invitación a descubrirlo.

**Dirección:** el texto tiene glitch leve, como de máquina de escribir. Al aceptar, se abre una carpeta manila hacia el usuario.

---

## PASO 1: Reclutamiento — "Elija su era"

**Lo que pasa:** el MI6 le asigna un vehículo. Cada uno representa una era de Bond, un actor distinto, y le da una ventaja en el juego.

> *Moneypenny: "Q insiste en que se lo devuelva entero. Ninguno de sus antecesores lo logró."*

| Era | Vehículo | Película | Ventaja |
|---|---|---|---|
| Sean Connery (1962–1971) | Aston Martin DB5 | *Goldfinger* | Asiento eyectable: puede saltarse un minijuego |
| Roger Moore (1973–1985) | Lotus Esprit submarino | *The Spy Who Loved Me* | Ruta por agua: llega antes a Jamaica |
| Timothy Dalton (1987–1989) | Aston Martin V8 | *The Living Daylights* | +10 s en pruebas con tiempo |
| Pierce Brosnan (1995–2002) | BMW 750iL a control remoto | *Tomorrow Never Dies* | Pista extra en la trivia |
| Daniel Craig (2006–2021) | Aston Martin DBS | *Casino Royale* | Más vida en el tiroteo |
| **007 #7** | ██████ | ██████ | *Bloqueado hasta el final* |

**Storytelling:** cada carta trae una línea que resume esa era:
- **Connery:** el que lo inventó todo.
- **Moore:** el del humor y las cejas levantadas.
- **Dalton:** el más oscuro, el más fiel a los libros.
- **Brosnan:** el de los 90, gadgets y tecnología.
- **Craig:** el que lo rompió y lo volvió humano.

**Se desbloquea en el expediente:** *"Seis actores, más de 60 años, 25 películas oficiales."*

**Dirección:** carrusel horizontal. El vehículo aparece en silueta con un barrido de luz en el color de su era.

---

## PARADA 1: LONDRES — "El briefing"
**Película base:** las escenas del MI6 a lo largo de toda la saga.
**Tema:** el deber.

### Apertura
Alarma roja. El edificio del MI6 junto al Támesis, en silueta: el mismo edificio que ha sido atacado más de una vez en las películas. Adentro, una pantalla con el rostro de M en sombra:

> *M: "Si ese expediente se publica completo, 007 deja de existir. No como hombre: como agente. Recupere cada copia. Y no deje rastro."*

### Personajes
M (las órdenes) y Q (los recursos).

### Mecánica: la sala de Q
El jugador entra al laboratorio de Q. Sobre la mesa hay tres gadgets, y solo se puede llevar uno:

| Gadget | Le sirve en… |
|---|---|
| Reloj con láser | Fort Knox: un corte de cable gratis |
| Radio con rastreador | Jamaica: una pista extra en el interrogatorio |
| Pistola con lector de palma | Escocia: más precisión en el tiroteo |

> *Q: "Por favor, intente traerlo de vuelta. Aunque sea una pieza."*

### Se desbloquea: "¿Quién es Bond?"
- Comandante de la Marina Real británica.
- Agente del MI6. El "00" significa que tiene licencia para matar.
- Vive en un apartamento en Chelsea, Londres.
- Toma el martini agitado, no revuelto.

### Transición
La cámara sale por la ventana del MI6, sube sobre Londres y el mapa mundial se dibuja con una línea roja hacia el sureste de Europa.

---

## PARADA 2: MONTENEGRO — "El tell"
**Película base:** *Casino Royale* (2006), la primera misión de Bond como agente 00.
**Tema:** el engaño.

### Apertura
Un casino de lujo junto al mar. Lámparas de cristal, paño verde, fichas apiladas. En la cabecera de la mesa está **Le Chiffre**, el banquero que maneja el dinero del terrorismo internacional. Una cicatriz en el ojo le hace llorar sangre.

> *Moneypenny: "Uno de los jugadores tiene la copia del expediente en su maletín. No sabemos cuál. Usted sabe leer a la gente… ¿verdad?"*

### Mecánica: detectar al impostor
- Hay cinco jugadores en la mesa, todos en silueta, y cada uno tiene un gesto: se toca el ojo, mira sus fichas, tamborilea los dedos, se ajusta la corbata o bebe de su copa.
- El jugador observa tres rondas de póker y luego señala al portador.

**El giro, sacado de la película:** el gesto más obvio (tocarse el ojo) es una **trampa**. En *Casino Royale*, Bond cree haber descubierto el "tell" de Le Chiffre, pero Le Chiffre lo usa en su contra. Si el jugador cae en lo obvio, Moneypenny dice: *"Exactamente lo que él quería que pensara."* Gana quien detecta el gesto sutil.

### Se desbloquea: "El primer libro y la mujer que lo cambió"
- Ian Fleming publicó *Casino Royale* en 1953. Ahí nació Bond.
- En 2006 se usó la misma historia para reiniciar la saga con Daniel Craig.
- Vesper Lynd, el gran amor de Bond, lo traicionó. Eso explica por qué Bond no confía en nadie.

### Cierre
El maletín se abre y la copia arde. **Evidencia #1 destruida.**

### Transición
Una ficha de póker gira en cámara lenta y se convierte en una moneda de oro, que nos lleva a la siguiente parada.

---

## PARADA 3: FORT KNOX — "Detén el reloj"
**Película base:** *Goldfinger* (1964), la película que definió la fórmula Bond: villano excéntrico, gadgets, Aston Martin.
**Tema:** los villanos.

### Apertura
Todo es dorado. **Auric Goldfinger**, un hombre obsesionado con el oro, tiene un plan: no quiere robar la reserva de oro de Estados Unidos, quiere detonar una bomba atómica dentro para volverla radiactiva. Así, el oro que él tiene valdría muchísimo más.

> *Moneypenny: "La copia está pegada al núcleo de la bomba. Y no, no la puede despegar sin desactivarla primero."*

### Personaje secundario
**Oddjob**, el guardaespaldas de Goldfinger. No habla. Mata lanzando su sombrero con borde de acero.

### Mecánica: desactivar la bomba
- Tiene 30 segundos, cinco cables de colores y un manual con tres pistas que hacen referencia a lo que el jugador leyó en el expediente.
- Mientras trabaja, el sombrero de Oddjob cruza la pantalla y hay que esquivarlo.
- Si trae el reloj láser, tiene un corte gratis.
- **El momento icónico:** al cortar el cable correcto, el reloj se detiene en **0:07**, igual que en la película.

> *Moneypenny: "Siete segundos. Él siempre deja todo para el final."*

### Se desbloquea: "La galería de villanos"
| Villano | Película | Rasgo |
|---|---|---|
| Goldfinger | *Goldfinger* | Obsesión con el oro |
| Oddjob | *Goldfinger* | Sombrero letal |
| Blofeld | Varias | Jefe de SPECTRE, siempre con un gato blanco |
| Jaws | *The Spy Who Loved Me*, *Moonraker* | Gigante con dientes de acero |
| Le Chiffre | *Casino Royale* | Llora sangre |
| Raoul Silva | *Skyfall* | Ex agente del MI6 |

### Cierre
**Evidencia #2 destruida.**

### Transición
El dorado se apaga y todo se vuelve azul noche. Empieza a nevar. Un silencio largo.

---

## PARADA 4: ESCOCIA — "Skyfall"
**Película base:** *Skyfall* (2012).
**Tema:** la herida. Es la parada emocional: el único lugar donde Bond es una persona y no un agente.

### Apertura
Tierras Altas de Escocia, de noche y con neblina. Una casa de piedra sola en medio de la nada, la casa donde Bond creció.

> *Moneypenny (más baja de lo normal): "Esta copia es distinta. No habla de misiones: habla de él. De cuando era niño."*

Viene **Raoul Silva**, ex agente del MI6 que se siente traicionado por M y quiere venganza. Trae un ejército.

### Mecánica: defender la casa
- Antes de la primera oleada, el jugador coloca dos trampas en ventanas o puertas, igual que Bond y el viejo guardabosques Kincade en la película.
- Son tres oleadas de *shooting gallery* con siluetas que aparecen entre la niebla.
- Con la era Craig, tiene más vida. Con la pistola de lector de palma, más precisión.
- Con el DB5, en la oleada final el carro aparece y dispara una ráfaga de apoyo. En la película, ese DB5 termina destruido. Aquí también.

### Se desbloquea: "El origen"
- Bond es escocés por parte de padre.
- Sus padres murieron en un accidente de escalada cuando él era niño.
- Skyfall era la casa de su infancia. Bond no volvió nunca… hasta esa noche.
- *Por eso es como es: alguien que perdió todo temprano y aprendió a no aferrarse a nada.*

### Cierre
La casa arde. La copia arde con ella. **Evidencia #3 destruida.**
Aquí no hay música, solo fuego y viento. Es el momento más silencioso de toda la experiencia, a propósito.

### Transición
Una brasa sube al cielo y se convierte en sol. El cielo pasa de azul noche a turquesa: el Caribe.

---

## PARADA 5: JAMAICA — "Donde todo empezó"
**Película base:** *Dr. No* (1962), la primera película de James Bond.
**Tema:** el origen de la saga.

### Apertura
Playa turquesa, palmeras y, a lo lejos, una isla: **Crab Key**. Ahí vive el **Dr. No**, un científico con manos de metal que sabotea los cohetes de Estados Unidos desde su base secreta.

> *Moneypenny: "Última copia. Y él no se la va a dar así nomás. Quiere comprobar que usted es quien dice ser."*

### Mecánica: el interrogatorio
- Es una trivia de cinco preguntas, todas sobre lo que el jugador desbloqueó en las paradas anteriores. Ejemplos:
  - ¿Qué significa el "00"?
  - ¿Dónde creció Bond?
  - ¿En qué número se detuvo el reloj de la bomba?
  - ¿Quién traicionó a Bond en *Casino Royale*?
  - ¿Cuál es el villano del gato blanco?
- Con la radio con rastreador o la era Brosnan, tiene una pista extra.

**El giro:** si el jugador se saltó la lectura del expediente, falla. El Dr. No responde: *"Usted no es 007. Usted es el impostor."* Puede reintentar después de leer.

### Se desbloquea: "Donde nació todo"
- Ian Fleming escribió todas las novelas de Bond en su casa de Jamaica, llamada *Goldeneye*.
- *Dr. No* (1962) fue la primera película, con Sean Connery.
- En esa película se dijo por primera vez *"Bond. James Bond."*
- Bond también tuvo tiras de cómic en periódicos desde 1958.

### Cierre
**Evidencia #4 destruida.**

> *Moneypenny: "Limpio. Todo limpio… Espere. Hay un archivo más. Y este no lo escribió SPECTRE."*

---

## FINAL — "007 #7"
**Tema:** el futuro.

### Lo que ve el usuario
Pantalla negra. Una sola página del expediente en el centro:

> **AGENTE 007**
> **IDENTIDAD:** ██████████████
> **ESTADO:** En reclutamiento
> **AUTORIZACIÓN:** Pendiente — Amazon MGM Studios

Detrás aparece una **silueta sin rostro**, en estilo de secuencia de créditos, con el humo moviéndose.

> *Moneypenny: "Este archivo no lo vamos a destruir. Lo vamos a esperar."*

### La recompensa
Una tarjeta personal del jugador, lista para compartir en historias (formato vertical):
- Era y vehículo escogido
- Gadget
- Evidencias destruidas: 4/4
- Tiempo de misión
- Rango: *Analista / Agente de campo / Doble cero*

### Las salidas (CTAs)
Conectan con las secciones reales del sitio actual:
- **Las películas:** "Vea las 25 misiones completas"
- **Los vehículos:** "Conozca el garaje de Q"
- **Experiencias:** "Viva Bond fuera de la pantalla"
- **Store:** "Equípese como agente"

### Segunda vida (el segundo video)
El día que se anuncie el nuevo 007, la silueta se **desclasifica**: el tachón negro se borra letra por letra, aparece el nombre y la carta "007 #7" en el reclutamiento se desbloquea para todos.

---

## 5. Arco completo, en una tabla

| Paso | Lugar | Película | Tema | Mecánica | El usuario aprende |
|---|---|---|---|---|---|
| 0 | — | — | Curiosidad | Aceptar misión | Que hay un secreto |
| 1 | — | Toda la saga | Identidad | Elegir era y vehículo | Los 6 actores |
| P1 | Londres | MI6 en la saga | El deber | Elegir gadget | Quién es Bond |
| P2 | Montenegro | *Casino Royale* | El engaño | Detectar al impostor | El primer libro, Vesper |
| P3 | Fort Knox | *Goldfinger* | Los villanos | Desactivar bomba | La galería de villanos |
| P4 | Escocia | *Skyfall* | La herida | Disparar / defender | Su origen, su infancia |
| P5 | Jamaica | *Dr. No* | El origen | Trivia | Fleming, la primera película |
| Final | — | Bond 26 | El futuro | Revelación | El próximo 007 |

---

## 6. Notas para producción (para la sesión de Claude Code)

**Principio rector:** la web *es* el juego. El expediente es la navegación. Quien no quiera jugar puede leer las cartas, pero aparecen censuradas hasta desbloquearlas.

**Transiciones clave a diseñar:**
1. Texto tipeado con glitch y apertura de la carpeta (Paso 0)
2. Barrido de luz sobre la silueta del vehículo (Paso 1)
3. Salida por la ventana del MI6 hacia el mapa con la ruta roja (P1 → P2)
4. Ficha de póker que se convierte en moneda de oro (P2 → P3)
5. Dorado que se apaga a azul noche, con nieve (P3 → P4)
6. Brasa que se convierte en sol, del azul noche al turquesa (P4 → P5)
7. Texto censurado que se borra letra por letra (Final, para el segundo video)

**Componentes recurrentes:**
- Mensaje de radio de Moneypenny (toast o caja de diálogo)
- Carta de expediente (bloqueada o desbloqueada)
- Sello "EVIDENCIA DESTRUIDA"
- Mapa mundial con ruta y 5 puntos

**Minijuegos, de más simple a más complejo:**
1. Trivia (Jamaica): estado y botones
2. Elegir gadget (Londres): selección
3. Detectar al impostor (Montenegro): animaciones de gestos y selección
4. Bomba (Fort Knox): SVG con cables, temporizador y obstáculo
5. Tiroteo (Escocia): canvas con objetivos

**Cuidados legales (es fan concept):**
- Presentarlo explícitamente como *fan concept / rediseño no oficial*.
- No usar logos oficiales, pósters, fotogramas, música ni la secuencia del cañón de pistola tal cual.
- Todo el arte debe ser original, con siluetas sin rostro de actores reales.
- Los CTAs pueden apuntar a 007.com y 007store.com como enlaces normales.
