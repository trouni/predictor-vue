import { RepositoryFactory } from '@/api/repository-factory'
const LeaderboardsRepository = RepositoryFactory.get('leaderboards')

export const state = {
  cached: [],
}

export const getters = {}

export const mutations = {}

export const actions = {
  fetchLeaderboards(_, competitionId) {
    return LeaderboardsRepository.getLeaderboards(competitionId).then(
      response => response.data
    )
  },
}
