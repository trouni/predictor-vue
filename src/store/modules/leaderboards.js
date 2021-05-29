import { RepositoryFactory } from '@/api/repository-factory'
const LeaderboardsRepository = RepositoryFactory.get('leaderboards')

// Not really sure about this
export const state = {
  cached: [],
  leaderboards: getSavedState('leaderboards'),
  currentLeaderboardId: getSavedState('currentLeaderboardId'),
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

  postLeaderboard({ commit }, { competitionId, name } = {}) {
    return LeaderboardsRepository.postLeaderboard(competitionId, name).then(
      response => {
        commit('SET_CURRENT_LEADERBOARD_ID', response.data.id)
        console.log(response.data)
        return response.data
      }
    )
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
