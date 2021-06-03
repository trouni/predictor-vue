import { RepositoryFactory } from '@/api/repository-factory'
import { saveState, getSavedState } from '@/utils/helpers'

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
  fetchLeaderboards(
    { commit, state, dispatch, rootGetters },
    competitionId = rootGetters['competitions/currentCompetition'].id
  ) {
    return LeaderboardsRepository.getLeaderboards(competitionId).then(
      response => {
        commit('SET_LEADERBOARDS', response.data)
        // check if current board exists
        if (!state.currentLeaderboardId && response.data.length > 0) {
          dispatch('selectLeaderboard', response.data[0].id)
        }
        return response.data
      }
    )
  },

  selectLeaderboard({ commit }, leaderboardId) {
    commit('SET_CURRENT_LEADERBOARD_ID', leaderboardId)
    return leaderboardId
  },

  joinLeaderboard({ dispatch }, password) {
    return LeaderboardsRepository.joinLeaderboard(password).then(response => {
      dispatch('selectLeaderboard', response.data.id)
      return response.data
    })
  },

  postLeaderboard({ dispatch, rootGetters }, { competitionId, name } = {}) {
    competitionId =
      competitionId || rootGetters['competitions/currentCompetition'].id
    return LeaderboardsRepository.postLeaderboard(competitionId, name).then(
      response => {
        dispatch('selectLeaderboard', response.data.id)
        return response.data.id
      }
    )
  },
}
