import Repository from './repository'

export default {
  getUser(userId) {
    return Repository.get(`/users/${userId}`)
  },
  patchUser(userId) {
    return Repository.patch(`/users/${userId}`)
  },
}
