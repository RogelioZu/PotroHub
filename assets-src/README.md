# Originales

Masters sin comprimir de los activos institucionales. **No se sirven**: viven
fuera de `public/`, así que Vite no los copia al build. Lo que la aplicación
consume está en `public/images/`.

- `vitral-biblioteca.png` — 2736x308, 1.8 MB. Fotografía real del vitral de la
  biblioteca de la Facultad de Ingeniería (UAEMéx).
- `potro-mascota.png` — 413x688, 329 KB. Mascota de la universidad, recortada
  de su fondo gris original. Está en RGB: el alfa se recuperó al derivar
  `public/images/potro-mascota.webp`.

`ieee_assets/` son los logotipos oficiales de los cuatro capítulos de la Rama
IEEE, descargados de la marca de cada sociedad y **sin modificar**:

- `IEEE-CS_LogoTM-orange copy.png` — 780x240. Computer Society, variante de
  texto negro. La de texto blanco existe y **no sirve aquí**: el panel de
  marcas de Comunidad es papel, y sobre blanco desaparecen la diagonal y las
  tres líneas del wordmark y queda el bug naranja suelto.
- `IEEE_RAS_logo_4C_stacked copy.png` — 638x235. Robotics and Automation
  Society, versión apilada a cuatro tintas.
- `IEEE PES Logo RGB copy.png` — 268x187. Power & Energy Society. Es el
  original más chico de los cuatro; alcanza para el recuadro a `2x` y no
  conviene escalarlo hacia arriba.
- `logo WIE Purple with line_600_RGB_Color copy.png` — 1523x1536. Women in
  Engineering, morado `#742780` sobre transparente.

`ieee_img2.jpeg` — 1200x1600. Estudiantes de UPIITA-IPN con reconocimientos
del hackathon U-HACKS. Es la que consume el bloque *Explora más allá del salón*
de Comunidad, recortada a cuadrado desde abajo al derivarla. **No es de la
UAEMéx**: mientras siga en el sitio, el copy a su alrededor no puede
presentarla como gente de esta facultad.

`ieee_img.jpg` — 760x570. Estudiantes de la Rama Estudiantil IEEE de la UAM
Lerma. **Sin usar**: la sustituyó `ieee_img2.jpeg`.

Los cuatro logotipos vienen recortados al contenido: su caja alfa es la imagen completa,
sin márgenes que quitar, así que el alto en CSS mapea directo al tamaño óptico.

Al regenerar un derivado, actualiza `public/images/README.md` con las medidas
nuevas.
