import { defineConfig } from 'vite'
import { event } from './src/config/event.js'

const htmlEscape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [{
    name: 'invitation-sharing-metadata',
    transformIndexHtml(html, context) {
      if (/hero-[ab]\.html/.test(context.filename || context.path || '')) return html
      // Los robots de WhatsApp leen el HTML estático, sin ejecutar JavaScript.
      const siteUrl = event.seo.siteUrl || process.env.URL || process.env.DEPLOY_PRIME_URL || ''
      const base = process.env.VITE_BASE_PATH || '/'
      const image = /^https?:/.test(event.seo.image) ? event.seo.image : `${base}${event.seo.image.replace(/^\/+/, '')}`
      const socialImage = siteUrl ? new URL(image, siteUrl).href : image
      let result = html.replace(/<title>.*?<\/title>/, `<title>${htmlEscape(event.seo.title)}</title>`)
      const values = { description: event.seo.description, 'og:title': event.seo.title, 'og:description': event.seo.description, 'og:image': socialImage, 'og:url': siteUrl }
      for (const [key, value] of Object.entries(values)) {
        const regex = new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*("\\s*\\/?>)`)
        result = result.replace(regex, (_, before, after) => `${before}${htmlEscape(value)}${after}`)
      }
      return result
    },
  }],
})
