# Dulce y Diogo · Dos mundos, una aventura

Invitación al tercer cumpleaños de Dulce y Diogo. Landing estática en español, mobile-first, construida con Vite, HTML, CSS y JavaScript modular. Sin framework de componentes, backend, formularios ni almacenamiento de confirmaciones.

## Instalar y ejecutar

Se recomienda Node.js 22.12 o superior de la rama 22, como en Netlify, y npm. El lockfile fija las dependencias.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

La compilación genera `dist/`. No requiere referencias privadas, herramientas de asistentes, archivos originales de ilustración ni variables secretas.

## Configurar la invitación

La fuente editable es `src/config/event.js`. Después de modificarla, vuelve a compilar para publicar.

| Campo | Función |
| --- | --- |
| `names`, `age` | Nombres breves y edad del hero y textos generales. |
| `date`, `time`, `timeZone` | Fecha, hora civil y zona horaria; actualizan calendario y contador. |
| `venue`, `address`, `mapsUrl` | Lugar, dirección y enlace real de Google Maps. |
| `whatsapp.phone`, `whatsapp.message` | Número con código de país y mensaje de confirmación. |
| `countdown` | Activación y visualización de segundos. |
| `children[].name` | Nombres completos exclusivos de las presentaciones individuales. |
| `children[].description` | Descripción aprobada; separar párrafos con `\n\n`. |
| `children[].image`, `imageAlt`, `illustrationNote` | Ilustración, texto alternativo y anotación opcional. |
| `gallery` | Fotos en orden, cada una con `src`, `alt` y `caption` opcional. |
| `galleryPreview` | Reservas ilustradas si no hay fotos; desactivarlo oculta la galería vacía. |
| `text`, `seo` | Textos generales y metadatos para compartir. |

La celebración está configurada para el 21 de noviembre de 2026 a las 15:30 en `America/Guayaquil`. La hora visible no repite la zona horaria. El calendario empieza en lunes; destaca el evento y distingue el día actual. Sin hora válida no se muestran cifras ficticias; después del comienzo aparece el mensaje de celebración.

El hero conserva «Dulce y Diogo». Las presentaciones muestran «Dulce María» y «Diogo Alejandro», con sus descripciones definitivas en dos párrafos. No repiten la edad ni muestran listas de preferencias o regalos. `children[].likes` y algunas claves de texto anteriores permanecen por compatibilidad de configuración, pero las presentaciones actuales no las renderizan.

Google Maps abre una URL válida en otra pestaña. La confirmación abre `wa.me`; el invitado debe enviar el mensaje desde WhatsApp y la web no registra respuestas. Si falta un destino válido se muestra un estado honesto sin enlace funcional. El destino y el mensaje de WhatsApp están configurados; el invitado debe enviar el mensaje preparado para confirmar.

## Imágenes y galería

`public/` contiene únicamente el favicon, las decoraciones, la imagen social, cuatro ilustraciones WebP y cuatro fotografías JPG. Vite copia todo ese directorio a `dist/`.

- Hero: `images/illustrations/hero-dulce.webp` y `hero-diogo.webp`.
- Presentaciones: `images/illustrations/dulce-aventurera.webp` y `diogo-aventurero.webp`.
- Galería: `images/gallery/01-dulce.jpg`, `02-diogo.jpg`, `03-dulce-diogo-pintando.jpg` y `04-dulce-diogo-sofa.jpg`.
- Vista previa social: `images/social.jpg`, de 1200 × 630.

Las cuatro fotos son cuadradas y conservan sus encuadres. Sus pies definitivos están en `gallery[].caption`; un pie vacío no genera texto ni espacio adicional. La ampliación usa un diálogo nativo, cierra con Escape y devuelve el foco a la foto.

Para sustituir un recurso, incorpora el archivo final a `public/images/` y actualiza su ruta relativa en la configuración cuando corresponda. Conserva las identidades e ilustraciones aprobadas; no publiques originales 3D, fotos ficticias ni versiones históricas. Las fuentes se sirven localmente desde los paquetes Fontsource, sin llamadas a Google Fonts.

## Organización y archivo local

- `src/main.js`: composición de la página.
- `src/components/`: calendario, contador, protagonistas y galería.
- `src/lib/event.js`: fechas, enlaces y utilidades.
- `src/style.css`, `src/styles/`: estilos aprobados.
- `tests/`: pruebas; `tests/fixtures/scene.webp` es una ilustración de prueba que Playwright sirve mediante interceptación, sin publicarla.
- `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`: contexto y reglas vigentes del proyecto.
- `hero-a.html`, `hero-b.html`, `src/previews/`: referencias visuales conservadas para las pruebas de previews. No son entradas del build ni se publican.

`.local-archive/` preserva originales PNG, portadas anteriores, procedencia y documentos previos a la limpieza. Su manifiesto registra las reubicaciones y hashes. Este archivo, `references/` y las herramientas locales de asistentes se excluyen de Git y del despliegue. El archivo local no se recupera al clonar el repositorio; conserva una copia privada independiente si necesitas esos originales.

`scripts/prepare-assets.mjs` es una utilidad opcional para regenerar las decoraciones desde `references/invitacion-aprobada.png`:

```sh
npm run assets:prepare
```

Requiere la referencia privada, nunca la modifica y no es parte del build. Escribe la escena de prueba en `tests/fixtures/` y la procedencia en `.local-archive/`, no en el directorio público. El generador de la antigua escena conjunta se conserva únicamente en el archivo local.

## Validaciones

```sh
npm test
npm run test:browser
npm run build
```

Si Chromium no está instalado para Playwright:

```sh
npx playwright install --with-deps chromium
```

Las pruebas cubren fechas y zona horaria, contador, enlaces, estados incompletos, imágenes fallidas, galería y pies de foto, teclado, accesibilidad con axe y composición responsive. Playwright levanta o reutiliza Vite en `127.0.0.1:5173`; sus capturas y resultados quedan excluidos de Git. Las vistas A/B conservan sus pruebas existentes, aunque no se despliegan.

## Desplegar en Netlify

`netlify.toml` ya define:

- Directorio base: raíz del repositorio.
- Build command: `npm run build`.
- Publish directory: `dist`.
- Node.js: 22.

Netlify instala las dependencias y compila desde el código versionado. No subas `node_modules/` ni `dist/` al repositorio. No se necesita redirección SPA: la página solo utiliza enlaces internos y destinos externos.

Antes de publicar, establece `seo.siteUrl` con la URL pública definitiva. Si está vacío, el build aprovecha `URL` o `DEPLOY_PRIME_URL` del entorno de Netlify para generar metadatos absolutos. En una compilación local sin esas variables, las URLs sociales pueden seguir relativas. El contenido de `event.js` se incluye en el cliente; no guardes secretos allí ni en variables `VITE_*`.

El despliegue previsto es en la raíz (`/`). Existe soporte parcial de `VITE_BASE_PATH`, pero la textura CSS del papel usa `/images/paper.webp`; para alojarlo en un subdirectorio habría que adaptar esa ruta antes. Esta preparación no modifica el diseño ni publica el sitio.

El repositorio contiene fotografías e información familiar aprobadas para la invitación; elige su visibilidad en GitHub de forma consciente. No se configura un remoto ni se realizan commits o push automáticamente.
