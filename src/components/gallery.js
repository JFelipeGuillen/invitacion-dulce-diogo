import { assetUrl, escapeHtml as e } from '../lib/event.js'

export function renderGallery(event) {
  const photos = event.gallery.filter(photo => photo.src && photo.alt)
  if (!photos.length) {
    if (!event.galleryPreview?.enabled) return ''
    const count = Math.max(3, Math.min(4, event.galleryPreview.slots || 4))
    return `<section class="gallery-section gallery-preview section" id="recuerdos" aria-labelledby="gallery-title">
      <div class="section-heading"><h2 id="gallery-title">${e(event.text.galleryTitle)}</h2></div>
      <div class="album">${Array.from({length: count}, (_, index) => `<figure class="album-photo album-reserve photo-${index}"><div class="photo-reserve" aria-hidden="true"><img src="${assetUrl(`images/${['web-pink', 'sprig', 'egg', 'web-blue'][index]}.webp`)}" alt=""><span class="reserve-number">${String(index + 1).padStart(2, '0')}</span><span class="reserve-line"></span></div></figure>`).join('')}</div>
    </section>`
  }
  return `<section class="gallery-section section" id="recuerdos" aria-labelledby="gallery-title">
    <div class="section-heading"><h2 id="gallery-title">${e(event.text.galleryTitle)}</h2></div>
    <div class="album">${photos.map((photo, index) => `<figure class="album-photo photo-${index % 5}"><button class="photo-open" type="button" data-photo="${index}" aria-label="Ampliar fotografía: ${e(photo.alt)}"><img src="${e(assetUrl(photo.src))}" alt="${e(photo.alt)}" loading="lazy" width="600" height="600"></button>${photo.caption?.trim() ? `<figcaption>${e(photo.caption)}</figcaption>` : ''}</figure>`).join('')}</div>
    <dialog class="photo-dialog" aria-label="Fotografía ampliada"><button type="button" class="dialog-close" aria-label="Cerrar fotografía"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button><figure><img alt=""><figcaption></figcaption></figure></dialog>
  </section>`
}

export function mountGallery(root, event) {
  const section = root.querySelector('#recuerdos')
  if (!section || section.classList.contains('gallery-preview')) return
  const photos = event.gallery.filter(photo => photo.src && photo.alt)
  const dialog = section.querySelector('dialog')
  let opener
  section.querySelectorAll('.photo-open').forEach(button => {
    button.addEventListener('click', () => {
      const photo = photos[Number(button.dataset.photo)]
      const image = dialog.querySelector('img')
      image.src = assetUrl(photo.src)
      image.alt = photo.alt
      dialog.querySelector('figcaption').textContent = photo.caption || ''
      opener = button
      dialog.showModal()
      document.body.classList.add('dialog-open')
    })
    button.querySelector('img').addEventListener('error', () => {
      button.closest('figure').remove()
      if (!section.querySelector('.album-photo')) section.hidden = true
    })
  })
  const close = () => dialog.close()
  dialog.querySelector('.dialog-close').addEventListener('click', close)
  dialog.addEventListener('click', event => { if (event.target === dialog) close() })
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open')
    opener?.focus()
  })
}
