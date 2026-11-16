import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { fileURLToPath } from 'node:url'

async function configure(page, patch) {
  // Fixture de prueba local: no debe formar parte de public/ ni del despliegue.
  await page.route('**/images/scene.webp', route => route.fulfill({
    path: fileURLToPath(new URL('../fixtures/scene.webp', import.meta.url)),
    contentType: 'image/webp',
  }))
  await page.route('**/src/config/event.js', async route => {
    const response = await route.fetch()
    await route.fulfill({ response, body: `${await response.text()}\nObject.assign(event, ${JSON.stringify(patch)});` })
  })
}

for (const width of [320, 390, 430, 768, 1440]) {
  test(`estado inicial, accesibilidad y composición a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width > 700 ? 1000 : 844 })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const failures = []
    page.on('response', response => { if (response.status() >= 400) failures.push(response.url()) })
    await page.clock.setFixedTime(new Date('2026-11-15T18:00:00Z'))
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('h1')).toHaveAccessibleName('Dulce y Diogo')
    await expect(page.locator('.is-event')).toHaveText('21')
    await expect(page.locator('.calendar tbody tr').first().locator('td').nth(6)).toHaveText('1')
    await expect(page.getByRole('timer')).toHaveCount(1)
    await expect(page.locator('.count-unit')).toHaveCount(4)
    await expect(page.locator('.event-time')).toContainText('15:30')
    await expect(page.locator('.venue')).toContainText('manzana 10, villa 20')
    await expect(page.locator('.protagonists')).not.toContainText('añitos')
    await expect(page.locator('.portrait-reserve')).toHaveCount(2)
    await expect(page.locator('.draft-note')).toHaveCount(0)
    await expect(page.locator('.album-reserve')).toHaveCount(0)
    await expect(page.locator('.album button')).toHaveCount(4)
    await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0)
    await expect(page.locator('.venue h3')).toHaveText('Villa Club')
    await expect(page.getByRole('link', {name: /Cómo llegar/})).toHaveAttribute('href', 'https://maps.google.com/maps?q=-2.03680157661438%2C-79.90084075927734&z=17&hl=es')
    await expect(page.locator('.hero-child')).toHaveCount(2)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    // Cargar las fotos diferidas antes de evaluarlas; el diálogo aún no tiene src.
    for (const image of await page.locator('img[loading="lazy"][src]').all()) {
      await image.scrollIntoViewIfNeeded()
      await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    const broken = await page.locator('img[src]').evaluateAll(images => images.filter(img => !img.complete || !img.naturalWidth).map(img => img.src))
    expect(broken).toEqual([])
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(accessibility.violations.map(issue => ({ id: issue.id, nodes: issue.nodes.map(node => ({target: node.target, summary: node.failureSummary})) }))).toEqual([])
    expect(errors).toEqual([])
    expect(failures).toEqual([])
    await page.screenshot({ path: `.impeccable/review/${width === 1440 ? 'desktop' : width === 390 ? 'mobile' : `mobile-${width}`}.png`, fullPage: true })
  })
}

test('configuración activa: contador, datos, enlaces y galería accesible', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-20T20:29:00Z') })
  await page.clock.pauseAt(new Date('2026-11-20T20:30:00Z'))
  await configure(page, {
    time: '15:30', venue: 'Lugar de prueba', address: 'Dirección de prueba', mapsUrl: 'https://www.google.com/maps?q=Quito',
    whatsapp: {phone: '+593 99 123 4567', message: '¡Hola! Voy al cumpleaños de {names}.'},
    gallery: [1,2,3,4,5].map(i => ({src: 'images/scene.webp', alt: `Ilustración de prueba ${i}`, caption: `Recuerdo ${i}`})),
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('timer')).toBeVisible()
  await expect(page.locator('[data-unit="days"]')).toHaveText('01')
  await page.clock.runFor(1000)
  await expect(page.locator('[data-unit="seconds"]')).toHaveText('59')
  await page.clock.resume()
  await expect(page.locator('.venue h3')).toHaveText('Lugar de prueba')
  await expect(page.locator('a[href*="google.com/maps"]')).toHaveAttribute('target', '_blank')
  await expect(page.locator('a[href*="wa.me"]')).toHaveAttribute('href', 'https://wa.me/593991234567?text=%C2%A1Hola!%20Voy%20al%20cumplea%C3%B1os%20de%20Dulce%20y%20Diogo.')
  await expect(page.locator('.album-photo')).toHaveCount(5)
  const photo = page.getByRole('button', { name: 'Ampliar fotografía: Ilustración de prueba 1' })
  await photo.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('button', {name:'Cerrar fotografía'})).toBeFocused()
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([])
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(photo).toBeFocused()
  await photo.click()
  await page.getByRole('button', { name: 'Cerrar fotografía' }).click()
  await expect(photo).toBeFocused()
  await page.screenshot({ path: '.impeccable/review/configured-mobile.png', fullPage: true })
})

test('cambio de fecha y coincidencia entre hoy y evento', async ({ page }) => {
  await page.clock.install({time: new Date('2028-02-29T18:00:00Z')})
  await configure(page, {date: '2028-02-29', time: '12:00'})
  await page.goto('/')
  await expect(page.locator('.calendar caption')).toContainText('febrero')
  await expect(page.locator('.calendar caption')).toContainText('2028')
  await expect(page.locator('.is-event.is-today')).toHaveText('29')
  await expect(page.locator('[aria-current="date"]')).toHaveAttribute('aria-label', /nuestra celebración, hoy/)
  await expect(page.locator('#countdown-content')).toContainText('¡La aventura ha comenzado!')
  await expect(page.getByRole('timer')).toHaveCount(0)
})

test('contador desactivado, imágenes fallidas y movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await configure(page, {time:'15:30', countdown:{enabled:false, showSeconds:false}, gallery:[{src:'images/no-existe.webp',alt:'Prueba de error'}]})
  await page.goto('/')
  await expect(page.getByRole('timer')).toHaveCount(0)
  await page.locator('#recuerdos').evaluate(el => window.scrollTo(0, el.offsetTop))
  await expect(page.locator('#recuerdos')).toBeHidden()
  expect(await page.locator('.calendar-composition').evaluate(el => getComputedStyle(el).animationName)).toBe('none')
  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
})


test('sin hora ni álbum de reserva, los estados opcionales siguen funcionando', async ({ page }) => {
  await configure(page, { time: '', galleryPreview: {enabled: false}, gallery: [] })
  await page.goto('/')
  await expect(page.getByRole('timer')).toHaveCount(0)
  await expect(page.locator('#countdown-content')).toContainText('Muy pronto, también tendrá una hora.')
  await expect(page.locator('#recuerdos')).toHaveCount(0)
})

test('presentaciones finales reemplazan reservas y textos provisionales', async ({ page }) => {
  await configure(page, { children: [
    {name:'Dulce',theme:'gwen',description:'Presentación aprobada de prueba.',likes:['Gusto de prueba'],image:'images/scene.webp',imageAlt:'Ilustración de prueba'},
    {name:'Diogo',theme:'dino',description:'Otra presentación aprobada de prueba.',likes:['Otro gusto de prueba'],image:'',imageAlt:''},
  ]})
  await page.goto('/')
  await expect(page.locator('.draft-note')).toHaveCount(0)
  await expect(page.locator('.protagonist-dulce .portrait-reserve')).toBeHidden()
  await expect(page.locator('.child-portrait')).toBeVisible()
  await expect(page.locator('.child-likes')).toHaveCount(0)
})


test('ubicación real abre Google Maps en una pestaña nueva', async ({ page, context }) => {
  await context.route('https://maps.google.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Destino de prueba</title>' }))
  await page.goto('/')
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', {name: /Cómo llegar/}).click(),
  ])
  await popup.waitForLoadState()
  const url = new URL(popup.url())
  expect(url.hostname).toBe('maps.google.com')
  expect(url.searchParams.get('q')).toBe('-2.03680157661438,-79.90084075927734')
  expect(url.searchParams.get('z')).toBe('17')
  await popup.close()
})
