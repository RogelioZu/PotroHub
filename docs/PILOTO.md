# Prueba piloto de PotroPath — protocolo e instrumentos

**Estado: propuesto, sin ejecutar.** Ningún dato de este documento es un resultado. Las metas son
criterios de decisión fijados *antes* de reclutar, para no ajustarlas después de ver los datos.

## 1. Objetivo y alcance

Comprobar si un estudiante de Ingeniería en Computación:

1. entiende su resultado —en particular, que la afinidad mide interés y no capacidad—,
2. identifica un siguiente paso concreto (una habilidad y su entregable), y
3. encuentra una vía realista para acercarse a su comunidad.

Además, observar fricciones en el diagnóstico, las habilidades, la comparación de credenciales, los
perfiles profesionales y la búsqueda en LinkedIn.

El piloto evalúa **utilidad percibida y usabilidad**. No valida psicométricamente el cuestionario ni
demuestra causalmente mejoras de empleabilidad o de participación institucional.

## 2. Participantes y etapas

| Ronda | Participantes | Formato | Para qué |
|---|---|---|---|
| 1. Moderada | 6–8 estudiantes | Sesión individual de 25–35 min, presencial o por videollamada | Encontrar problemas de uso y de comprensión |
| Correcciones | — | Una semana | Resolver bloqueos; congelar versión |
| 2. Ampliada | 20–30 estudiantes | Autoadministrada con encuesta pre/post | Medir indicadores con la versión corregida |
| Seguimiento | Quienes acepten | Mensaje a los 14 días | ¿Dieron el primer paso? |

- Variedad de semestres (rangos 1–3, 4–6, 7+), dispositivos (teléfono y laptop) e intereses.
- El equipo desarrollador no participa como usuario. Evitar reclutar sólo amistades o integrantes
  activos de la Rama IEEE: inflarían comprensión y participación.
- Es una muestra de conveniencia: no representa a toda la facultad y así se reporta. Si no se
  alcanza el tamaño previsto, se informa el real y se ajustan las conclusiones.

## 3. Guion de la sesión moderada

| # | Tarea | Qué se observa |
|---|---|---|
| 0 | Consentimiento (anexo A) y encuesta previa (anexo B) | — |
| 1 | Ver Inicio sin explicación. "¿Para qué crees que sirve y qué esperas obtener?" | Comprensión de la propuesta en segundos |
| 2 | Completar el diagnóstico. No orientar respuestas | Tiempo, dudas, abandonos, ayuda pedida |
| 3 | "Explica tu resultado con tus palabras. ¿Qué significa el porcentaje y qué no?" | Distingue interés de capacidad |
| 4 | Explorar una segunda área, elegir una habilidad y describir su entregable | Siguiente paso concreto |
| 5 | Comparar las dos credenciales. "¿Qué diferencia influiría en tu elección?" | Distingue tipo, nivel y preparación |
| 6 | Identificar requisitos de un perfil y preparar una búsqueda en LinkedIn | Separa mínimos de deseables; usa el buscador. Termina al abrirse la búsqueda, sin exigir iniciar sesión |
| 7 | Encontrar su interés en Comunidad. "¿Puedes unirte hoy?" | Reconoce acceso disponible o "en preparación" |
| 8 | Encuesta posterior (anexo C) y entrevista breve | — |
| 9 | Autorización de cita, **opcional y separada** (anexo D) | — |

Registrar por tarea en la hoja de observación (anexo E): éxito sin ayuda, éxito con ayuda, no
completada; tiempo; duda observada; comentario textual. Distinguir los fallos del sitio de las
restricciones de servicios externos (por ejemplo, LinkedIn pidiendo sesión).

Facilitación y observación las hacen personas distintas siempre que sea posible.

## 4. Indicadores y metas iniciales

| Indicador | Definición | Meta / criterio |
|---|---|---|
| Finalización | Completaron el diagnóstico / lo iniciaron | ≥ 80%; investigar cada abandono |
| Comprensión | Explican interés frente a capacidad sin ayuda / evaluados | ≥ 80% |
| Siguiente paso | Nombran una habilidad y su entregable / evaluados | ≥ 80% |
| Comparación útil | Distinguen dos credenciales sin ayuda / quienes lo intentaron | ≥ 80% |
| Estado de comunidad | Reconocen correctamente acceso disponible o pendiente / evaluados | ≥ 90% |
| Claridad pre/post | Diferencia individual en la misma pregunta 1–5 | Señal favorable: mediana +1; reportar efecto techo |
| Fricción | Incidencias por tarea y severidad; ayudas | Cero bloqueos críticos antes de ampliar |
| Tiempo de diagnóstico | Mediana y rango de quienes completan | Línea base; no se premia responder rápido |
| Acción a 14 días | Reportan un paso realizado / responden el seguimiento | Exploratorio; reportar también la tasa de respuesta |
| Participación real | Incorporación verificable cuando existan accesos o eventos | Línea base; un clic no es participación |

Con muestras pequeñas se reporta "x de n" junto a cualquier porcentaje, sin decimales artificiales.
Un cambio pre/post puede deberse a expectativas, selección o novedad: sin grupo de comparación no
se atribuye causalidad a la plataforma.

## 5. Manejo de datos

- Basta con formularios y una hoja de observación: no hace falta crear cuentas ni un backend.
- Cada sesión registra versión probada (commit), fecha, dispositivo y un código de participante
  (`P1-03`), nunca el nombre en la hoja.
