import { logIn, logOut, signUp } from '@/api/auth'
import { saveState, getSavedState, clearLocalStorage } from '@/utils/helpers'
import router from '@/router'

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
  currentUser(state) {
    return state.currentUser
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
  logIn({ commit, rootGetters, dispatch }, { email, password } = {}) {
    return logIn({ email, password }).then(async (response) => {
      const user = response.data.data
      const headers = response.headers
      commit('SET_CURRENT_USER', user)
      commit('SET_AUTH_HEADERS', headers)

      // Fetch competitions and set current competition if missing
      if (!rootGetters['competitions/currentCompetitionId']) {
        const competitions = await dispatch(
          'competitions/fetchCompetitions',
          {},
          { root: true }
        )
        if (competitions.length > 0) {
          const competitionId =
            process.env.VUE_APP_COMPETITION_ID ||
            competitions[competitions.length - 1].id
          dispatch('competitions/selectCompetition', competitionId, { root: true })
        }
      }

      return user
    })
  },

  // Updates auth headers.
  updateHeaders({ commit }, headers) {
    commit('SET_AUTH_HEADERS', headers)
  },

  // Logs out the current user.
  async logOut({ commit }) {
    try {
      await logOut()
    } finally {
      commit('SET_CURRENT_USER', null)
      commit('SET_AUTH_HEADERS', null)
      clearLocalStorage()
      router.go() // Refreshes the page with resets the in-memory store
    }
  },

  signUp(_, credentials) {
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
