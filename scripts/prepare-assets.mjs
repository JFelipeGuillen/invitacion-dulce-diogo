// Recortes de la invitación aprobada. El original nunca se modifica.
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
const source = 'references/invitacion-aprobada.png'
await mkdir('public/images', { recursive: true })
await mkdir('tests/fixtures', { recursive: true })
await mkdir('.local-archive/public/images', { recursive: true })
const crops = {
  scene: [0, 0, 1055, 640],
  leaf: [838, 0, 217, 196],
  sprig: [0, 1280, 184, 211],
  egg: [801, 1274, 254, 217],
  'web-pink': [0, 915, 137, 209],
  'web-blue': [913, 922, 142, 204],
  paper: [16, 660, 66, 212],
}
for (const [name, [left, top, width, height]] of Object.entries(crops)) {
  const crop = sharp(source).extract({ left, top, width, height })
  const output = name === 'scene' ? 'tests/fixtures/scene.webp' : `public/images/${name}.webp`
  if (name === 'paper') {
    await crop.webp({ quality: 88 }).toFile(output)
    continue
  }
  // Retira el papel crema de la imagen aplanada (matte), conservando
  // transparencias de la pintura. No dibuja ni genera contenido nuevo.
  const { data } = await crop.raw().toBuffer({ resolveWithObject: true })
  const rgba = Buffer.alloc(width * height * 4)
  const ground = [254, 246, 237]
  for (let pixel = 0; pixel < width * height; pixel++) {
    const rgb = Array.from(data.subarray(pixel * 3, pixel * 3 + 3))
    const alpha = Math.max(0, 1 - Math.min(...rgb.map((channel, index) => channel / ground[index])))
    const cleanAlpha = alpha < .045 ? 0 : Math.min(1, (alpha - .025) / .975)
    for (let channel = 0; channel < 3; channel++) {
      rgba[pixel * 4 + channel] = alpha ? Math.max(0, Math.min(255, (rgb[channel] - (1 - alpha) * ground[channel]) / alpha)) : 0
    }
    rgba[pixel * 4 + 3] = Math.round(cleanAlpha * 255)
  }
  await sharp(rgba, { raw: { width, height, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toFile(output)
}
await sharp(source).extract({left: 0, top: 0, width: 1055, height: 640})
  .resize(1200, 630, { fit: 'contain', background: '#FFF8ED' })
  .jpeg({quality: 88}).toFile('public/images/social.jpg')
await writeFile('.local-archive/public/images/credits.json', JSON.stringify({
  origin: source,
  method: 'Recortes, eliminación del matte crema y optimización de la invitación aprobada, sin generación de ilustraciones.',
  crops,
  social: 'Recorte superior adaptado a 1200 × 630 para Open Graph.',
}, null, 2) + '\n')
