import {test,expect} from '@playwright/test'
for(const[width,height]of[[320,800],[360,800],[390,844],[768,1024],[1440,900]]){
 test(`hero editorial definitivo a ${width}px`,async({page})=>{
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/');await page.evaluate(()=>document.fonts.ready)
  await expect(page.getByRole('heading',{name:'Dulce y Diogo',exact:true})).toBeVisible()
  await expect(page.locator('.hero .opening')).toHaveText('Una aventura increíble')
  await expect(page.locator('.hero .age-line')).toHaveText('¡3 añitos de alegría!')
  await expect(page.locator('.hero-date')).toContainText('21 de noviembre')
  await expect(page.locator('.preview-nav')).toHaveCount(0)
  for(const name of ['Ver landing actual','A · Editorial ilustrada','B · Cuento ilustrado'])await expect(page.getByRole('link',{name,exact:true})).toHaveCount(0)
  const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.querySelectorAll('.hero img')].some(i=>!i.complete||!i.naturalWidth),font:getComputedStyle(document.querySelector('.hero h1')).fontFamily,figures:[...document.querySelectorAll('.hero-child')].map(i=>{const r=i.getBoundingClientRect();return {x:r.x,right:r.right,bottom:r.bottom}})}))
  expect(result.overflow).toBe(false);expect(result.broken).toBe(false);expect(result.font).toContain('Lilita One')
  for(const f of result.figures){expect(f.x).toBeGreaterThanOrEqual(-1);expect(f.right).toBeLessThanOrEqual(width+1)}
  await page.screenshot({path:`.impeccable/review/editorial-final-${width}x${height}.png`,animations:'disabled'})
 })
}
for (const zoom of [125,150,200]) test(`hero editorial permite texto al ${zoom}%`,async({page})=>{
 await page.setViewportSize({width:360,height:800});await page.goto('/');await page.evaluate(()=>document.fonts.ready)
 await page.addStyleTag({content:`:root {font-size:${zoom}%}`})
 await expect(page.locator('.hero')).toHaveClass(/hero--readable/)
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})
