export const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]))

export function fill(text, data) {
  return String(text ?? '').replace(/\{(\w+)\}/g, (match, key) => data[key] ?? match)
}

export function assetUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  // Configuración de assets relativos al base path de Vite, también en GitHub Pages.
  return `${import.meta.env?.BASE_URL ?? '/'}${path.replace(/^\/+/, '')}`
}

export function parseDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) return null
  const [year, month, day] = date.split('-').map(Number)
  const check = new Date(Date.UTC(year, month - 1, day))
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null
  return { year, month, day }
}

export function localDate(now, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const get = type => parts.find(part => part.type === type).value
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function calendarData(date, timeZone, now = new Date()) {
  const parsed = parseDate(date)
  if (!parsed) return null
  const { year, month, day } = parsed
  const first = new Date(Date.UTC(year, month - 1, 1))
  const offset = (first.getUTCDay() + 6) % 7
  const total = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const today = localDate(now, timeZone)
  const cells = Array.from({ length: Math.ceil((offset + total) / 7) * 7 }, (_, index) => {
    const value = index - offset + 1
    if (value < 1 || value > total) return null
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(value).padStart(2, '0')}`
    return { day: value, date: iso, event: value === day, today: iso === today }
  })
  return {
    month: new Intl.DateTimeFormat('es-EC', { month: 'long', timeZone: 'UTC' }).format(first),
    year, cells,
  }
}

export function formatDate(date) {
  const parsed = parseDate(date)
  if (!parsed) return 'Fecha por confirmar'
  return new Intl.DateTimeFormat('es-EC', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)))
}

// Convierte una fecha/hora civil en la zona indicada a un instante UTC.
// No depende de la zona horaria del navegador ni de su desplazamiento local.
export function eventInstant(date, time, timeZone) {
  const parsed = parseDate(date)
  if (!parsed || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time ?? '')) return null
  const [hour, minute] = time.split(':').map(Number)
  const target = Date.UTC(parsed.year, parsed.month - 1, parsed.day, hour, minute)
  let guess = target
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  })
  for (let i = 0; i < 3; i++) {
    const parts = formatter.formatToParts(new Date(guess))
    const get = type => Number(parts.find(part => part.type === type).value)
    const represented = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
    const difference = target - represented
    guess += difference
    if (!difference) return guess
  }
  return null
}

export function remaining(target, now = Date.now()) {
  const seconds = Math.max(0, Math.floor((target - now) / 1000))
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
    started: now >= target,
  }
}

export function mapsLink(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return ''
    const allowed = /(^|\.)google\.(?:com|[a-z]{2}|com\.[a-z]{2}|co\.[a-z]{2})$/.test(url.hostname) || url.hostname === 'maps.app.goo.gl' || url.hostname === 'goo.gl'
    return allowed ? url.href : ''
  } catch { return '' }
}

export function whatsappLink(phone, message) {
  if (!/^[+\d\s().-]+$/.test(phone ?? '')) return ''
  const digits = phone.replace(/\D/g, '')
  return /^[1-9]\d{7,14}$/.test(digits)
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : ''
}
