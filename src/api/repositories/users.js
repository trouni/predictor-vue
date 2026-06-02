import Repository from './repository'

export default {
  getUser(userId, { competitionId } = {}) {
    return Repository.get(`/users/${userId}`, { params: { competitionId } })
  },
  patchUser(userId, name, photoKey, notifications) {
    return Repository.patch(`/users/${userId}`, {
      user: { name: name, photoKey: photoKey, notifications: notifications },
    })
  },
}
