import { RepositoryFactory } from '@/api/repository-factory'
const MatchesRepository = RepositoryFactory.get('matches')

export const state = {
  cached: [],
}

export const getters = {}

export const mutations = {}

export const actions = {
  fetchMatches(_, filters) {
    return MatchesRepository.get(filters).then(response => {
      const matches = response.data
      return matches
    })
  },
}
