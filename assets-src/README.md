# Originales

Masters sin comprimir de los activos institucionales. **No se sirven**: viven
fuera de `public/`, así que Vite no los copia al build. Lo que la aplicación
consume está en `public/images/`.

- `vitral-biblioteca.png` — 2736x308, 1.8 MB. Fotografía real del vitral de la
  biblioteca de la Facultad de Ingeniería (UAEMéx).
- `potro-mascota.png` — 413x688, 329 KB. Mascota de la universidad, recortada
  de su fondo gris original. Está en RGB: el alfa se recuperó al derivar
  `public/images/potro-mascota.webp`.

Al regenerar un derivado, actualiza `public/images/README.md` con las medidas
nuevas.
