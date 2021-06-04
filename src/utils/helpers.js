export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function saveState(key, state) {
  if (state) window.localStorage.setItem(key, JSON.stringify(state))
  else window.localStorage.removeItem(key)
}

export function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

export function formatDateTime(date) {
  return new Date(date).toLocaleTimeString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getPublicId(url) {
  return url.replace(/.+\/upload\/.+\//, '').replace(/\..+/, '')
}
