import {test,expect} from '@playwright/test'

for(const [width,height] of [[360,800],[390,844],[768,1024],[1440,900]]) {
 test(`presentaciones ilustradas completas a ${width}px`, async ({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message))
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/');await page.evaluate(()=>document.fonts.ready)
  const section=page.locator('.protagonists')
  for(const image of await section.locator('.child-portrait').all()) {
   await image.scrollIntoViewIfNeeded()
   await expect(image).toBeVisible()
   await expect.poll(()=>image.evaluate(i=>i.complete && i.naturalWidth>0)).toBe(true)
  }
  await expect(section.locator('.child-portrait')).toHaveCount(2)
  await expect(section.locator('.protagonist h3')).toHaveText(['Dulce María','Diogo Alejandro'])
  await expect(section).not.toContainText('añitos')
  await expect(section.locator('.draft-note, .child-likes')).toHaveCount(0)
  await expect(section.locator('.protagonist-dulce .child-description')).toHaveCount(2)
  await expect(section.locator('.protagonist-diogo .child-description')).toHaveCount(2)
  await expect(page.locator('.hero h1')).toHaveAccessibleName('Dulce y Diogo')
  expect(await section.locator('.child-portrait').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')))).toEqual(['/'+ 'images/illustrations/dulce-aventurera.webp','/'+ 'images/illustrations/diogo-aventurero.webp'])
  const bounds=await section.locator('.child-portrait').evaluateAll(imgs=>imgs.map(i=>{const r=i.getBoundingClientRect();return {left:r.left,right:r.right,ratio:r.width/r.height,natural:i.naturalWidth/i.naturalHeight,transform:getComputedStyle(i).transform}}))
  for(const b of bounds){expect(b.left).toBeGreaterThanOrEqual(0);expect(b.right).toBeLessThanOrEqual(width);expect(b.ratio).toBeCloseTo(b.natural,2);expect(b.transform).toBe('none')}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await section.evaluate(el=>window.scrollTo(0,el.offsetTop-20))
  await page.screenshot({path:`.impeccable/review/protagonists-final-copy-${width}x${height}.png`,animations:'disabled'})
  await section.screenshot({path:`.impeccable/review/protagonists-final-copy-full-${width}.png`,animations:'disabled'})
  if(width<1000){await section.locator('.protagonist-diogo').evaluate(el=>window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top-20));await page.screenshot({path:`.impeccable/review/protagonists-final-copy-diogo-${width}x${height}.png`,animations:'disabled'})}
  expect(errors).toEqual([])
 })
}

test('la presentación recupera un estado honesto cuando falla su ilustración',async({page})=>{
 await page.route('**/dulce-aventurera.webp',route=>route.abort())
 await page.goto('/')
 await page.locator('.protagonist-dulce').scrollIntoViewIfNeeded()
 await expect(page.locator('.protagonist-dulce .child-portrait')).toHaveCount(0)
 await expect(page.locator('.protagonist-dulce .portrait-reserve')).toBeVisible()
})
