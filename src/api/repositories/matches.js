import Repository from './repository'

export default {
  get(params) {
    return Repository.get('/matches', { params })
  },
  postPrediction(matchId, choice) {
    return Repository.post(`/matches/${matchId}/predictions`, { choice })
  },
  patchPrediction(matchId, choice) {
    return Repository.patch(`/matches/${matchId}/predictions`, { choice })
  },
}
