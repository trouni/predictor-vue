import Repository from './repository'

export default {
  get(params) {
    return Repository.get('/matches', { params })
  },
  postPrediction(matchId, choice) {
    return Repository.get(`/matches/${matchId}/predictions`, { choice })
  },
  // TODO: Confirm that we only use matchId
  patchPrediction(matchId, choice) {
    return Repository.patch(`/matches/${matchId}/predictions`, {
      choice,
    })
  },
}
