import { test, expect } from '@playwright/test'

const message = '¡Hola! Quiero confirmar que asistiré al cumpleaños de Dulce María y Diogo Alejandro.\n\n¡Qué alegría poder acompañarlos en la celebración de sus 3 añitos!'
const href = `https://wa.me/593991280243?text=${encodeURIComponent(message)}`

for (const [width, height] of [[360, 800], [390, 844], [1440, 900]]) {
  test(`confirmación de WhatsApp preparada a ${width}px`, async ({ page, context }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    // Verificar navegación sin contactar WhatsApp ni enviar mensajes.
    await context.route('https://wa.me/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Destino WhatsApp de prueba</title>' }))
    await page.goto('/')
    const button = page.getByRole('link', { name: 'Confirmar asistencia (abre WhatsApp)', exact: true })
    await expect(button).toHaveAttribute('href', href)
    await expect(button).toHaveAttribute('target', '_blank')
    await expect(button).toHaveClass('button button-primary')
    await expect(page.locator('.closing .button-pending')).toHaveCount(0)
    await expect(page.locator('.closing')).not.toContainText('Muy pronto')
    for (const image of await page.locator('.album img').all()) {
      await image.scrollIntoViewIfNeeded()
      await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
    }
    await page.locator('.closing').evaluate(el => window.scrollTo(0, el.offsetTop))
    await page.screenshot({ path: `.impeccable/review/whatsapp-final-${width}x${height}.png`, animations: 'disabled' })
    const [popup] = await Promise.all([context.waitForEvent('page'), button.click()])
    await popup.waitForLoadState('domcontentloaded')
    const url = new URL(popup.url())
    expect(url.origin).toBe('https://wa.me')
    expect(url.pathname).toBe('/593991280243')
    expect(url.searchParams.get('text')).toBe(message)
    await expect(page.locator('h1')).toHaveAccessibleName('Dulce y Diogo')
    await popup.close()
  })
}

test('sin teléfono no se genera un enlace vacío o inválido', async ({ page }) => {
  await page.route('**/src/config/event.js', async route => {
    const response = await route.fetch()
    await route.fulfill({ response, body: `${await response.text()}\nevent.whatsapp.phone = '';` })
  })
  await page.goto('/')
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0)
  await expect(page.locator('.closing .button-pending')).toHaveAttribute('aria-disabled', 'true')
  await expect(page.locator('.closing')).toContainText('La confirmación por WhatsApp no está disponible.')
})
