/**
 * Todos los datos editables de la invitación.
 * Imágenes locales: guarda los archivos en public/images y usa "images/archivo.webp".
 * Los campos vacíos muestran un estado pendiente u ocultan contenido opcional.
 */
export const event = {
  names: ['Dulce', 'Diogo'],
  age: 3,
  date: '2026-11-21',
  time: '15:30', // Hora civil de Ecuador, formato de 24 horas.
  timeZone: 'America/Guayaquil',
  venue: 'Villa Club',
  address: 'Urbanización Villa Club, etapa Júpiter, manzana 10, villa 20',
  mapsUrl: 'https://maps.google.com/maps?q=-2.03680157661438%2C-79.90084075927734&z=17&hl=es',
  whatsapp: {
    phone: '593991280243', // Ecuador: código de país + número, sin el cero nacional.
    message: '¡Hola! Quiero confirmar que asistiré al cumpleaños de Dulce María y Diogo Alejandro.\n\n¡Qué alegría poder acompañarlos en la celebración de sus 3 añitos!',
  },
  countdown: { enabled: true, showSeconds: true },
  children: [
    { name: 'Dulce María', theme: 'gwen', description: 'Una niña dulce, coqueta, curiosa y llena de personalidad. Le encantan los accesorios, los brillos, los animalitos pequeños, pintar y descubrirlo todo preguntando «¿Qué es eso?».\n\nEs parlanchina, traviesa, inteligente y, sobre todo, perseverante. Siente todo intensamente, ilumina con su alegría y nunca deja de intentarlo.', likes: [], image: 'images/illustrations/dulce-aventurera.webp', imageAlt: 'Dulce, de cabello negro y de rodillas, descubre unas pequeñas huellas con su disfraz rosa, crema y turquesa.', illustrationNote: '¿Qué es eso?' },
    { name: 'Diogo Alejandro', theme: 'dino', description: 'Un niño alegre, curioso y muy cariñoso. Le encantan los dinosaurios, los animales, la música y descubrir el mundo jugando.\n\nEs fuerte, ingenioso, colaborador y protector con su hermanita. Disfruta las cosas más sencillas, estar rodeado de su familia y compartir su alegría con una sonrisa y pequeños gestos llenos de cariño.', likes: [], image: 'images/illustrations/diogo-aventurero.webp', imageAlt: 'Diogo, en cuclillas con su disfraz de dinosaurio verde, señala unas pequeñas huellas.' },
  ],
  // De 3 a 5 fotos funcionan especialmente bien. Admite cualquier cantidad.
  // { src: 'images/recuerdo-01.webp', alt: 'Descripción de la fotografía', caption: '' }
  gallery: [
    { src: 'images/gallery/01-dulce.jpg', alt: 'Dulce sola, con un overol a rayas.', caption: 'Pequeña exploradora de grandes misterios.' },
    { src: 'images/gallery/02-diogo.jpg', alt: 'Diogo solo, sonriendo y juntando las manos.', caption: 'Un pequeño mundo de ocurrencias.' },
    { src: 'images/gallery/03-dulce-diogo-pintando.jpg', alt: 'Dulce y Diogo pintando juntos en una mesa con crayones.', caption: 'Manitos ocupadas, imaginación desatada.' },
    { src: 'images/gallery/04-dulce-diogo-sofa.jpg', alt: 'Dulce y Diogo sentados juntos en el sofá, sonriendo.', caption: 'Compañeros de juegos y travesuras.' },
  ],
  galleryPreview: { enabled: true, slots: 4 }, // Reservas ilustradas cuando aún no hay fotos.
  text: {
    heroTitle: 'Una aventura increíble',
    adventure: 'Dos mundos, una aventura',
    ageLine: '¡{age} añitos de alegría!',
    scroll: 'La aventura continúa',
    celebrationTitle: 'Nuestra gran celebración',
    dateIntro: 'Tenemos un día muy especial para compartir contigo.',
    timePending: 'Horario por confirmar',
    placePending: 'Muy pronto te contaremos dónde',
    addressPending: 'La dirección estará aquí en cuanto esté confirmada.',
    mapsButton: 'Cómo llegar',
    countdownTitle: '¡Ya casi comienza!',
    countdownPending: 'La fecha ya tiene un lugar en nuestro calendario.',
    countdownNote: 'Muy pronto, también tendrá una hora.',
    countdownStarted: '¡La aventura ha comenzado!',
    countdownStartedNote: 'Hoy celebramos juntos.',
    protagonistsTitle: 'Conoce a nuestros pequeños aventureros',
    portraitPending: 'Aquí comienza su historia',
    descriptionPlaceholder: 'Muy pronto, unas palabras sobre {name}.',
    likesPlaceholder: 'Sus favoritos, por descubrir.',
    draftLabel: 'Texto provisional',
    portraitCaption: 'Espacio para su ilustración en acuarela',
    galleryPlaceholder: '',
    galleryPreviewNote: '',
    placeKnown: 'Nos vemos en Villa Club',
    likesLabel: 'Pequeñas cosas que me gustan',
    galleryTitle: 'Tres añitos de recuerdos',
    galleryIntro: 'Instantes pequeños. Recuerdos enormes.',
    closingTitle: '¡Te esperamos!',
    closingMessage: 'La aventura será aún más bonita contigo.',
    confirmButton: 'Confirmar asistencia',
    whatsappPending: 'La confirmación por WhatsApp no está disponible.',
    whatsappNote: 'Confirma enviando el mensaje desde WhatsApp.',
  },
  seo: {
    title: 'Dulce y Diogo · ¡3 añitos de alegría!',
    description: 'Dos mundos, una aventura. Celebra con Dulce y Diogo su tercer cumpleaños, el 21 de noviembre de 2026.',
    siteUrl: '', // URL pública absoluta al conocer el dominio. Sin barra final.
    image: 'images/social.jpg',
  },
}
