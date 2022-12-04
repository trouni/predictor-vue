export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function pluralize(qty, singularWord, pluralWord = singularWord + 's') {
  return `${qty} ${qty === 1 ? singularWord : pluralWord}`
}

export function saveState(key, state) {
  if (state) window.localStorage.setItem(key, JSON.stringify(state))
  else window.localStorage.removeItem(key)
}

export function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

export function clearLocalStorage() {
  window.localStorage.clear()
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString(navigator.language || 'en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date) {
  return new Date(date).toLocaleTimeString(navigator.language || 'en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString(navigator.language || 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDuration(duration) {
  duration = duration / 1000

  // const days = Math.floor(duration / 86400)
  // duration -= days * 86400

  const hours = Math.floor(duration / 3600)
  duration -= hours * 3600

  // calculate (and subtract) whole minutes
  const minutes = Math.floor(duration / 60) % 60
  duration -= minutes * 60

  // what's left is seconds
  const seconds = Math.round(duration % 60)

  const numberFormat = ['en-US', { minimumIntegerDigits: 2, useGrouping: false }]

  return [
    // days > 0 ? `${days}D ` : null,
    hours > 0 ? `${hours.toLocaleString(...numberFormat)}:` : null,
    `${minutes.toLocaleString(...numberFormat)}:${seconds.toLocaleString(...numberFormat)}`,
  ].join('')
}
