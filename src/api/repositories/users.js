import Repository from './repository'

export default {
  getUser(userId) {
    console.log(`userId in api/repo: ${userId}`)
    return Repository.get(`/users/${userId}`)
  },
  patchUser(userId, name) {
    return Repository.patch(`/users/${userId}`, {
      user: { name: name },
    })
  },
  patchPhoto(userId, photoUrl) {
    return Repository.patch(`/users/${userId}`, {
      user: { photoUrl: photoUrl },
    })
  },
}
