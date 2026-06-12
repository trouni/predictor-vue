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

export function homeTeamWon(match) {
  return (
    match.teamAway.score < match.teamHome.score ||
    match.teamAway.etScore < match.teamHome.etScore ||
    match.teamAway.psScore < match.teamHome.psScore
  )
}

export function awayTeamWon(match) {
  return (
    match.teamAway.score > match.teamHome.score ||
    match.teamAway.etScore > match.teamHome.etScore ||
    match.teamAway.psScore > match.teamHome.psScore
  )
}

export function formatDateTime(date) {
  return new Date(date).toLocaleTimeString(navigator.language || 'en-GB', {
    weekday: 'long',
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

export function isPlaceholderMatch(match) {
  return !match.teamHome || !match.teamAway
}

export function ordinalize(num) {
  const n = Number(num)
  if (!Number.isFinite(n) || n === 0) return '—'
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}<sup>th</sup>`
  switch (n % 10) {
    case 1:
      return `${n}<sup>st</sup>`
    case 2:
      return `${n}<sup>nd</sup>`
    case 3:
      return `${n}<sup>rd</sup>`
    default:
      return `${n}<sup>th</sup>`
  }
}

export function roundLabel(n) {
  if (n >= 6) return 'Final'
  if (n === 5) return 'Semi-Final'
  if (n === 4) return 'Quarter-Final'
  if (n === 3) return 'Round of 16'
  if (n === 2) return 'Round of 32'
  return `Round ${n}`
}

export function buildGroupFilters(matches) {
  const seen = new Map()
  matches.forEach(m => {
    if (m.groupId && !seen.has(`g:${m.groupId}`))
      seen.set(`g:${m.groupId}`, { key: `g:${m.groupId}`, label: m.groupName })
    else if (!m.groupId && m.roundNumber && !seen.has(`r:${m.roundNumber}`))
      seen.set(`r:${m.roundNumber}`, {
        key: `r:${m.roundNumber}`,
        label: roundLabel(m.roundNumber),
      })
  })
  if (seen.size <= 1) return []
  const groups = [...seen.values()]
    .filter(f => f.key.startsWith('g:'))
    .sort((a, b) => a.label.localeCompare(b.label))
  const rounds = [...seen.values()]
    .filter(f => f.key.startsWith('r:'))
    .sort((a, b) => Number(a.key.slice(2)) - Number(b.key.slice(2)))
  return [{ key: null, label: 'All' }, ...groups, ...rounds]
}

export function applyGroupFilter(matches, selectedGroup) {
  if (!selectedGroup) return matches
  if (selectedGroup.startsWith('g:')) {
    const id = selectedGroup.slice(2)
    return matches.filter(m => String(m.groupId) === id)
  }
  if (selectedGroup.startsWith('r:')) {
    const num = Number(selectedGroup.slice(2))
    return matches.filter(m => !m.groupId && m.roundNumber === num)
  }
  return matches
}

export function formatDuration(duration) {
  const totalSeconds = Math.floor(duration / 1000)

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`)

  return parts.join(' ')
}
