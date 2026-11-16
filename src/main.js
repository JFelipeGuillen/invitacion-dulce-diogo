import '@fontsource/boogaloo/latin-400.css'
import '@fontsource/lilita-one/latin-400.css'
import '@fontsource/caveat/latin-700.css'
import '@fontsource/patrick-hand/latin-400.css'
import '@fontsource/nunito-sans/latin-400.css'
import '@fontsource/nunito-sans/latin-600.css'
import '@fontsource/nunito-sans/latin-700.css'
import './style.css'
import './styles/hero.css'
import './styles/protagonists.css'
import { renderProtagonist } from './components/protagonists.js'
import { event } from './config/event.js'
import { assetUrl, escapeHtml as e, fill, formatDate, mapsLink, whatsappLink } from './lib/event.js'
import { renderCalendar, watchCalendar } from './components/calendar.js'
import { mountCountdown } from './components/countdown.js'
import { renderGallery, mountGallery } from './components/gallery.js'

const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
const names = `${event.names.slice(0, -1).join(', ')} y ${event.names.at(-1)}`
const words = value => fill(value, { names, age: event.age })
const image = (name, className = '', extra = '') => `<img class="decoration ${className}" src="${assetUrl(`images/${name}.webp`)}" alt="" aria-hidden="true" ${extra} width="250" height="250">`
const flourish = '<span class="flourish" aria-hidden="true"><i></i><i></i><i></i></span>'
const trail = `<svg class="trail" viewBox="0 0 140 160" fill="none" aria-hidden="true"><path d="M96 4C20 32 133 62 68 89S20 124 58 152" stroke="currentColor" stroke-dasharray="2 9" stroke-linecap="round" stroke-width="2"/><g fill="currentColor"><ellipse cx="91" cy="40" rx="5" ry="8" transform="rotate(-30 91 40)"/><circle cx="83" cy="30" r="2.5"/><circle cx="89" cy="28" r="2.5"/><circle cx="95" cy="30" r="2.5"/><ellipse cx="44" cy="112" rx="5" ry="8" transform="rotate(30 44 112)"/><circle cx="39" cy="101" r="2.5"/><circle cx="45" cy="100" r="2.5"/><circle cx="51" cy="103" r="2.5"/></g></svg>`
const map = mapsLink(event.mapsUrl)
const whatsapp = whatsappLink(event.whatsapp.phone, words(event.whatsapp.message))
const hasTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)


