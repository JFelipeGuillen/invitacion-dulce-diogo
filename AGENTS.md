# Invitación Dulce y Diogo

- Stack: Vite + HTML, CSS y JavaScript modular. No añadir framework, backend, formularios de confirmación ni base de datos.
- Leer PRODUCT.md y DESIGN.md antes de cambiar la interfaz. Dirección fijada: «Dos mundos, una aventura», cuento continuo de acuarela infantil sobre papel marfil.
- `src/config/event.js` es la fuente editable de datos. No inventar información personal ni preferencias. Las descripciones personales y los pies de foto actuales están aprobados; conservarlos salvo petición expresa. No repetir la edad en los bloques individuales.
- Nunca modificar `references/`. Los renders 3D son referencias futuras y nunca deben aparecer en la web. Publicar solo recursos finales necesarios. Los originales y versiones anteriores se conservan en `.local-archive/`, excluido de Git; los fixtures están en `tests/fixtures/` y no se publican.
- Sin wishlist, música automática, analíticas, cookies ni fotos inventadas de menores.
- Mantener las seis secciones implementadas. La galería vacía muestra reservas ilustradas cuando `galleryPreview.enabled` está activo; si se desactiva se oculta. Hora, ubicación y WhatsApp vacíos deben conservar estados honestos sin enlaces falsos.
- Fechas civiles en `America/Guayaquil`. Calendario lunes–domingo, evento inicial 2026-11-21.
- Respetar teclado, contraste, texto alternativo y movimiento reducido. Evitar tarjetas repetidas, fondos alternados y sombras grandes.
- Tras cambios de comportamiento: `npm test`, pruebas de navegador apropiadas y `npm run build`. Playwright incluye axe y capturas de 320, 390, 430 y 1440px.
- El sitio está preparado para Netlify; no publicar sin instrucción explícita del usuario.
