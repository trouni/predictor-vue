import { RepositoryFactory } from '@/api/repository-factory'
const CompetitionsRepository = RepositoryFactory.get('competitions')
import { saveState, getSavedState } from '@/utils/helpers'

export const state = {
  cached: [],
  competitions: getSavedState('competitions'),
  currentCompetitionId: getSavedState('currentCompetitionId'),
}

export const getters = {
  competitions(state) {
    return state.competitions || []
  },
  currentCompetition(_, getters) {
    return getters.competitions.find(
      competition => competition.id === getters.currentCompetitionId
    )
  },
  competitionsCount(_, getters) {
    return getters.competitions.length
  },
  currentCompetitionId(state) {
    return state.currentCompetitionId
  },
}

export const mutations = {
  SET_CURRENT_COMPETITION_ID(state, newValue) {
    state.currentCompetitionId = newValue
    saveState('currentCompetitionId', newValue)
  },
  SET_COMPETITIONS(state, newValue) {
    state.competitions = newValue
    saveState('competitions', newValue)
  },
}

export const actions = {
  fetchCompetitions({ commit }) {
    return CompetitionsRepository.getCompetitions().then(response => {
      commit('SET_COMPETITIONS', response.data)
      return response.data
    })
  },

  selectCompetition({ commit }, competitionId) {
    commit('SET_CURRENT_COMPETITION_ID', competitionId)
    return competitionId
  },

  async setDefaultCompetition({ dispatch }) {
    const competitions = await dispatch('fetchCompetitions')
    if (competitions.length > 0) {
      const competitionId =
        process.env.VUE_APP_COMPETITION_ID ||
        competitions[competitions.length - 1].id
      dispatch('selectCompetition', competitionId)
    }
  }
}
