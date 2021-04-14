import Repository from './repository'

export default {
  postMembership(leagueId, userId) {
    return Repository.post(`/leagues/${leagueId}/memberships`, { userId })
  },
  deleteMembership(membershipId) {
    return Repository.delete(`/memberships/${membershipId}`)
  },
}
