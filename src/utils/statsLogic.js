import { homeTeamWon, awayTeamWon, isPlaceholderMatch } from '@/utils/helpers'

const CHOICES = ['home', 'away', 'draw']

const MIN_PREDICTIONS = 5

export const matchOutcome = match => {
  if (!match || match.status !== 'finished') return null
  if (isPlaceholderMatch(match)) return null
  if (homeTeamWon(match)) return 'home'
  if (awayTeamWon(match)) return 'away'
  return 'draw'
}

const strictExtreme = (counts, mode) => {
  const entries = CHOICES.map(choice => [choice, counts[choice]])
  let best = entries[0]
  let tie = false
  for (let index = 1; index < entries.length; index++) {
    const count = entries[index][1]
    const better = mode === 'max' ? count > best[1] : count < best[1]
    if (better) {
      best = entries[index]
      tie = false
    } else if (count === best[1]) {
      tie = true
    }
  }
  return tie ? null : best[0]
}

export const buildStatsData = (leaderboard, matches) => {
  const users = (leaderboard && leaderboard.users) || []
  const results = (leaderboard && leaderboard.results) || {}

  const userIndex = new Map()
  users.forEach(user => {
    const userId = user.userId != null ? user.userId : user.id
    if (userId == null) return
    userIndex.set(userId, {
      userId,
      name: user.name,
      photoKey: user.photoKey || user.photo_key || null,
      points: user.points || 0,
    })
  })

  const matchById = new Map()
  ;(matches || []).forEach(match => matchById.set(match.id, match))

  const matchStats = []
  Object.keys(results).forEach(key => {
    const match = matchById.get(key) || matchById.get(Number(key))
    const outcome = matchOutcome(match)
    if (!outcome) return

    const choiceArrays = results[key] || {}
    const picks = new Map()
    const counts = { home: 0, away: 0, draw: 0 }
    CHOICES.forEach(choice => {
      ;(choiceArrays[choice] || []).forEach(userId => {
        picks.set(userId, choice)
        counts[choice] += 1
      })
    })

    const majority = strictExtreme(counts, 'max')

    matchStats.push({
      matchId: match.id,
      kickoffTime: match.kickoffTime,
      outcome,
      picks,
      counts,
      majority,
    })
  })

  matchStats.sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime))

  return {
    userIndex,
    userIds: [...userIndex.keys()],
    matchStats,
    finishedCount: matchStats.length,
  }
}

const aggregateCache = new WeakMap()

const userAggregates = data => {
  if (aggregateCache.has(data)) return aggregateCache.get(data)

  // non-predictors get skipped in calculations
  const predictors = new Set()
  data.matchStats.forEach(stat => {
    stat.picks.forEach((_choice, userId) => {
      if (data.userIndex.has(userId)) predictors.add(userId)
    })
  })

  const aggregates = new Map()
  const ensure = userId => {
    if (!aggregates.has(userId)) {
      const info = data.userIndex.get(userId)
      aggregates.set(userId, {
        userId,
        points: (info && info.points) || 0,
        preds: 0,
        correct: 0,
        bestCorrect: 0,
        curCorrect: 0,
        bestWrong: 0,
        curWrong: 0,
        currentCorrect: 0,
        currentWrong: 0,
        drawPicks: 0,
        correctDraws: 0,
        decided: 0,
        withMajority: 0,
        againstMajAttempts: 0,
        againstMajCorrect: 0,
        loneWolf: 0,
        riskItAll: 0,
      })
    }
    return aggregates.get(userId)
  }

  data.matchStats.forEach(stat => {
    // no skips, calculates consecutive only
    predictors.forEach(userId => {
      const playerStats = ensure(userId)
      const choice = stat.picks.get(userId)
      if (choice === undefined) {
        playerStats.curCorrect = 0
        playerStats.curWrong = 0
        return
      }
      if (choice === stat.outcome) {
        playerStats.curCorrect += 1
        playerStats.curWrong = 0
      } else {
        playerStats.curWrong += 1
        playerStats.curCorrect = 0
      }
      if (playerStats.curCorrect > playerStats.bestCorrect)
        playerStats.bestCorrect = playerStats.curCorrect
      if (playerStats.curWrong > playerStats.bestWrong)
        playerStats.bestWrong = playerStats.curWrong

      // Current (still-alive) streak
      playerStats.currentCorrect = playerStats.curCorrect
      playerStats.currentWrong = playerStats.curWrong
    })

    let predictorCount = 0
    let correctCount = 0
    let soleCorrectUser = null
    let soleWrongUser = null
    stat.picks.forEach((choice, userId) => {
      if (!data.userIndex.has(userId)) return
      const playerStats = ensure(userId)
      const correct = choice === stat.outcome

      predictorCount += 1
      if (correct) {
        correctCount += 1
        soleCorrectUser = userId
      } else {
        soleWrongUser = userId
      }

      playerStats.preds += 1
      if (correct) playerStats.correct += 1

      if (choice === 'draw') {
        playerStats.drawPicks += 1
        if (correct) playerStats.correctDraws += 1
      }

      if (stat.majority !== null) {
        playerStats.decided += 1
        if (choice === stat.majority) {
          playerStats.withMajority += 1
        } else {
          playerStats.againstMajAttempts += 1
          if (correct) playerStats.againstMajCorrect += 1
        }
      }
    })

    // Lone Wolf: the only correct predictor when others also tried and missed.
    if (correctCount === 1 && predictorCount >= 2) {
      ensure(soleCorrectUser).loneWolf += 1
    }
    // Risk It All: the only wrong predictor when everyone else nailed it.
    if (predictorCount - correctCount === 1 && predictorCount >= 2) {
      ensure(soleWrongUser).riskItAll += 1
    }
  })

  aggregateCache.set(data, aggregates)
  return aggregates
}

