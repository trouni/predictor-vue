import Repository from './repository'

export default {
  getLeaderboard(competitionId) {
    return Repository.get(`/competitions/${competitionId}/leaderboard`)
  },
  postLeague(competitionId, league) {
    return Repository.post(`/competitions/${competitionId}/leagues`, league)
  },
  deleteLeague(leagueId) {
    return Repository.delete(`/leagues/${leagueId}`)
  },
}
