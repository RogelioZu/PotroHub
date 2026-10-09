# Plan de integración institucional

**Estado: propuesta.** No presupone aprobación de la Facultad ni compromiso de docentes o de la
Rama IEEE. Los roles deben asignarse a personas reales; si una persona cubre varios, se registra.

## 1. Quién opera qué

| Rol | Responsabilidad | Persona |
|---|---|---|
| Responsable del proyecto | Decisiones de alcance, interlocución con la Facultad | Por asignar |
| Responsable frontend | Código, publicación, pruebas, rendimiento | Por asignar |
| Responsable de contenido | Revisar credenciales y perfiles (fuentes y fechas) cada semestre; galería y procedencia de fotos | Por asignar |
| Responsable de investigación | Protocolo del piloto, datos, informe | Por asignar |
| Enlace académico | Convocatoria, espacios, periodo del piloto | Por confirmar con la Facultad |
| Enlace de comunidad | Agenda IEEE y moderación de los canales de Teams (ya creados) | Por confirmar con la Rama IEEE |

## 2. Etapas

| Etapa | Qué se logra | Condición para avanzar |
|---|---|---|
| 1. MVP autónomo (hoy) | Sitio estático, estado local, sin registro; afinado opcional con IA | Contenido revisado; pruebas y build en verde |
| 2. Piloto acompañado | Protocolo de `PILOTO.md` ejecutado con interlocutor académico | Cero bloqueos críticos; informe publicado |
| 3. Operación de comunidad | Agenda real y responsables de moderación (los canales de Teams ya existen) | `EVENTS` con datos confirmados y moderación asignada |
| 4. Infraestructura institucional | Hosting y dominio de la universidad, soporte, respaldo | Requisitos levantados con el área de TI |
| 5. Servicios opcionales | Analítica agregada o gestión editorial | Necesidad demostrada en el piloto y responsable de datos |
| 6. Escalamiento | Uso por más generaciones | Prueba de carga contra la meta derivada de la convocatoria |

**Infraestructura.** El sitio es estático: basta un servidor web que publique `dist/` y redirija
las rutas a `index.html`. Así funciona completo, sin PHP, base de datos ni procesos en el servidor;
el afinado usa ahí sus preguntas de respaldo escritas a mano. Llevar también la redacción con IA
exige una función equivalente a `/api/detonadoras` (hoy en Vercel), que guarde la llave del modelo
del lado del servidor. Su contrato está escrito en la cabecera de `api/detonadoras.js` y su lógica
vive en módulos puros (`affinity.js`, `refine.js`): reimplementarla en PHP es traducir esos
archivos, no rediseñar el sitio. Una migración a
PHP y bases de datos locales —contemplada en la memoria descriptiva— sólo tiene sentido si la etapa
5 se aprueba; no se añade complejidad para que la arquitectura parezca más grande. Supabase y una
solución institucional se presentan como opciones por decidir.

**Escalabilidad.** El diagnóstico y el cálculo ocurren en cada navegador, y la carga la absorbe el
hosting estático o una CDN. La única llamada a un servidor es la del afinado: una por estudiante que
la pide, con tope de 8 s y respaldo si falla, así que su costo crece con el uso del modelo y no con
las visitas. No se afirma "escala a toda la universidad" sin una
prueba de carga del hosting elegido.

## 3. Cronograma propuesto

Semanas relativas al arranque del piloto.

| Semana | Etapa | Responsable | Entregable |
|---|---|---|---|
| 1 | Revisión de contenido y publicación de la versión de prueba | Frontend + contenido | URL de prueba; fuentes revisadas |
| 2 | Preparación del piloto | Investigación + enlace académico | Instrumentos, permisos, reclutamiento |
| 3 | Ronda moderada (6–8) | Facilitación + observación | Lista priorizada de problemas |
| 4 | Correcciones | Frontend + contenido | Versión congelada |
| 5 | Ronda ampliada (20–30) | Coordinación del piloto | Muestra real registrada |
| 6 | Síntesis y testimonios autorizados | Investigación + producto | Informe inicial; sección de Inicio si procede |
| 7 | Seguimiento a 14 días | Coordinación del piloto | Datos agregados |
| 8 | Revisión institucional | Responsable + interlocutores | Decisión sobre adopción y responsables |

Las dependencias institucionales pueden mover fechas; los cambios se documentan aquí.

## 4. Mantenimiento recurrente

| Cada… | Tarea |
|---|---|
| Cambio de código | `npm run lint`, `npm test`, `npm run build`; revisar a 390 y 1440 px |
| Semestre | Abrir cada `sourceUrl` de `credentials.js` y `careers.js`; sustituir fichas caídas; actualizar `reviewedAt` sólo de lo leído |
| Evento de la rama | Agregar a `EVENTS` con fecha y lugar confirmados; retirarlo al pasar |
| Foto nueva | Confirmar consentimiento, procedencia y pie en `public/images/comunidad/README.md` |
| Retiro de autorización | Borrar el testimonio en la siguiente publicación |
