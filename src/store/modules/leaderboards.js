import { RepositoryFactory } from '@/api/repository-factory'
const LeaderboardsRepository = RepositoryFactory.get('leaderboards')

// Not really sure about this
export const state = {
  cached: [],
  leaderboards: getSavedState('leaderboards'),
  currentLeaderboard: getSavedState('currentLeaderboard'),
}

export const getters = {
  currentLeaderboard(state) {
    return state.currentLeaderboard
  },
  leaderboards(state) {
    return state.leaderboards
  },
}

export const mutations = {
  SET_CURRENT_LEADERBOARD(state, newValue) {
    state.currentLeaderboard = newValue
    saveState('currentLeaderboard', newValue)
  },
  SET_LEADERBOARDS(state, newValue) {
    state.headers = newValue
    saveState('leaderboards', newValue)
  },
}

export const actions = {
  fetchLeaderboards({ commit }, competitionId) {
    return LeaderboardsRepository.getLeaderboards(competitionId).then(
      response => {
        commit('SET_LEADERBOARDS', response.data)
        if (
          window.localStorage.currentLeaderboard === undefined &&
          response.data.length > 0
        ) {
          commit('SET_CURRENT_LEADERBOARD', response.data[0].id)
        }
        return response.data
      }
    )
  },

  selectLeaderboard({ commit }, { _, leaderboardId }) {
    commit('SET_CURRENT_LEADERBOARD', leaderboardId)
    return leaderboardId
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
