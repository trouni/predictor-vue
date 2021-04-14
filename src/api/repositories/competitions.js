import Repository from './repository'

export default {
  get() {
    return Repository.get('/competitions')
  },
  getCompetition(competitionId) {
    return Repository.get(`/competitions/${competitionId}`)
  },
}
