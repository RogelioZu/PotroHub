/**
 * Las detonadoras de respaldo: dos preguntas por área, escritas a mano, con la
 * misma forma exacta que devuelve `/api/detonadoras`.
 *
 * Existen porque la llamada a Qwen puede fallar por razones que el estudiante
 * no controla —la red del campus, la cuota agotada, el servicio caído— y el
 * afinado no puede depender de eso. Tampoco el jurado: si Cerebras no responde
 * a mitad de una evaluación, el sitio sigue completo.
 *
 * No son las de la IA disfrazadas. La interfaz dice cuáles son de respaldo, y
 * por eso estas no aluden a las respuestas del estudiante: no las leyeron.
 *
 * Cada pregunta pone frente a frente los tres enfoques de su área, y las
 * situaciones son hipotéticas a propósito: "imagina una app que se cae" y no
 * "la app de la facultad se cae", que sería afirmar algo que no sabemos.
 */
export const FALLBACK_TRIGGERS = {
  ia: [
    {
      prompt: 'Tienes un fin de semana libre y acceso a una GPU. ¿Qué construyes?',
      options: [
        { text: 'Un asistente que responda dudas sobre un reglamento leyendo sus PDF.', focusId: 'ia-lenguaje' },
        { text: 'Un sistema que cuente cuántas personas entran a un edificio a partir de una cámara.', focusId: 'ia-vision' },
        { text: 'Un modelo que prediga la demanda de una cafetería, con su pipeline listo para reentrenarse.', focusId: 'ia-modelado' },
      ],
    },
    {
      prompt: 'Un modelo que ya funcionaba empieza a fallar. ¿Qué parte del problema quieres que te toque?',
      options: [
        { text: 'Averiguar por qué el chatbot afirma con seguridad cosas que no son ciertas.', focusId: 'ia-lenguaje' },
        { text: 'Descubrir por qué el detector confunde objetos cuando cambia la iluminación.', focusId: 'ia-vision' },
        { text: 'Detectar que los datos de entrada cambiaron y automatizar el reentrenamiento.', focusId: 'ia-modelado' },
      ],
    },
  ],
  ciberseguridad: [
    {
      prompt: 'Una empresa te contrata por una semana. ¿Qué encargo eliges?',
      options: [
        { text: 'Entrar a su red como lo haría un atacante y reportar cómo lo lograste.', focusId: 'ciber-ofensiva' },
        { text: 'Vigilar sus alertas y reconstruir qué pasó en un incidente reciente.', focusId: 'ciber-defensa' },
        { text: 'Revisar el código de su app de pagos antes de que salga a producción.', focusId: 'ciber-appsec' },
      ],
    },
    {
      prompt: '¿Cuál de estos hallazgos te daría más satisfacción?',
      options: [
        { text: 'Encadenar tres fallas pequeñas hasta obtener acceso de administrador.', focusId: 'ciber-ofensiva' },
        { text: 'Detectar un ataque en curso y contenerlo antes de que se lleve datos.', focusId: 'ciber-defensa' },
        { text: 'Demostrar que las contraseñas se guardaban mal y dejar el cifrado bien hecho.', focusId: 'ciber-appsec' },
      ],
    },
  ],
  nube: [
    {
      prompt: 'Imagina una app de inscripciones que se cae cada inicio de semestre. ¿Qué parte del arreglo tomas?',
      options: [
        { text: 'Rediseñar la arquitectura para que escale sola y cueste menos el resto del año.', focusId: 'nube-arquitectura' },
        { text: 'Automatizar el despliegue para que cada cambio llegue a producción sin pasos manuales.', focusId: 'nube-devops' },
        { text: 'Instrumentar la app, medir dónde falla y preparar la guía para el próximo incidente.', focusId: 'nube-sre' },
      ],
    },
    {
      prompt: '¿Qué te gustaría poder decir de tu primer año de trabajo?',
      options: [
        { text: 'Diseñé la infraestructura que hoy usan diez equipos.', focusId: 'nube-arquitectura' },
        { text: 'Bajé el tiempo de despliegue de una hora a cinco minutos.', focusId: 'nube-devops' },
        { text: 'Llevamos seis meses sin una caída que afecte a los usuarios.', focusId: 'nube-sre' },
      ],
    },
  ],
  'ciencia-datos': [
    {
      prompt: 'Una universidad quiere entender por qué algunos estudiantes dejan la carrera. ¿Qué parte del trabajo tomas?',
      options: [
        { text: 'Un tablero que muestre a la dirección dónde y cuándo se concentra el abandono.', focusId: 'datos-analitica' },
        { text: 'Un modelo que estime el riesgo de abandono y diga qué factores pesan más.', focusId: 'datos-modelado' },
        { text: 'Reunir en una sola base los datos dispersos de control escolar y mantenerlos al día.', focusId: 'datos-ingenieria' },
      ],
    },
    {
      prompt: '¿Con cuál de estos problemas te quedarías una tarde entera?',
      options: [
        { text: 'Encontrar la gráfica que vuelva obvia una conclusión que nadie veía.', focusId: 'datos-analitica' },
        { text: 'Decidir si la diferencia entre dos grupos es real o es casualidad.', focusId: 'datos-modelado' },
        { text: 'Lograr que un proceso que tarda horas con millones de registros tarde minutos.', focusId: 'datos-ingenieria' },
      ],
    },
  ],
  software: [
    {
      prompt: 'Tu equipo va a construir una app para reservar laboratorios. ¿Qué parte pides?',
      options: [
        { text: 'La interfaz web y móvil: que reservar tome tres toques y se entienda sin instrucciones.', focusId: 'sw-producto' },
        { text: 'El servidor: el modelo de datos, la API y que nadie reserve dos veces el mismo horario.', focusId: 'sw-arquitectura' },
        { text: 'Las pruebas: encontrar los casos raros antes que los usuarios y automatizarlos.', focusId: 'sw-calidad' },
      ],
    },
    {
      prompt: '¿Qué comentario sobre tu trabajo te gustaría escuchar?',
      options: [
        { text: 'Es la app más fácil de usar que he visto en la universidad.', focusId: 'sw-producto' },
        { text: 'El sistema aguantó el doble de usuarios sin cambiar una línea.', focusId: 'sw-arquitectura' },
        { text: 'Desde que llegaste no ha salido un solo error grave a producción.', focusId: 'sw-calidad' },
      ],
    },
  ],
}