export function renderPage() {
  return `<a class="skip-link" href="#celebracion">Saltar a los datos de la fiesta</a>
  <main>
    <section class="hero section" aria-labelledby="hero-title">
      <p class="opening">${e(event.text.heroTitle)}</p>
      <h1 id="hero-title" class="hero-names" aria-label="${e(names)}"><span class="name-dulce">${e(event.names[0])}</span><span class="and">y</span><span class="name-diogo">${e(event.names[1])}</span></h1>
      <img class="hero-child dulce" src="${assetUrl('images/illustrations/hero-dulce.webp')}" alt="Dulce saluda en su disfraz arácnido rosa y turquesa, en acuarela." width="600" height="800" fetchpriority="high">
      <img class="hero-child diogo" src="${assetUrl('images/illustrations/hero-diogo.webp')}" alt="Diogo saluda con su disfraz de dinosaurio verde, en acuarela." width="600" height="800" fetchpriority="high">
      <p class="age-line">${e(words(event.text.ageLine))}</p>
      ${image('leaf','hero-leaf')}${image('web-pink','hero-web')}${image('sprig','hero-sprig')}
      <span class="paint-mark" aria-hidden="true"></span><span class="hero-rays" aria-hidden="true"><i></i><i></i><i></i></span>
      <p class="hero-date"><span>Nos vemos el</span><time datetime="${e(event.date)}">${e(new Intl.DateTimeFormat('es-EC',{day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(`${event.date}T12:00:00Z`)))}</time><span>${e(event.date.slice(0,4))}</span></p>
    </section>

    <section class="celebration section" id="celebracion" aria-labelledby="celebration-title" tabindex="-1">
      ${image('leaf', 'celebration-leaf')}
      <div class="section-heading"><h2 id="celebration-title" class="editorial-title">${e(event.text.celebrationTitle)}</h2><p>${e(event.text.dateIntro)}</p></div>
      <div class="celebration-layout">
        <div class="calendar-composition"><div id="calendar">${renderCalendar(event)}</div><span class="calendar-annotation" aria-hidden="true">¡Este día es nuestro!<svg viewBox="0 0 90 40"><path d="M85 30C50 45 10 30 10 5m-5 7 5-8 7 7"/></svg></span></div>
        <div class="event-details">
          <p class="event-date"><time datetime="${e(event.date)}">${e(formatDate(event.date))}</time></p>
          <p class="event-time ${hasTime ? '' : 'pending'}">${hasTime ? `<time datetime="${e(event.time)}">${e(event.time)}</time>` : e(event.text.timePending)}</p>
          <div class="venue"><h3>${e(event.venue || (event.address ? event.text.placeKnown : event.text.placePending))}</h3><p>${e(event.address || event.text.addressPending)}</p>
          ${map ? `<a class="button button-secondary" href="${e(map)}" target="_blank" rel="noopener noreferrer" aria-label="${e(event.text.mapsButton)} (abre Google Maps en otra pestaña)">${e(event.text.mapsButton)}${arrow}</a>` : `<p class="location-note">${event.address ? 'Enlace al mapa próximamente' : 'Ubicación por confirmar'}</p>`}</div>
        </div>
      </div>
    </section>

    <section class="countdown-section section" aria-labelledby="countdown-title">
      ${trail}${image('sprig', 'countdown-sprig')}
      <h2 id="countdown-title">${e(event.text.countdownTitle)}</h2>
      <div id="countdown-content"></div>
      ${flourish}
    </section>

    <section class="protagonists section" aria-labelledby="protagonists-title">
      <div class="section-heading"><h2 id="protagonists-title">${e(event.text.protagonistsTitle)}</h2></div>
      ${event.children.map((child, index) => renderProtagonist(child, index, event)).join('')}
      <div class="story-connector" aria-hidden="true">${trail}${image('sprig', 'connector-sprig')}</div>
    </section>

    ${renderGallery(event)}

    <section class="closing section" id="confirmar" aria-labelledby="closing-title">
      ${image('web-pink', 'closing-web')}${image('egg', 'closing-egg')}
      <div class="closing-content">${flourish}<h2 id="closing-title">${e(event.text.closingTitle)}</h2>
      <p>${e(event.text.closingMessage)}</p>
      ${whatsapp ? `<a class="button button-primary" href="${e(whatsapp)}" target="_blank" rel="noopener noreferrer" aria-label="${e(event.text.confirmButton)} (abre WhatsApp)">${e(event.text.confirmButton)}${arrow}</a><p class="small-note">${e(event.text.whatsappNote)}</p>` : `<span class="button button-pending" role="link" aria-disabled="true">${e(event.text.confirmButton)}</span><p class="small-note">${e(event.text.whatsappPending)}</p>`}
      <p class="closing-signature">${e(names)}</p><p class="closing-date">${e(formatDate(event.date))}</p></div>
    </section>
  </main>`
}

const app = document.querySelector('#app')
app.innerHTML = renderPage()
// La composición de póster cede al flujo de lectura cuando se amplía el texto.
const hero = document.querySelector('.hero')
new ResizeObserver(() => {
  hero.classList.toggle('hero--readable', parseFloat(getComputedStyle(document.documentElement).fontSize) >= 20)
}).observe(document.querySelector('.hero .name-dulce'))
watchCalendar(document.querySelector('#calendar'), event)
mountCountdown(document.querySelector('#countdown-content'), event)
mountGallery(app, event)

document.querySelectorAll('.child-portrait').forEach(img => img.addEventListener('error', () => {
  img.closest('.portrait-composition').classList.remove('has-portrait')
  img.remove()
}))

// El contenido es visible por defecto; solo las decoraciones reciben movimiento.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target) }
  }), { threshold: 0.25 })
  document.querySelectorAll('.portrait-composition, .calendar-composition').forEach(item => observer.observe(item))
}

// SEO y vista previa comparten la configuración del evento.
document.title = event.seo.title
const setMeta = (selector, value) => { const tag = document.querySelector(selector); if (tag) tag.content = value }
setMeta('meta[name="description"]', event.seo.description)
setMeta('meta[property="og:title"]', event.seo.title)
setMeta('meta[property="og:description"]', event.seo.description)
if (event.seo.siteUrl) {
  setMeta('meta[property="og:url"]', event.seo.siteUrl)
  setMeta('meta[property="og:image"]', new URL(assetUrl(event.seo.image), event.seo.siteUrl).href)
}
