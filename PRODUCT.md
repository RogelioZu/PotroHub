# Producto

<!-- impeccable:product-schema 1 -->

<!-- Los encabezados de sección se mantienen en inglés porque son anclas que
     leen los scripts de Impeccable (`extractPlatform` en context.mjs busca
     literalmente `## Platform`). El contenido es español. -->

## Platform

web

## Users

**Primarios — estudiantes de Ingeniería en Computación, Facultad de Ingeniería, UAEMéx**, en
particular de semestres iniciales e intermedios. Ya están inscritos y comprometidos con la carrera;
lo que les falta es saber *cuál* especialización dentro de ella les corresponde, y qué espera de esa
especialización la industria. La mayoría llega con participación extracurricular mínima (sin
hackathones, sin proyectos propios, sin networking) y sin saber que justo eso es lo que las empresas
leen como un perfil de egreso débil.

Tres situaciones de llegada confirmadas, las tres reales, ninguna dominante:

- **Teléfono, en tiempos muertos.** Entre clases, en un pasillo, en el transporte. Una sola mano,
  atención corta, posiblemente con mala red del campus.
- **Laptop, sesión deliberada.** En un laboratorio o en casa, sentándose a propósito a terminar el
  diagnóstico. Hay espacio para más densidad y lectura más larga.
- **Un enlace compartido en frío.** Llega por WhatsApp o Discord sin contexto. El estudiante decide
  en segundos si vale la pena siquiera entrar.

*No* se presenta ante un grupo ni lo guía un presentador. No hay nadie ahí para explicarlo.

**Segunda audiencia, ahora mismo — el jurado de evaluación de la fase 1.** La propuesta se juzga
antes de que cualquier estudiante la adopte, y el sitio forma parte de ese juicio (ver Operating
Context). Por lo tanto tiene que sostenerse tanto ante una valoración técnica como ante el uso real
en un pasillo. El jurado lo ve primero.

**Beneficiarios indirectos.** La Facultad de Ingeniería (indicadores de calidad de egreso y
titulación) y las empresas tecnológicas de la región que buscan talento especializado.

## Product Purpose

PotroPath diagnostica la afinidad de un estudiante con cinco áreas tecnológicas de alta demanda y
convierte ese diagnóstico en una ruta de crecimiento concreta: las habilidades que el mercado exige
para ese perfil, las certificaciones que las acreditan y una puerta inmediata a una comunidad
activa.

El éxito es un estudiante que llega con un interés vago y se va con tres cosas que no tenía: una
especialización con nombre, una lista corta de lo que la industria pide para ella, y una comunidad a
la que efectivamente se unió. El trabajo del producto es transformar un interés genuino en un perfil
de egreso competitivo — y hacerlo en los semestres en los que todavía hay tiempo de actuar.

## Positioning

PotroPath no es un test vocacional para elegir carrera. Es una **herramienta de micro-orientación
dentro de Ingeniería en Computación**: da por hecho que la decisión de carrera ya está tomada y
trabaja un nivel más abajo, donde ningún test general opera.

Su afirmación defendible es la especificidad hiper-local: el resultado se ata a lo que la industria
demanda *hoy* y a comunidades con nombre dentro de *esta* facultad — un Discord organizado por
canales de especialidad y la Rama Estudiantil IEEE UAEMéx con sus capítulos técnicos y sus eventos
presenciales. Un producto genérico de test de carrera puede copiar un cuestionario; no puede ofrecer
con verdad la capa de comunidad local, y no tiene por qué plantear el resultado como "qué hacer este
semestre, aquí".

## Operating Context

- **Sin registro, sin sesión, sin datos personales.** Es una decisión de producto deliberada para
  eliminar la fricción de entrada y maximizar la participación, no un atajo de la fase 1. El estado
  del cuestionario persiste localmente en el navegador (`localStorage`, clave `potropath-quiz`), así
  que una sesión sobrevive al cierre de la pestaña.
- **Flujo principal:** Inicio → Diagnóstico → Mi ruta (resultados) → Comunidad. Las rutas son `/`,
  `/quiz`, `/resultados`, `/comunidad`.
- **El diagnóstico son 50 preguntas**, 10 por área, cada una en una escala de acuerdo de 1 a 5, una
  pregunta por pantalla, con barra de progreso visible y estado reanudable. Es lo más grande que
  pide el producto y está en tensión con el posicionamiento sin fricción: es un costo conocido y
  aceptado.
- **Español (es-MX) en todo.** Toda la copy del producto, el texto de las preguntas y la interfaz.
- **Ritmo de entrega.** La fase 1 es un envío remoto por el portal de inscripción que cubre la
  valoración técnica y la presentación de la propuesta, con un peso del 50% de la ponderación
  global; la documentación debe ser nítida, íntegra y sustentable.

## Capabilities and Constraints

- **Solo del lado del cliente.** React + Vite, Tailwind CSS v4, React Router, Zustand (persistido) y
  GSAP para el movimiento. Sin ida y vuelta al servidor durante el diagnóstico.
- **El contenido son módulos de datos estáticos**, no un CMS: preguntas, áreas y ruta viven en
  `src/data/`. Cambiarlos es un cambio de código.
- **Cinco áreas fijas:** Inteligencia Artificial, Ciberseguridad, Cloud Computing, Ciencia de Datos
  y Desarrollo de Software.
- **Modelo de puntaje:** cada pregunta suma únicamente a su propia área; los totales por área se
  normalizan a un porcentaje de afinidad de 0 a 100 y se ordenan. Se muestran los cinco puntajes, no
  solo el ganador.
