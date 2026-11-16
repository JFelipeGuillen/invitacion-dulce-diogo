import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calendarData, eventInstant, remaining, localDate, mapsLink, whatsappLink, parseDate, formatDate } from '../src/lib/event.js'
const zone = 'America/Guayaquil'

test('noviembre 2026 empieza en domingo y el 21 cae en sábado', () => {
  const calendar = calendarData('2026-11-21', zone, new Date('2026-11-15T18:00:00Z'))
  assert.equal(calendar.month, 'noviembre')
  assert.equal(calendar.cells.length, 42)
  assert.equal(calendar.cells[6].day, 1)
  const index = calendar.cells.findIndex(cell => cell?.event)
  assert.equal(index % 7, 5)
  assert.equal(calendar.cells[index].day, 21)
  assert.equal(calendar.cells.find(cell => cell?.today).day, 15)
})
test('hoy usa Guayaquil en el límite de medianoche y puede coincidir con el evento', () => {
  assert.equal(localDate(new Date('2026-11-22T04:59:59Z'), zone), '2026-11-21')
  const data = calendarData('2026-11-21', zone, new Date('2026-11-22T04:59:59Z'))
  assert.deepEqual(data.cells.find(cell => cell?.event), { day: 21, date: '2026-11-21', event: true, today: true })
  assert.equal(calendarData('2026-11-21', zone, new Date('2026-12-01T05:00:00Z')).cells.some(cell => cell?.today), false)
})
test('cambiar fecha actualiza mes, año y día; febrero bisiesto', () => {
  const data = calendarData('2028-02-29', zone)
  assert.equal(data.month, 'febrero')
  assert.equal(data.year, 2028)
  assert.equal(data.cells.filter(Boolean).length, 29)
  assert.equal(data.cells.find(cell => cell?.event).day, 29)
  assert.equal(parseDate('2026-02-29'), null)
  assert.match(formatDate('2026-11-21'), /sábado/)
})
test('hora civil de Ecuador se convierte a UTC sin depender del navegador', () => {
  const target = eventInstant('2026-11-21', '15:30', zone)
  assert.equal(new Date(target).toISOString(), '2026-11-21T20:30:00.000Z')
  assert.equal(new Date(eventInstant('2026-11-21', '00:00', zone)).toISOString(), '2026-11-21T05:00:00.000Z')
  assert.equal(eventInstant('2026-11-21', '', zone), null)
  assert.equal(eventInstant('2026-11-21', '25:00', zone), null)
})
test('contador antes, al inicio y después: nunca negativo', () => {
  assert.deepEqual(remaining(90061000, 0), { days: 1, hours: 1, minutes: 1, seconds: 1, started: false })
  assert.deepEqual(remaining(1000, 1000), { days: 0, hours: 0, minutes: 0, seconds: 0, started: true })
  assert.deepEqual(remaining(1000, 2000), { days: 0, hours: 0, minutes: 0, seconds: 0, started: true })
})
test('enlaces válidos y ausencia de destinos inválidos', () => {
  assert.equal(mapsLink(''), '')
  assert.equal(mapsLink('javascript:alert(1)'), '')
  assert.equal(mapsLink('https://google.com.evil.example/maps'), '')
  assert.equal(mapsLink('https://maps.app.goo.gl/example'), 'https://maps.app.goo.gl/example')
  assert.equal(mapsLink('https://www.google.com/maps?q=Quito'), 'https://www.google.com/maps?q=Quito')
  assert.equal(whatsappLink('', 'Hola'), '')
  assert.equal(whatsappLink('abc593123456789', 'Hola'), '')
  assert.equal(whatsappLink('+593 99 123 4567', '¡Hola!'), 'https://wa.me/593991234567?text=%C2%A1Hola!')
})
