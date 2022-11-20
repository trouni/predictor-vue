import { RepositoryFactory } from '@/api/repository-factory'
import { saveState, getSavedState } from '@/utils/helpers'
import Vue from 'vue'
const MatchesRepository = RepositoryFactory.get('matches')

export const state = {
  cached: {},
  matches: getSavedState('matches'),
}

export const getters = {
  matches(state) {
    return state.matches || []
  },
}

export const mutations = {
  CACHE_MATCHES(state, { userId, newMatches }) {
    Vue.set(state.cached, userId, newMatches)
  },
  SET_MATCHES(state, newValue) {
    state.matches = newValue
    saveState('matches', newValue)
  },
  SET_PREDICTION(state, prediction) {
    const matchIndex = state.matches.findIndex(
      match => match.id === prediction.matchId
    )
    Vue.set(state.matches[matchIndex], 'prediction', prediction)
    saveState('matches', state.matches)
  },
}

export const actions = {
  fetchMatches({ state, commit, rootGetters }, { competitionId, userId } = {}) {
    const currentUserId = rootGetters['auth/currentUser'].id

    // Retrieve from cache or reset matches if not cached
    if (userId || currentUserId in state.cached)
      commit('SET_MATCHES', state.cached[userId || currentUserId] || [])

    const filters = {
      competitionId:
        competitionId || rootGetters['competitions/currentCompetition'].id,
    }
    if (userId) filters['userId'] = userId
    return MatchesRepository.get(filters).then(response => {
      commit('CACHE_MATCHES', {
        userId: userId || currentUserId,
        newMatches: response.data,
      })
      commit('SET_MATCHES', response.data)
      return response.data
    })
  },
  async setPrediction({ commit }, { match, choice } = {}) {
    let response
    try {
      const action = match.prediction ? 'patchPrediction' : 'postPrediction'
      response = await MatchesRepository[action](match.id, choice)
    } catch {
      response = await MatchesRepository.patchPrediction(match.id, choice)
    } finally {
      commit('SET_PREDICTION', response.data)
    }
    return response.data
  },
}
