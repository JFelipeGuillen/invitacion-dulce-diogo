import { test, expect } from '@playwright/test'
const captions = ["Un pequeño mundo de ocurrencias.", "Pequeña exploradora de grandes misterios.", "Compañeros de juegos y travesuras.", "Nuestros primeros recuerdos de aventura."]
for(const [width,height] of [[360,800],[390,844],[1440,900]]) {
 test(`álbum definitivo y hora a ${width}px`,async({page})=>{
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/');await page.evaluate(()=>document.fonts.ready)
  const section=page.locator('#recuerdos'), photos=section.locator('.photo-open img')
  await expect(photos).toHaveCount(4)
  await expect(section.locator('.section-heading > p, .album-reserve')).toHaveCount(0)
  await expect(section.locator('.album figcaption')).toHaveText(captions)
  expect(await photos.evaluateAll(images=>images.map(i=>i.getAttribute('src')))).toEqual(['/images/gallery/01-diogo.jpg','/images/gallery/02-dulce.jpg','/images/gallery/03-dulce-diogo-zoo.jpg','/images/gallery/04-dulce-diogo-cake-smash.jpg'])
  for(const img of await photos.all()) {
   await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true)
   expect(await img.evaluate(i=>getComputedStyle(i).aspectRatio)).toBe('1 / 1')
   expect(await img.evaluate(i=>i.naturalWidth / i.naturalHeight)).toBe(1)
   expect(await img.evaluate(i=>getComputedStyle(i).filter)).toBe('none')
  }
  await section.evaluate(el=>window.scrollTo(0,el.offsetTop-24))
  await page.screenshot({path:`.impeccable/review/gallery-new-final-${width}x${height}.png`,animations:'disabled'})
  await section.screenshot({path:`.impeccable/review/gallery-new-final-full-${width}.png`,animations:'disabled'})
  for(let i=0;i<4;i++){
   const button=section.locator('.photo-open').nth(i);await button.click();await expect(page.locator('dialog')).toBeVisible()
   await expect(page.locator('dialog figcaption')).toHaveText(captions[i]);await expect(page.locator('dialog img')).toHaveAttribute('src',await photos.nth(i).getAttribute('src'))
   await page.keyboard.press('Escape');await expect(button).toBeFocused()
  }
  await expect(page.locator('.event-time')).toHaveText('15:30')
  await page.locator('.event-details').evaluate(el=>window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top-24))
  await page.screenshot({path:`.impeccable/review/time-final-${width}x${height}.png`,animations:'disabled'})
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 })
}
