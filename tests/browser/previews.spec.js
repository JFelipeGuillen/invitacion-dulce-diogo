import {test,expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
for(const variant of ['a','b'])for(const[width,height]of[[390,844],[1440,900]]){
 test(`propuesta ${variant} a ${width}x${height}`,async({page})=>{
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'})
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url())})
  await page.goto(`/hero-${variant}.html`);await page.evaluate(()=>document.fonts.ready)
  await expect(page).toHaveTitle(variant==='a'?'Propuesta A · Editorial ilustrada':'Propuesta B · Cuento ilustrado')
  await expect(page.getByRole('heading',{name:'Dulce y Diogo'})).toBeVisible()
  await expect(page.locator('.character')).toHaveCount(2)
  await expect(page.getByRole('link',{name:'Ver landing actual'})).toHaveAttribute('href','/')
  const state=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth>innerWidth,
   broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
   font:getComputedStyle(document.querySelector('h1')).fontFamily,
   figures:[...document.querySelectorAll('.character')].map(i=>{const r=i.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}}),
  }))
  expect(state.overflow).toBe(false);expect(state.broken).toEqual([])
  expect(state.font).toContain(variant==='a'?'Lilita One':'Caveat')
  for(const f of state.figures){expect(f.left).toBeGreaterThanOrEqual(-1);expect(f.right).toBeLessThanOrEqual(width+1);expect(f.bottom).toBeLessThanOrEqual(770)}
  const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()
  expect(a11y.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
  expect(errors).toEqual([])
  await page.screenshot({path:`.impeccable/review/proposal-${variant}-${width}x${height}.png`,animations:'disabled'})
 })
}