const idCompare = (a, b) => String(a.userId).localeCompare(String(b.userId))

const bestBy = (entries, comparators) => {
  if (!entries.length) return null
  return entries.slice().sort((a, b) => {
    for (let index = 0; index < comparators.length; index++) {
      const result = comparators[index](a, b)
      if (result !== 0) return result
    }
    return 0
  })[0]
}

const ratio = (numerator, denominator) =>
  denominator ? numerator / denominator : 0

// Wraps a bestBy() winner into the card's single-winner result shape (or null).
const singleResult = (winner, valueOf) =>
  winner
    ? { kind: 'single', userId: winner.userId, value: valueOf(winner) }
    : null

export const longestCorrectStreak = data => {
  const candidates = [...userAggregates(data).values()].filter(
    a => a.bestCorrect >= 3 && a.preds >= MIN_PREDICTIONS
  )
  const winner = bestBy(candidates, [
    (a, b) => b.bestCorrect - a.bestCorrect,
    (a, b) => b.preds - a.preds,
    (a, b) => b.points - a.points,
    idCompare,
  ])
  return singleResult(winner, w => w.bestCorrect)
}

export const longestIncorrectStreak = data => {
  const candidates = [...userAggregates(data).values()].filter(
    a => a.bestWrong >= 3 && a.preds >= MIN_PREDICTIONS
  )
  const winner = bestBy(candidates, [
    (a, b) => b.bestWrong - a.bestWrong,
    (a, b) => b.preds - a.preds,
    (a, b) => b.points - a.points,
    idCompare,
  ])
  return singleResult(winner, w => w.bestWrong)
}

export const currentCorrectStreak = data => {
  const candidates = [...userAggregates(data).values()].filter(
    a => a.currentCorrect >= 2 && a.preds >= MIN_PREDICTIONS
  )
  const winner = bestBy(candidates, [
    (a, b) => b.currentCorrect - a.currentCorrect,
    (a, b) => b.bestCorrect - a.bestCorrect,
    (a, b) => b.points - a.points,
    idCompare,
  ])
  return singleResult(winner, w => w.currentCorrect)
}

export const currentIncorrectStreak = data => {
  const candidates = [...userAggregates(data).values()].filter(
    a => a.currentWrong >= 2 && a.preds >= MIN_PREDICTIONS
  )
  const winner = bestBy(candidates, [
    (a, b) => b.currentWrong - a.currentWrong,
    (a, b) => b.bestWrong - a.bestWrong,
    (a, b) => b.points - a.points,
    idCompare,
  ])
  return singleResult(winner, w => w.currentWrong)
}

export const mostWrong = data => {
  const wrongCount = a => a.preds - a.correct
  const candidates = [...userAggregates(data).values()].filter(
    a => wrongCount(a) >= MIN_PREDICTIONS
  )
  const winner = bestBy(candidates, [
    (a, b) => wrongCount(b) - wrongCount(a),
    (a, b) => ratio(a.correct, a.preds) - ratio(b.correct, b.preds),
    idCompare,
  ])
  return singleResult(winner, wrongCount)
}

export const theRebel = data => {
  const candidates = [...userAggregates(data).values()].filter(
    a => a.againstMajCorrect >= 3 && a.preds >= MIN_PREDICTIONS
  )
  const winner = bestBy(candidates, [
    (a, b) => b.againstMajCorrect - a.againstMajCorrect,
    (a, b) =>
      ratio(b.againstMajCorrect, b.againstMajAttempts) -
      ratio(a.againstMajCorrect, a.againstMajAttempts),
    (a, b) => b.points - a.points,
    idCompare,
  ])
  return singleResult(winner, w => w.againstMajCorrect)
}

