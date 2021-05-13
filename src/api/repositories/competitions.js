import Repository from './repository'

export default {
  getCompetition(competitionId) {
    return Repository.get(`/competitions/${competitionId}`)
  },
}
