import Repository from './repository'

export default {
  getLeaderboards(competitionId) {
    return Repository.get(`/competitions/${competitionId}/leaderboards`)
  },
  postLeaderboard(competitionId, leaderboard) {
    return Repository.post(
      `/competitions/${competitionId}/leaderboards`,
      leaderboard
    )
  },
  deleteLeaderboard(leaderboardId) {
    return Repository.delete(`/leaderboards/${leaderboardId}`)
  },
  joinLeaderboard(password) {
    return Repository.get(`/join/${password}`)
  },
}
