import '@fontsource/lilita-one/latin-400.css'
import '@fontsource/caveat/latin-700.css'
import '@fontsource/patrick-hand/latin-400.css'
import '@fontsource/nunito-sans/latin-400.css'
import './hero.css'
import { event } from '../config/event.js'
import { assetUrl, escapeHtml as e, fill } from '../lib/event.js'
const a = document.body.dataset.variant === 'a'
const decor = (name, cls) => `<img class="ornament ${cls}" src="${assetUrl(`images/${name}.webp`)}" alt="" aria-hidden="true">`
const path = `<svg class="journey" viewBox="0 0 1000 740" preserveAspectRatio="none" aria-hidden="true"><path d="M510 170C720 190 470 340 370 305S80 420 265 510 970 390 860 610"/><g><ellipse cx="640" cy="462" rx="5" ry="10" transform="rotate(35 640 462)"/><circle cx="640" cy="447" r="3"/><circle cx="647" cy="451" r="3"/><circle cx="652" cy="457" r="3"/></g></svg>`
document.querySelector('#preview').innerHTML = `<main class="proposal ${a ? 'editorial' : 'storybook'}" aria-label="${a ? 'A. Editorial ilustrada' : 'B. Cuento ilustrado'}">
  <p class="opening">Una aventura increíble</p>
  <h1 class="lettering" aria-label="${e(event.names.join(' y '))}"><span class="name-dulce">${e(event.names[0])}</span><span class="and">y</span><span class="name-diogo">${e(event.names[1])}</span></h1>
  <img class="character dulce" src="${assetUrl('images/illustrations/hero-dulce.webp')}" alt="Dulce saluda en su disfraz arácnido rosa y turquesa, en acuarela." width="600" height="800">
  <img class="character diogo" src="${assetUrl('images/illustrations/hero-diogo.webp')}" alt="Diogo saluda con su disfraz de dinosaurio verde, en acuarela." width="600" height="800">
  <p class="age">${e(fill(event.text.ageLine, {age:event.age}))}</p>
  ${decor('leaf','leaf')}${decor('web-pink','web')}${decor('sprig','sprig')}
  ${a ? '<span class="paint-mark" aria-hidden="true"></span><span class="rays" aria-hidden="true"><i></i><i></i><i></i></span>' : path+decor('web-blue','blue-web')}
  <p class="date"><span>Nos vemos el</span><time datetime="${e(event.date)}">21 de noviembre</time><span>2026</span></p>
</main><nav class="preview-nav" aria-label="Comparar propuestas"><a href="${assetUrl('hero-a.html')}" ${a?'aria-current="page"':''}>A · Editorial ilustrada</a><a href="${assetUrl('hero-b.html')}" ${!a?'aria-current="page"':''}>B · Cuento ilustrado</a><a href="${import.meta.env.BASE_URL}">Ver landing actual</a></nav>`