export const theSheep = data => {
  const candidates = [...userAggregates(data).values()].filter(
    a => a.preds >= MIN_PREDICTIONS && a.decided >= MIN_PREDICTIONS
  )
  const winner = bestBy(candidates, [
    (a, b) => b.withMajority - a.withMajority,
    (a, b) => b.points - a.points,
    idCompare,
  ])
  return singleResult(winner, w => w.withMajority)
}

export const bestAccuracy = data => {
  const candidates = [...userAggregates(data).values()].filter(
    a => a.preds >= MIN_PREDICTIONS
  )
  const winner = bestBy(candidates, [
    (a, b) => ratio(b.correct, b.preds) - ratio(a.correct, a.preds),
    (a, b) => b.preds - a.preds,
    idCompare,
  ])
  return singleResult(winner, w => ratio(w.correct, w.preds))
}

export const drawWhisperer = data => {
  const candidates = [...userAggregates(data).values()].filter(
    a => a.correctDraws >= 2
  )
  const winner = bestBy(candidates, [
    (a, b) => b.correctDraws - a.correctDraws,
    (a, b) =>
      ratio(b.correctDraws, b.drawPicks) - ratio(a.correctDraws, a.drawPicks),
    idCompare,
  ])
  return singleResult(winner, w => w.correctDraws)
}

export const loneWolf = data => {
  const candidates = [...userAggregates(data).values()].filter(
    a => a.loneWolf >= 2 && a.preds >= MIN_PREDICTIONS
  )
  const winner = bestBy(candidates, [
    (a, b) => b.loneWolf - a.loneWolf,
    (a, b) => ratio(b.correct, b.preds) - ratio(a.correct, a.preds),
    (a, b) => b.points - a.points,
    idCompare,
  ])
  return singleResult(winner, w => w.loneWolf)
}

export const riskItAll = data => {
  const candidates = [...userAggregates(data).values()].filter(
    a => a.riskItAll >= 2 && a.preds >= MIN_PREDICTIONS
  )
  const winner = bestBy(candidates, [
    (a, b) => b.riskItAll - a.riskItAll,
    (a, b) => ratio(a.correct, a.preds) - ratio(b.correct, b.preds),
    (a, b) => b.points - a.points,
    idCompare,
  ])
  return singleResult(winner, w => w.riskItAll)
}

const pairwiseExtreme = (data, maxMembers, mode) => {
  const ids = data.userIds
  if (ids.length > maxMembers) return null

  const pickMaps = new Map()
  ids.forEach(id => pickMaps.set(id, new Map()))
  data.matchStats.forEach(stat => {
    stat.picks.forEach((choice, userId) => {
      const map = pickMaps.get(userId)
      if (map) map.set(stat.matchId, choice)
    })
  })

  const candidates = []
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = pickMaps.get(ids[i])
      const b = pickMaps.get(ids[j])
      const [small, large] = a.size <= b.size ? [a, b] : [b, a]

      let coPredicted = 0
      let agreed = 0
      small.forEach((choice, matchId) => {
        if (large.has(matchId)) {
          coPredicted += 1
          if (large.get(matchId) === choice) agreed += 1
        }
      })

      if (coPredicted < MIN_PREDICTIONS) continue
      const value = mode === 'agree' ? agreed : coPredicted - agreed
      candidates.push({
        userIds: [ids[i], ids[j]],
        value,
        ratioValue: ratio(value, coPredicted),
      })
    }
  }

  const winner = bestBy(candidates, [
    (a, b) => b.value - a.value,
    (a, b) => b.ratioValue - a.ratioValue,
    (a, b) => String(a.userIds).localeCompare(String(b.userIds)),
  ])
  return winner
    ? { kind: 'pair', userIds: winner.userIds, value: winner.value }
    : null
}

export const soulMates = (data, { maxMembers = 60 } = {}) =>
  pairwiseExtreme(data, maxMembers, 'agree')

export const nemeses = (data, { maxMembers = 60 } = {}) =>
  pairwiseExtreme(data, maxMembers, 'disagree')

export const computeStats = (leaderboard, matches, options = {}) => {
  const data = buildStatsData(leaderboard, matches)
  const { maxMembers = 60 } = options
  return {
    data,
    stats: {
      longestCorrectStreak: longestCorrectStreak(data),
      longestIncorrectStreak: longestIncorrectStreak(data),
      currentCorrectStreak: currentCorrectStreak(data),
      currentIncorrectStreak: currentIncorrectStreak(data),
      mostWrong: mostWrong(data),
      theRebel: theRebel(data),
      theSheep: theSheep(data),
      soulMates: soulMates(data, { maxMembers }),
      nemeses: nemeses(data, { maxMembers }),
      bestAccuracy: bestAccuracy(data),
      drawWhisperer: drawWhisperer(data),
      loneWolf: loneWolf(data),
      riskItAll: riskItAll(data),
    },
  }
}
