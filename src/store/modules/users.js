import { RepositoryFactory } from '@/api/repository-factory'
const UsersRepository = RepositoryFactory.get('users')

export const state = {
  cached: [],
}

export const getters = {}

export const mutations = {
  CACHE_USER(state, newUser) {
    const idx = state.cached.findIndex(u => u.id === newUser.id)
    if (idx !== -1) {
      state.cached.splice(idx, 1, newUser)
    } else {
      state.cached.push(newUser)
    }
  },
}

export const actions = {
  fetchUser({ commit, state, rootState }, { userId, competitionId }) {
    const { currentCompetitionId } = rootState.competitions
    competitionId = competitionId || currentCompetitionId

    // Check if we've already fetched and cached the user this session.
    const matchedUser = state.cached.find(user => user.id === userId)
    if (matchedUser) {
      return Promise.resolve(matchedUser)
    }

    // Fetch fresh from the API and cache it.
    return UsersRepository.getUser(userId, { competitionId }).then(response => {
      const user = response.data
      commit('CACHE_USER', user)
      return user
    })
  },
  patchUser({ commit }, { userId, name, photoKey, notifications } = {}) {
    return UsersRepository.patchUser(userId, name, photoKey, notifications).then(response => {
      const user = response.data
      commit('CACHE_USER', user)
      commit('auth/SET_CURRENT_USER', user, { root: true })
      return user
    })
  },
}
