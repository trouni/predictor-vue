import { logIn, logOut, signUp } from '@/api/auth'

export const state = {
  currentUser: getSavedState('auth.currentUser'),
  headers: getSavedState('auth.headers'),
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
  },
  SET_AUTH_HEADERS(state, newValue) {
    state.headers = newValue
    saveState('auth.headers', newValue)
  },
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser && !!state.headers
  },
  headers(state) {
    return state.headers
  },
}

export const actions = {
  // This `init()` is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  // init({ state, dispatch }) {},

  // Logs in the current user.
  logIn({ commit }, { email, password } = {}) {
    return logIn({ email, password }).then(response => {
      const user = response.data
      const headers = response.headers
      commit('SET_CURRENT_USER', user)
      commit('SET_AUTH_HEADERS', headers)
      return user
    })
  },

  // Logs out the current user.
  logOut({ commit }) {
    return logOut().then(() => {
      commit('SET_CURRENT_USER', null)
      commit('SET_AUTH_HEADERS', null)
    })
  },

  signup(_, credentials) {
    return signUp(credentials)
      .then(response => {
        if (response.data.status !== 'success') {
          throw response.data.errors
        }
      })
      .catch(error => {
        throw error.response.data.errors
      })
  },
}

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  if (state) window.localStorage.setItem(key, JSON.stringify(state))
  else window.localStorage.removeItem(key)
}
