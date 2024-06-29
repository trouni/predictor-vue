import { RepositoryFactory } from '@/api/repository-factory'
const UsersRepository = RepositoryFactory.get('users')
import { saveState, getSavedState } from '@/utils/helpers'

export const state = {
  cached: [],
  currentUser: getSavedState('auth.currentUser'),
}

export const getters = {}

export const mutations = {
  CACHE_USER(state, newUser) {
    state.cached.push(newUser)
  },
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
  },
}

export const actions = {
  fetchUser({ commit, state, rootState }, { userId, competitionId }) {
    // 1. Check if we already have the user as a current user.
    const { currentUser } = rootState.auth
    const { currentCompetitionId } = rootState.competitions
    competitionId = competitionId || currentCompetitionId
    if (currentUser && currentUser.id === userId) {
      return Promise.resolve(currentUser)
    }

    // 2. Check if we've already fetched and cached the user.
    const matchedUser = state.cached.find(user => user.id === userId)
    if (matchedUser) {
      return Promise.resolve(matchedUser)
    }

    // 3. Fetch the user from the API and cache it in case
    //    we need it again in the future.
    return UsersRepository.getUser(userId, { competitionId }).then(response => {
      const user = response.data
      commit('CACHE_USER', user)
      return user
    })
  },
  patchUser({ commit }, { userId, name, photoKey, notifications } = {}) {
    return UsersRepository.patchUser(
      userId,
      name,
      photoKey,
      notifications
    ).then(response => {
      const user = response.data
      commit('CACHE_USER', user)
      commit('SET_CURRENT_USER', user)
      return user
    })
  },
}
