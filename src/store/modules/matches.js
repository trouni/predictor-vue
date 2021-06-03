import { RepositoryFactory } from '@/api/repository-factory'
const MatchesRepository = RepositoryFactory.get('matches')

export const state = {
  cached: [],
}

export const getters = {}

export const mutations = {}

export const actions = {
  fetchMatches({ rootGetters }, { competitionId, userId } = {}) {
    const filters = {
      competitionId:
        competitionId || rootGetters['competitions/currentCompetition'].id,
    }
    if (userId) filters['userId'] = userId
    return MatchesRepository.get(filters).then(response => response.data)
  },
  setPrediction(_, { match, choice }) {
    const action = match.prediction ? 'patchPrediction' : 'postPrediction'
    return MatchesRepository[action](match.id, choice).then(
      response => response.data
    )
  },
}
