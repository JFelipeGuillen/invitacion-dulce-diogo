import { assetUrl, escapeHtml as e } from '../lib/event.js'

export function renderProtagonist(child, index, event) {
  const name = child.name || event.names[index]
  const dino = child.theme === 'dino'
  const decoration = dino ? 'sprig' : 'web-pink'
  return `<article class="protagonist protagonist-${dino ? 'diogo' : 'dulce'}" aria-labelledby="child-${index}">
    <h3 id="child-${index}">${e(name)}</h3>
    <div class="portrait-composition ${child.image ? 'has-portrait' : ''}">
      ${child.image && child.illustrationNote ? '<div class="portrait-artwork">' : ''}
      ${child.image ? `<img class="child-portrait" src="${e(assetUrl(child.image))}" alt="${e(child.imageAlt || `Ilustración de ${name}`)}" loading="lazy" decoding="async" width="800" height="${dino ? 612 : 853}">` : ''}
      ${child.image && child.illustrationNote ? `<p class="discovery-question">${e(child.illustrationNote)}</p>` : ''}
      ${child.image && child.illustrationNote ? '</div>' : ''}
      <span class="portrait-reserve"><span>${e(event.text.portraitPending)}</span></span>
    </div>
    <div class="protagonist-copy">
      ${(child.description || '').split(/\n\s*\n/).filter(paragraph => paragraph.trim()).map(paragraph => `<p class="child-description">${e(paragraph.trim())}</p>`).join('')}
    </div>
    <img class="decoration portrait-detail" src="${assetUrl(`images/${decoration}.webp`)}" width="100" height="100" alt="" aria-hidden="true">
  </article>`
}
