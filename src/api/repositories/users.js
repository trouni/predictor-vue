import Repository from './repository'

export default {
  getUser(userId) {
    return Repository.get(`/users/${userId}`)
  },
  patchUser(userId, name) {
    return Repository.patch(`/users/${userId}`, {
      user: { name: name },
    })
  },
}
