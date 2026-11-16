import { calendarData, escapeHtml as e, formatDate } from '../lib/event.js'

export function renderCalendar(event, now = new Date()) {
  const data = calendarData(event.date, event.timeZone, now)
  if (!data) return '<p class="pending">Fecha por confirmar</p>'
  const headers = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  const rows = []
  for (let i = 0; i < data.cells.length; i += 7) {
    rows.push(`<tr>${data.cells.slice(i, i + 7).map(cell => {
      if (!cell) return '<td class="calendar-empty"></td>'
      const label = `${formatDate(cell.date)}${cell.event ? ', nuestra celebración' : ''}${cell.today ? ', hoy' : ''}`
      return `<td class="${cell.event ? 'is-event' : ''} ${cell.today ? 'is-today' : ''}"><time datetime="${cell.date}" ${cell.today ? 'aria-current="date"' : ''} aria-label="${e(label)}"><span>${cell.day}</span></time></td>`
    }).join('')}</tr>`)
  }
  return `<div class="calendar-sheet">
    <table class="calendar">
      <caption><span>${e(data.month)}</span> <span class="calendar-year">${data.year}</span></caption>
      <thead><tr>${headers.map(day => `<th scope="col"><abbr title="${day}">${day.slice(0, 1)}</abbr></th>`).join('')}</tr></thead>
      <tbody>${rows.join('')}</tbody>
    </table>
    <p class="calendar-legend"><span class="event-dot" aria-hidden="true"></span> Nuestro gran día <span class="today-legend"><span class="today-dot" aria-hidden="true"></span> Hoy</span></p>
  </div>`
}

export function watchCalendar(container, event) {
  let lastDay = ''
  const refresh = () => {
    const key = new Intl.DateTimeFormat('en-CA', { timeZone: event.timeZone, dateStyle: 'short' }).format(new Date())
    if (key !== lastDay) {
      container.innerHTML = renderCalendar(event)
      lastDay = key
    }
  }
  refresh()
  const interval = setInterval(refresh, 30_000)
  return () => clearInterval(interval)
}