- **Supabase (PostgreSQL) está planeado solo para analíticas anónimas agregadas** — recolectar
  resultados finales sin autenticación y sin perfiles de usuario, para que medir nunca cueste
  participación.
- **La migración institucional es una restricción futura real.** Fases posteriores contemplan mover
  el backend a PHP y bases de datos locales para alinearse a la infraestructura de la UAEMéx y
  asegurar la adopción oficial. La arquitectura debe mantenerse lo bastante modular para no pelearse
  con eso.
- **Sin decidir:** si las analíticas agregadas llegan a ser algo que el estudiante ve, y cómo sería
  una capa de cuenta o de seguimiento de progreso post-MVP (deliberadamente fuera de alcance por
  ahora).

## Brand Commitments

- **Nombre:** PotroPath. Contexto institucional: UAEMéx, Facultad de Ingeniería.
- **La paleta oficial de la UAEMéx es vinculante**, tomada del manual de identidad de la
  Administración Universitaria: dos colores principales (`#526855` verde, `#ca9e52` oro) y tres
  secundarios (`#f2f2f2`, `#384033`, `#a15c17`). Los tintes derivados de superficie y texto deben
  seguir siendo variaciones de esos cinco y nunca introducir colores sueltos fuera del sistema.
- **El manual de identidad restringe el color.** No se ha establecido ningún mandato institucional
  sobre tipografía, layout o movimiento — esos siguen siendo decisiones de diseño abiertas, no
  restricciones heredadas.
- **Activos institucionales reales disponibles:**
  - `public/images/vitral-biblioteca.png` — fotografía del vitral real de la biblioteca de la
    Facultad de Ingeniería; un panorámico muy ancho (~8.9:1) de sus cuatro paneles de vidrio.
  - `public/images/potro-mascota.png` — la mascota de la universidad, recortada de su fondo
    original.
- **Voz:** español, directa y sin condescendencia — se dirige a los estudiantes como futuros
  profesionales que están tomando una decisión real, no como niños a los que se orienta.

## Evidence on Hand

**Real y utilizable hoy:**

- El banco de 50 preguntas (10 por área) y la escala de acuerdo de 1 a 5.
- El contenido de ruta por área: habilidades demandadas y certificaciones de referencia para las
  cinco áreas.
- La fotografía del vitral y la mascota (rutas arriba).
- Cuatro nombres de capítulos IEEE (Computer Society, Robotics and Automation, Power & Energy
  Society, Women in Engineering) — actualmente marcados en la interfaz como pendientes de confirmar
  contra los capítulos realmente activos de la rama.

**Confirmado como próximo, pero todavía no real.** Cada uno de estos llegará a ser dato real; hasta
entonces debe presentarse honestamente como pendiente y nunca simularse como si existiera:

- El enlace de invitación al servidor de Discord (`DISCORD_INVITE_URL` es actualmente `null`).
- La lista confirmada de capítulos IEEE y una agenda real de eventos (`events` está vacío).
- La estadística de titulación de la UAEMéx que sustentará el planteamiento (nota placeholder en el
  README).
- El backend de analíticas anónimas en Supabase.

**Ausente por completo — nunca debe fabricarse.** Ningún estudiante ha usado este producto todavía.
No hay testimonios, ni conteos de usuarios, ni cifras de adopción, ni convenios con empresas, ni
estadísticas de colocación o salario, ni respaldos, ni aprobación institucional. Cualquiera de estas
cosas apareciendo como contenido sería un invento.

## Product Principles

1. **No se pide nada antes de dar algo.** Sin cuenta, sin correo, sin datos personales. Cualquier
   cambio que ponga una petición delante del valor es un retroceso, por pequeño que sea.
2. **Un diagnóstico sin siguiente acción no vale nada.** Todo resultado debe terminar en algo
   concreto que el estudiante pueda hacer esta semana — una habilidad que empezar, una certificación
   que perseguir, una comunidad a la que entrar. Nunca una etiqueta sola.
3. **Ganarse las cincuenta preguntas.** El diagnóstico es lo más grande que pide el producto. El
   progreso debe ser siempre legible y reanudable, y el pago debe sentirse visiblemente proporcional
   al costo.
4. **La verdad local le gana al consejo genérico.** La especificidad de esta facultad — su vitral,
   su mascota, su rama IEEE, su Discord — es toda la ventaja. El lenguaje de test de carrera
   genérico la disuelve en algo que cualquier sitio podría decir.
5. **Nunca fabricar un dato institucional.** Lo pendiente se declara pendiente. Un placeholder
   disfrazado de dato real costaría exactamente la credibilidad institucional que este proyecto
   existe para ganarse.

## Accessibility & Inclusion

- **Contenido en español primero (es-MX)**; el idioma de la interfaz no es negociable para esta
  audiencia.
- **El movimiento reducido ya es un compromiso honrado.** Todo el movimiento está condicionado a la
  preferencia `prefers-reduced-motion` del usuario; es un requisito permanente, no una mejora
  opcional.
- **Los teléfonos con una red de campus posiblemente mala son un caso primario**, no un respaldo. El
  peso y la respuesta son requisitos de producto, no pulido.
- **Sin decidir:** si la adopción oficial de la UAEMéx impondría un estándar formal de accesibilidad
  (un nivel WCAG específico, por ejemplo). No se ha establecido tal requisito — no asumir ninguno, y
  no declarar una conformidad que no se ha probado.
