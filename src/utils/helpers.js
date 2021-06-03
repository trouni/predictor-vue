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
