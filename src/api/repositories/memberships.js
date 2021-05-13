import Repository from './repository'

export default {
  postMembership(leaderboardId, userId) {
    return Repository.post(`/leaderboards/${leaderboardId}/memberships`, {
      userId,
    })
  },
  deleteMembership(membershipId) {
    return Repository.delete(`/memberships/${membershipId}`)
  },
}
