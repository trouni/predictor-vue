import Repository from './repository'

export default {
  getCompetitions() {
    return Repository.get(`/competitions/`)
  },
}
