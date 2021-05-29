import { RepositoryFactory } from '@/api/repository-factory'
const LeaderboardsRepository = RepositoryFactory.get('leaderboards')

// Not really sure about this
export const state = {
  cached: [],
  leaderboards: getSavedState('leaderboards'),
  currentLeaderboardId: parseInt(getSavedState('currentLeaderboardId')),
}

export const getters = {
  currentLeaderboardId(state) {
    return state.currentLeaderboardId
  },
  leaderboards(state) {
    return state.leaderboards
  },
  currentLeaderboard(state) {
    return state.leaderboards.find(
      leaderboard => leaderboard.id === state.currentLeaderboardId
    )
  },
}

export const mutations = {
  SET_CURRENT_LEADERBOARD_ID(state, newValue) {
    state.currentLeaderboardId = newValue
    saveState('currentLeaderboardId', newValue)
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
          window.localStorage.currentLeaderboardId === undefined &&
          response.data.length > 0
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
