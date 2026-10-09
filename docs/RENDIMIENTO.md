# Rendimiento medido

Medición de laboratorio del 8 de octubre de 2026. Compara la versión anterior (`main`, `78072f5`)
con el rediseño (`rediseno/guia-editorial`). Son datos de laboratorio con red simulada, no datos de
campo de estudiantes reales.

## 1. Condiciones

| Variable | Valor |
|---|---|
| Herramienta | Lighthouse 13.5.0 (categoría Rendimiento), vía Node |
| Navegador | Chrome 154.0.8037.98, sin interfaz |
| Equipo | Apple M5, macOS 26.6.2 |
| Servidor | `vite preview` local de cada build de producción (sin CDN ni compresión del hosting final) |
| Perfil móvil | Predeterminado de Lighthouse: teléfono de gama media emulado, 4G lento simulado (≈1.6 Mbps, 150 ms RTT), CPU ×4 más lenta |
| Perfil escritorio | Configuración `desktop` de Lighthouse |
| Caché | Vacía en cada corrida |
| Repeticiones | 5 por ruta, versión y perfil; se reporta la **mediana** y el rango [mín–máx] |
| Rutas | `/`, `/quiz`, `/comunidad` (Resultados requiere 50 respuestas guardadas y no se mide en frío) |

## 2. Resultados

### Móvil

| Ruta | Versión | Puntaje | FCP | LCP | CLS | Peso transferido |
|---|---|---|---|---|---|---|
| Inicio | Anterior | 82 [82–94] | 1.96 s | 4.65 s [2.81–4.66] | 0.000 | 839 KB |
| Inicio | **Rediseño** | **94** [94–94] | **1.65 s** | **3.01 s** [3.00–3.01] | 0.001 | **541 KB** |
| Diagnóstico | Anterior | 93 [85–93] | 1.96 s | 3.00 s [3.00–3.75] | 0.000 | 412 KB |
| Diagnóstico | **Rediseño** | **99** [99–99] | **1.65 s** | **1.80 s** | 0.000 | **179 KB** |
| Comunidad | Anterior | 77 [75–83] | 1.96 s | 5.71 s [4.35–5.71] | 0.000 | 1162 KB |
| Comunidad | **Rediseño** | **92** [92–92] | **1.65 s** | **3.23 s** | 0.000 | **591 KB** |

### Escritorio

| Ruta | Versión | Puntaje | FCP | LCP | CLS | Peso |
|---|---|---|---|---|---|---|
| Inicio | Anterior | 99 | 0.49 s | 1.02 s | 0.001 | 839 KB |
| Inicio | **Rediseño** | **100** | **0.41 s** | **0.66 s** | 0.001 | **601 KB** |
| Diagnóstico | Anterior | 100 | 0.48 s | 0.80 s | 0.001 | 412 KB |
| Diagnóstico | **Rediseño** | **100** | **0.41 s** | **0.44 s** | 0.000 | **179 KB** |
| Comunidad | Anterior | 97 | 0.49 s | 1.21 s | 0.005 | 1306 KB |
| Comunidad | **Rediseño** | **100** | **0.45 s** | **0.79 s** | 0.012 | **923 KB** |

En las 60 corridas el bloqueo total del hilo principal (TBT) fue 0 ms.

### Bundle

| | Anterior | Rediseño |
|---|---|---|
| JavaScript de entrada (gzip) | 141.9 kB | 96.0 kB (−32%) |
| Fragmento de Matter.js (bajo demanda) | 26.2 kB | — |
| CSS (gzip) | 7.2 kB | 7.9 kB |

## 3. Lo que enseñó la primera medición

La primera versión del rediseño **empeoraba** el primer pintado en móvil: FCP de 2.46 s contra 1.96 s
de la anterior, en las tres rutas, incluso en `/quiz`, que pesaba menos. La causa común era la
franja decorativa del vitral, que para pintar 8 px descargaba el panorámico completo de 207 KB. Se
sustituyó por un recorte de 12 KB (`vitral-franja.webp`) y las fotos de hero pasaron a servirse a
720 px en teléfonos con `srcset`. Con eso el rediseño quedó por delante en todas las métricas. Las
dos rondas están en este documento a propósito: la mejora se demostró midiendo, no se supuso.

## 4. Límites

- Laboratorio, no campo: un teléfono real en la red del campus puede comportarse distinto. El
  piloto (`PILOTO.md`) debería registrar dispositivo y red de cada sesión.
- El servidor local no comprime con Brotli ni usa CDN; el hosting final puede mejorar o empeorar
  estas cifras. Hay que repetir la medición sobre la URL definitiva.
- En la versión anterior el titular del hero empezaba oculto por animación; Lighthouse mide cuándo
  se pinta, no cuándo se vuelve legible, así que su LCP no refleja del todo esa espera.
- El peso del bundle no es una medida de usabilidad ni de escalabilidad del servicio.
- Un futuro servicio de datos necesitaría sus propias pruebas de carga y errores.

## 5. Cómo repetirla

```bash
npm run build && npm run preview          # http://localhost:4173
npx lighthouse http://localhost:4173/ --only-categories=performance --output=json --output-path=./movil-inicio.json
npx lighthouse http://localhost:4173/ --only-categories=performance --preset=desktop --output=json --output-path=./escritorio-inicio.json
```

Repetir cinco veces por ruta y reportar mediana y rango junto con versión (commit), navegador,
equipo, red y fecha. **Presupuesto propuesto** a partir de esta línea base: en móvil, LCP ≤ 3.5 s y
peso ≤ 650 KB en las rutas públicas; JavaScript de entrada ≤ 110 kB gzip. Un cambio que lo rompa
debe justificarse aquí.
