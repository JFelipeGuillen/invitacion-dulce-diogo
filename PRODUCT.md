# Invitación Dulce y Diogo

## Propósito y público

Familiares y amigos consultan desde el móvil la información del tercer cumpleaños y acceden a WhatsApp para confirmar asistencia. La landing se abre desde la invitación PDF, sin repetir su botón ni simular que sigue dentro del PDF.

## Implementación vigente

Vite, HTML semántico, CSS y JavaScript modular. Una página estática con seis secciones: hero, fecha/hora/lugar con calendario, cuenta regresiva, presentaciones individuales, álbum y cierre. Sin backend, base de datos, formularios, analíticas, música automática ni solicitudes de regalos.

`src/config/event.js` es la fuente de datos: evento el 21 de noviembre de 2026 a las 15:30 en `America/Guayaquil`, lugar y Google Maps configurados. El teléfono de WhatsApp y la URL pública definitiva siguen pendientes. La confirmación se produce cuando el invitado envía el mensaje en WhatsApp; la web no registra respuestas.

El calendario es de lunes a domingo y se deriva de la fecha configurada. La fecha del evento y el día actual tienen marcas distinguibles, incluso al coincidir. El contador respeta la zona horaria, evita negativos y mantiene estados honestos al faltar la hora o comenzar la celebración.

## Contenido aprobado

- Hero editorial asimétrico de la propuesta A: «Una aventura increíble», «Dulce y Diogo», edad, ilustraciones independientes y fecha pequeña. No volver a usar recortes históricos del PDF como personajes del hero.
- Presentaciones: Dulce María y Diogo Alejandro; descripciones definitivas en dos párrafos, sin edad repetida ni bloque de preferencias. Ilustraciones nuevas y distintas de las poses del hero. Dulce tiene cabello negro, señala huellas y lleva la anotación «¿Qué es eso?».
- Galería: cuatro fotos reales cuadradas, en el orden de la configuración, con sus pies definitivos. No inventar recuerdos ni modificar sus encuadres. Ampliación accesible con teclado.
- Si la galería está vacía, `galleryPreview.enabled` permite mostrar reservas ilustradas; desactivarlo oculta la sección. Los destinos de mapa y WhatsApp inválidos no producen enlaces falsos.

## Identidad y mantenimiento

Concepto «Dos mundos, una aventura»: cuento continuo de acuarela infantil sobre marfil, con igual protagonismo para ambos niños. `DESIGN.md` recoge la dirección visual vigente; `AGENTS.md` establece las restricciones del proyecto.

Las referencias privadas permanecen intactas en `references/`. Los renders 3D nunca se muestran en la web. `public/` contiene solo archivos finales utilizados; el fixture vive en `tests/fixtures/`. Originales, versiones antiguas y procedencia se preservan en `.local-archive/`, fuera de Git y del despliegue.

No publicar, conectar remotos ni modificar el historial sin autorización expresa. Netlify compila con `npm run build` y publica `dist/`.
