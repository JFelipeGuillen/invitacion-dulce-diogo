import { eventInstant, remaining, escapeHtml as e } from '../lib/event.js'

export function mountCountdown(container, event) {
  const target = event.countdown.enabled ? eventInstant(event.date, event.time, event.timeZone) : null
  if (target === null) {
    container.innerHTML = `<div class="expectation"><span class="expectation-date">${new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${event.date}T12:00:00Z`))}</span><p>${e(event.text.countdownPending)}</p><p class="small-note">${e(event.text.countdownNote)}</p></div>`
    return () => {}
  }
  const units = [['days', 'Días'], ['hours', 'Horas'], ['minutes', 'Minutos'], ...(event.countdown.showSeconds ? [['seconds', 'Segundos']] : [])]
  container.innerHTML = `<div class="countdown" role="timer" aria-label="Tiempo hasta la celebración" aria-live="off">${units.map(([key, label]) => `<div class="count-unit"><span class="count-value" data-unit="${key}">00</span><span class="count-label">${label}</span></div>`).join('')}</div>`
  let interval
  const update = () => {
    const values = remaining(target)
    if (values.started) {
      container.innerHTML = `<div class="expectation started" role="status"><p class="handwritten">${e(event.text.countdownStarted)}</p><p>${e(event.text.countdownStartedNote)}</p></div>`
      clearInterval(interval)
      return
    }
    units.forEach(([key]) => {
      const element = container.querySelector(`[data-unit="${key}"]`)
      const value = String(values[key]).padStart(2, '0')
      if (element.textContent !== value) element.textContent = value
    })
  }
  update()
  if (Date.now() < target) interval = setInterval(update, 1000)
  return () => clearInterval(interval)
}
