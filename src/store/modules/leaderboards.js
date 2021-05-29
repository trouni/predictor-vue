import { RepositoryFactory } from '@/api/repository-factory'
const LeaderboardsRepository = RepositoryFactory.get('leaderboards')

// Not really sure about this
export const state = {
  cached: [],
  leaderboards: getSavedState('leaderboards'),
  currentLeaderboardId: getSavedState('currentLeaderboardId'),
}

export const getters = {
  // Getters are like attribute readers. You should favor them over
  // accessing the state directly when possible.
  leaderboards(state) {
    return state.leaderboards || []
  },
  currentLeaderboard(_, getters) {
    return getters.leaderboards.find(
      leaderboard => leaderboard.id === getters.currentLeaderboardId
    )
  },
  leaderboardsCount(_, getters) {
    return getters.leaderboards.length
  },
  currentLeaderboardId(state, getters) {
    if (getters.leaderboardsCount === 0) return null

    return state.currentLeaderboardId || getters.leaderboards[0].id
  },
  previousLeaderboard(_, getters) {
    return getters.leaderboards[
      getters.leaderboards.indexOf(getters.currentLeaderboard) - 1
    ]
  },
  nextLeaderboard(_, getters) {
    return getters.leaderboards[
      getters.leaderboards.indexOf(getters.currentLeaderboard) + 1
    ]
  },
}

export const mutations = {
  SET_CURRENT_LEADERBOARD_ID(state, newValue) {
    state.currentLeaderboardId = newValue
    saveState('currentLeaderboardId', newValue)
  },
  SET_LEADERBOARDS(state, newValue) {
    state.leaderboards = newValue
    saveState('leaderboards', newValue)
  },
}

export const actions = {
  fetchLeaderboards({ commit }, competitionId) {
    return LeaderboardsRepository.getLeaderboards(competitionId).then(
      response => {
        commit('SET_LEADERBOARDS', response.data)
        // check if deleted board is set as selected or non existant
        if (
          (window.localStorage.currentLeaderboardId === undefined &&
            response.data.length > 0) ||
          !JSON.parse(window.localStorage.leaderboards)
            .map(l => l.id)
            .includes(parseInt(window.localStorage.currentLeaderboardId))
        ) {
          commit('SET_CURRENT_LEADERBOARD_ID', response.data[0].id)
        }
        return response.data
      }
    )
  },

  selectLeaderboard({ commit }, leaderboardId) {
    commit('SET_CURRENT_LEADERBOARD_ID', leaderboardId)
    return leaderboardId
  },
  joinLeaderboard({ commit }, password) {
    return LeaderboardsRepository.joinLeaderboard(password).then(response => {
      commit('SET_CURRENT_LEADERBOARD_ID', response.data.id)
      return response.data
    })
  },
}

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  if (state) window.localStorage.setItem(key, JSON.stringify(state))
  else window.localStorage.removeItem(key)
}
