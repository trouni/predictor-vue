import { RepositoryFactory } from '@/api/repository-factory'
const CompetitionsRepository = RepositoryFactory.get('competitions')

export const state = {
  cached: [],
}

export const getters = {}

export const mutations = {}

export const actions = {
  fetchCompetitions() {
    return CompetitionsRepository.get().then(response => response.data)
  },
  fetchCompetition(_, competitionId) {
    return CompetitionsRepository.getCompetition(competitionId).then(
      response => response.data
    )
  },
}
