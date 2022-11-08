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
  currentCompetitionId(state, getters) {
    if (getters.competitionsCount === 0) return null

    return state.currentCompetitionId || getters.competitions[0].id
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
  fetchCompetitions({ dispatch, commit, state }) {
    return CompetitionsRepository.getCompetitions().then(response => {
      commit('SET_COMPETITIONS', response.data)
      if (!state.currentCompetitionId && response.data.length > 0) {
        // TODO: The comepetition id was default at first [0], now last.
        console.log(response.data)
        dispatch(
          'selectCompetition',
          response.data[response.data.length - 1].id
        )
      }
      return response.data
    })
  },

  selectCompetition({ commit }, competitionId) {
    commit('SET_CURRENT_COMPETITION_ID', competitionId)
    return competitionId
  },
}
