import Repository from './repository'

export default {
  getUser(userId) {
    return Repository.get(`/users/${userId}`)
  },
}