- Los datos de contacto para el seguimiento viven en un archivo separado, con acceso restringido al
  equipo responsable. Se definen conservación y eliminación antes de reclutar (propuesta: borrar
  contactos al cerrar el seguimiento; datos anonimizados hasta el cierre del concurso).
- Sólo se graba con autorización específica.
- **Nada de esto entra al repositorio público** salvo resultados agregados y anonimizados.

## 6. Testimonios en Inicio

El componente existe (`src/components/home/Testimonials.jsx`) y está vacío a propósito
(`TESTIMONIALS = []` en `src/data/testimonials.js`).

### Estados de publicación

| Estado | Qué muestra Inicio | Cómo se activa |
|---|---|---|
| Antes del piloto | Nada | `PILOT.status = 'planned'` |
| Convocatoria abierta | Bloque "Ayúdanos a mejorar PotroPath" | `status: 'recruiting'` **y** `callUrl` real |
| Piloto con 1–2 citas aprobadas | Sólo esas tarjetas; la rejilla se adapta | Registros en `TESTIMONIALS` |
| Piloto concluido | Citas y enlace a resultados agregados | `status: 'done'`, `reportUrl` |
| Autorización retirada | Se borra la cita en la siguiente publicación | Eliminar el registro |

### Reglas

- Sólo palabras realmente dichas o escritas por participantes, con autorización registrada en el
  anexo D. Se corrige ortografía sin cambiar el sentido; cualquier edición sustantiva se valida con
  la persona.
- La persona elige nombre, iniciales o "Participante del piloto". No se combinan detalles que la
  identifiquen contra su intención. Foto sólo con permiso propio; nunca una foto de banco junto a un
  nombre.
- Sin estrellas, promedios ni "miles de estudiantes". Se rotulan como "opiniones de participantes
  del piloto", no como aval institucional.
- Se eligen citas que hablen de cosas distintas (orientación, aprendizaje, comunidad) y se
  conservan también las críticas en el informe.
- Ningún texto de ejemplo del equipo se muestra a participantes antes de recoger opiniones: induce
  respuestas.

## 7. Entregable

Informe con versión evaluada, método, reclutamiento, muestra efectiva, fechas, resultados por
indicador, hallazgos positivos y negativos, limitaciones, cambios priorizados y plan de nueva
prueba. Los instrumentos y datos anonimizados se anexan; autorizaciones y contactos quedan fuera
del repositorio.

---

## Anexo A — Consentimiento (lectura al inicio)

> Gracias por participar. Estamos probando PotroPath, una herramienta hecha por estudiantes para
> orientar a estudiantes de Ingeniería en Computación. **Evaluamos la herramienta, no a ti**: no hay
> respuestas correctas. Participar es voluntario y puedes detenerte cuando quieras sin dar razones.
> Anotaremos lo que hagas y digas con un código, no con tu nombre. Sólo publicaremos resultados
> agregados. Si quieres que usemos alguna de tus frases en el sitio, te lo preguntaremos aparte al
> final; decir que no está perfectamente bien. ¿Tienes dudas? ¿Aceptas participar?

## Anexo B — Encuesta previa

1. Semestre: 1–3 · 4–6 · 7 o más
2. Dispositivo que usarás hoy: teléfono · laptop · otro
3. ¿Qué especialidades de Computación conoces? (abierta)
4. Del 1 al 5, ¿qué tan claro tienes cuál sería tu siguiente paso para desarrollarte en Computación?
5. En los últimos 30 días, ¿participaste en alguna actividad fuera de clase (hackatón, curso, club,
   rama estudiantil, proyecto propio)? Sí · No · ¿Cuál?

## Anexo C — Encuesta posterior y entrevista

1. Del 1 al 5, ¿qué tan claro tienes ahora tu siguiente paso? ¿Por qué?
2. ¿Qué fue lo más útil y por qué?
3. ¿Qué te confundió o te faltó?
4. ¿Qué significa para ti el resultado que recibiste?
5. ¿Qué habilidad, recurso o acción considerarías explorar después?
6. ¿Cambiarías algo de la sección de comunidad?
7. ¿Cómo describirías tu experiencia a otro estudiante?
8. ¿Aceptas que te escribamos en 14 días para una pregunta breve? Sí · No

## Anexo D — Autorización de cita (opcional, separada)

> ¿Nos permites publicar en el sitio de PotroPath esta frase tuya?
> «__________________________________________________»
>
> Atribución elegida: nombre completo · iniciales · "Participante del piloto"
> Contexto que aceptas mostrar (opcional): semestre · ninguno
> Foto: no · sí, la que yo proporcione
>
> Puedes retirar este permiso en cualquier momento escribiendo a ______; la quitaremos en la
> siguiente actualización del sitio.

Se archiva en el registro privado con el código del participante, la fecha y quién la recogió.

## Anexo E — Hoja de observación

| Código | Versión | Fecha | Dispositivo | Tarea | Resultado (sin ayuda / con ayuda / no) | Tiempo | Duda observada | Cita textual | Severidad (bloqueo / mayor / menor) |
|---|---|---|---|---|---|---|---|---|---|
| P1-01 | commit | | | 1 | | | | | |

## Anexo F — Seguimiento a 14 días

> Hola, hace dos semanas probaste PotroPath. Una sola pregunta: ¿diste algún paso relacionado con lo
> que exploraste (empezar una habilidad, revisar una credencial, buscar un puesto, contactar a la
> rama o a compañeros)? ¿Cuál? Responder es opcional.
